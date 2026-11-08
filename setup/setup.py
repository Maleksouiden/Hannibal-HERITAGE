#!/usr/bin/env python3
"""
Hannibal HERITAGE Windows bootstrap (blank-PC safe).

- Requests Administrator (UAC) at start
- Installs Git, Node.js LTS, Docker Desktop when missing
  (winget → Chocolatey → official silent installers)
- Refreshes PATH after installs, then continues
- Clones/updates the repo, npm install, .env, MySQL via Docker,
  Prisma generate/migrate/seed, npm run dev → http://localhost:3000

Idempotent: `.hannibal-setup-ok` skips heavy npm reinstall when node_modules exists.
"""

from __future__ import annotations

import ctypes
import os
import secrets
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
import webbrowser
from pathlib import Path

REPO_URL = "https://github.com/Maleksouiden/Hannibal-HERITAGE.git"
DEFAULT_DIR = Path.home() / "Documents" / "GitHub" / "Hannibal"
MARKER_NAME = ".hannibal-setup-ok"
APP_URL = "http://localhost:3000"

# Official silent-installer fallbacks (pinned major channels).
GIT_INSTALLER_URL = (
    "https://github.com/git-for-windows/git/releases/download/"
    "v2.47.1.windows.1/Git-2.47.1-64-bit.exe"
)
NODE_INSTALLER_URL = "https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi"
DOCKER_INSTALLER_URL = (
    "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
)


def log(msg: str) -> None:
    print(msg, flush=True)


def which(cmd: str) -> str | None:
    return shutil.which(cmd)


def run(
    args: list[str],
    *,
    cwd: Path | None = None,
    check: bool = True,
    capture: bool = False,
    env: dict[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    log(f"> {' '.join(args)}")
    return subprocess.run(
        args,
        cwd=str(cwd) if cwd else None,
        check=check,
        text=True,
        capture_output=capture,
        env=env,
    )


def ensure_admin() -> None:
    """Relaunch elevated via UAC when not already Administrator."""
    if sys.platform != "win32":
        return
    try:
        if bool(ctypes.windll.shell32.IsUserAnAdmin()):
            log("Admin: elevated")
            return
    except Exception:
        pass

    log("Requesting administrator privileges (UAC)…")
    if getattr(sys, "frozen", False):
        exe = str(Path(sys.executable).resolve())
        params = subprocess.list2cmdline(sys.argv[1:])
    else:
        exe = str(Path(sys.executable).resolve())
        script = str(Path(__file__).resolve())
        params = subprocess.list2cmdline([script, *sys.argv[1:]])

    rc = int(
        ctypes.windll.shell32.ShellExecuteW(
            None, "runas", exe, params or None, None, 1
        )
    )
    if rc <= 32:
        log("ERROR: Administrator elevation was declined or failed. Re-run as admin.")
        sys.exit(1)
    # Elevated child continues; this process exits.
    sys.exit(0)


def refresh_path() -> None:
    """Reload Machine + User PATH into this process (post winget/choco)."""
    if sys.platform != "win32":
        return
    import winreg

    chunks: list[str] = []
    for root, subkey in (
        (
            winreg.HKEY_LOCAL_MACHINE,
            r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment",
        ),
        (winreg.HKEY_CURRENT_USER, r"Environment"),
    ):
        try:
            with winreg.OpenKey(root, subkey) as key:
                val, _ = winreg.QueryValueEx(key, "Path")
                if val:
                    chunks.append(str(val))
        except OSError:
            pass

    extras = [
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "Git" / "cmd",
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "Git" / "bin",
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "nodejs",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "nodejs",
        Path(os.environ.get("ProgramFiles", r"C:\Program Files"))
        / "Docker"
        / "Docker"
        / "resources"
        / "bin",
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "Docker" / "Docker",
    ]
    parts: list[str] = []
    for block in chunks:
        parts.extend(p for p in block.split(os.pathsep) if p)
    for extra in extras:
        if extra.is_dir():
            parts.insert(0, str(extra))
    # Keep current PATH entries that may include this Python / System32.
    for p in os.environ.get("PATH", "").split(os.pathsep):
        if p and p not in parts:
            parts.append(p)
    os.environ["PATH"] = os.pathsep.join(parts)


def winget_install(package_id: str) -> bool:
    if not which("winget"):
        return False
    run(
        [
            "winget",
            "install",
            "--id",
            package_id,
            "-e",
            "--silent",
            "--disable-interactivity",
            "--accept-source-agreements",
            "--accept-package-agreements",
        ],
        check=False,
    )
    refresh_path()
    # winget exit codes vary (0, already-installed, etc.); caller verifies via which().
    return True


def ensure_chocolatey() -> bool:
    if which("choco"):
        return True
    log("Chocolatey not found — installing (fallback)…")
    ps = (
        "Set-ExecutionPolicy Bypass -Scope Process -Force; "
        "[System.Net.ServicePointManager]::SecurityProtocol = "
        "[System.Net.ServicePointManager]::SecurityProtocol -bor 3072; "
        "iex ((New-Object System.Net.WebClient).DownloadString("
        "'https://community.chocolatey.org/install.ps1'))"
    )
    cp = run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps],
        check=False,
    )
    refresh_path()
    return cp.returncode == 0 and bool(which("choco"))


def choco_install(package: str) -> bool:
    if not ensure_chocolatey():
        return False
    cp = run(["choco", "install", package, "-y", "--no-progress"], check=False)
    refresh_path()
    return cp.returncode == 0


def download_file(url: str, dest: Path) -> None:
    log(f"Downloading {url}")
    urllib.request.urlretrieve(url, str(dest))


def run_installer(path: Path, args: list[str]) -> bool:
    cp = run([str(path), *args], check=False)
    refresh_path()
    return cp.returncode == 0


def ensure_git() -> None:
    refresh_path()
    if which("git"):
        log("Git: found")
        return
    log("Git missing — installing…")
    if winget_install("Git.Git") and which("git"):
        log("Git: installed via winget")
        return
    if choco_install("git") and which("git"):
        log("Git: installed via Chocolatey")
        return
    with tempfile.TemporaryDirectory() as td:
        exe = Path(td) / "Git-setup.exe"
        try:
            download_file(GIT_INSTALLER_URL, exe)
            if run_installer(exe, ["/VERYSILENT", "/NORESTART", "/NOCANCEL"]):
                refresh_path()
        except Exception as exc:
            log(f"Git official installer failed: {exc}")
    if not which("git"):
        log("ERROR: Could not install Git. Install from https://git-scm.com/download/win")
        sys.exit(1)
    log("Git: installed")


def ensure_node() -> None:
    refresh_path()
    if which("node") and which("npm"):
        ver = run(["node", "-v"], capture=True, check=False)
        log(f"Node: {ver.stdout.strip() if ver.stdout else 'found'}")
        return
    log("Node.js missing — installing LTS…")
    if winget_install("OpenJS.NodeJS.LTS") and which("node") and which("npm"):
        log("Node: installed via winget")
        return
    if choco_install("nodejs-lts") and which("node") and which("npm"):
        log("Node: installed via Chocolatey")
        return
    with tempfile.TemporaryDirectory() as td:
        msi = Path(td) / "node-lts.msi"
        try:
            download_file(NODE_INSTALLER_URL, msi)
            cp = run(
                ["msiexec", "/i", str(msi), "/qn", "/norestart"],
                check=False,
            )
            refresh_path()
            if cp.returncode != 0:
                log(f"msiexec exit {cp.returncode}")
        except Exception as exc:
            log(f"Node official installer failed: {exc}")
    if not (which("node") and which("npm")):
        log("ERROR: Could not install Node.js LTS. Install from https://nodejs.org/")
        sys.exit(1)
    log("Node: ready")


def docker_ready() -> bool:
    refresh_path()
    if not which("docker"):
        return False
    cp = run(["docker", "info"], check=False, capture=True)
    return cp.returncode == 0


def start_docker_desktop() -> None:
    candidates = [
        Path(os.environ.get("ProgramFiles", r"C:\Program Files"))
        / "Docker"
        / "Docker"
        / "Docker Desktop.exe",
        Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"))
        / "Docker"
        / "Docker"
        / "Docker Desktop.exe",
    ]
    for exe in candidates:
        if exe.is_file():
            log(f"Starting Docker Desktop: {exe}")
            subprocess.Popen(
                [str(exe)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            return


def ensure_docker() -> bool:
    """Install/start Docker Desktop. Returns True when `docker info` works."""
    if docker_ready():
        log("Docker: ready")
        return True
    refresh_path()
    if not which("docker"):
        log("Docker Desktop missing — installing (needed for MySQL)…")
        installed = False
        if winget_install("Docker.DockerDesktop"):
            installed = True
        elif choco_install("docker-desktop"):
            installed = True
        else:
            with tempfile.TemporaryDirectory() as td:
                exe = Path(td) / "DockerDesktopInstaller.exe"
                try:
                    download_file(DOCKER_INSTALLER_URL, exe)
                    installed = run_installer(
                        exe, ["install", "--quiet", "--accept-license"]
                    )
                except Exception as exc:
                    log(f"Docker official installer failed: {exc}")
        refresh_path()
        if not installed and not which("docker"):
            log(
                "WARN: Docker Desktop install failed. "
                "Install from https://www.docker.com/products/docker-desktop/ then re-run."
            )
            return False

    start_docker_desktop()
    log("Waiting for Docker engine (up to ~3 minutes)…")
    deadline = time.time() + 180
    while time.time() < deadline:
        if docker_ready():
            log("Docker: ready")
            return True
        time.sleep(5)
    log(
        "WARN: Docker installed but engine not ready yet "
        "(reboot / enable WSL2 may be required). Continuing without DB for now."
    )
    return False


def looks_like_repo(path: Path) -> bool:
    return (path / ".git").is_dir() and (path / "package.json").is_file()


def install_dir() -> Path:
    env = os.environ.get("HANNIBAL_HOME")
    if env:
        return Path(env)

    candidates: list[Path] = []
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        candidates.extend(
            [
                exe_dir,
                exe_dir.parent,  # setup/dist → repo
                exe_dir.parent.parent,
            ]
        )
    else:
        here = Path(__file__).resolve().parent
        candidates.extend([here.parent, DEFAULT_DIR])

    for c in candidates:
        if looks_like_repo(c):
            return c

    return DEFAULT_DIR


def sync_repo(target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    if looks_like_repo(target):
        log(f"Updating repo in {target}")
        run(["git", "fetch", "origin"], cwd=target, check=False)
        run(["git", "checkout", "master"], cwd=target, check=False)
        run(["git", "pull", "origin", "master"], cwd=target, check=False)
        return
    if target.exists() and any(target.iterdir()):
        log(f"ERROR: {target} exists but is not a git clone. Set HANNIBAL_HOME.")
        sys.exit(1)
    log(f"Cloning {REPO_URL} → {target}")
    run(["git", "clone", "--branch", "master", REPO_URL, str(target)])


def ensure_env(target: Path) -> None:
    env_path = target / ".env"
    example = target / ".env.example"
    if env_path.exists():
        log(".env: exists")
        return
    if not example.exists():
        log("WARN: no .env.example found")
        return
    text = example.read_text(encoding="utf-8")
    if 'AUTH_SECRET="change-me-to-a-long-random-secret"' in text:
        text = text.replace(
            'AUTH_SECRET="change-me-to-a-long-random-secret"',
            f'AUTH_SECRET="{secrets.token_urlsafe(48)}"',
        )
    env_path.write_text(text, encoding="utf-8")
    log(".env: created from .env.example (AUTH_SECRET randomized)")


def npm_install(target: Path) -> None:
    log("Running npm install…")
    run(["npm", "install"], cwd=target)


def ensure_mysql_and_prisma(target: Path, docker_ok: bool) -> None:
    compose = target / "docker-compose.yml"
    if docker_ok and compose.exists():
        log("Starting MySQL via docker compose…")
        run(["docker", "compose", "up", "-d"], cwd=target, check=False)
        # Wait for health
        deadline = time.time() + 120
        while time.time() < deadline:
            cp = run(
                [
                    "docker",
                    "compose",
                    "ps",
                    "--status",
                    "running",
                    "--format",
                    "{{.Name}}",
                ],
                cwd=target,
                check=False,
                capture=True,
            )
            if cp.returncode == 0 and "hannibal-mysql" in (cp.stdout or ""):
                # brief settle for mysqld ready
                time.sleep(8)
                break
            time.sleep(3)
    else:
        log(
            "MySQL/Docker skipped or unavailable — storefront can use static catalogs. "
            "Later: docker compose up -d && npm run db:generate && "
            "npx prisma migrate deploy && npm run db:seed"
        )
        return

    log("Prisma: generate + migrate deploy + seed…")
    run(["npm", "run", "db:generate"], cwd=target, check=False)
    # Non-interactive (migrate dev prompts for a name).
    run(["npx", "prisma", "migrate", "deploy"], cwd=target, check=False)
    run(["npm", "run", "db:seed"], cwd=target, check=False)


def app_is_up(url: str, timeout_s: float = 2.0) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=timeout_s) as resp:
            return 200 <= getattr(resp, "status", 200) < 500
    except Exception:
        return False


def wait_for_app(url: str, timeout_s: int = 90) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        if app_is_up(url):
            return True
        time.sleep(1.5)
    return False


def start_dev(target: Path) -> subprocess.Popen[str]:
    log("Starting Next.js (npm run dev)…")
    creation = 0
    if sys.platform == "win32":
        creation = subprocess.CREATE_NEW_CONSOLE  # type: ignore[attr-defined]
    return subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(target),
        creationflags=creation,
    )


def write_marker(target: Path) -> None:
    marker = target / MARKER_NAME
    marker.write_text(
        f"ok\nrepo={REPO_URL}\nupdated={time.strftime('%Y-%m-%dT%H:%M:%S')}\n",
        encoding="utf-8",
    )


def main() -> int:
    log("=== Hannibal HERITAGE setup (blank-PC) ===")
    ensure_admin()
    refresh_path()

    ensure_git()
    ensure_node()
    docker_ok = ensure_docker()

    target = install_dir()
    sync_repo(target)
    ensure_env(target)

    marker = target / MARKER_NAME
    node_modules = target / "node_modules"
    if marker.exists() and node_modules.is_dir():
        log("Previous install detected — skipping npm install.")
    else:
        npm_install(target)
    write_marker(target)

    ensure_mysql_and_prisma(target, docker_ok)

    if app_is_up(APP_URL):
        log(f"{APP_URL} already running — leaving it as-is.")
        webbrowser.open(APP_URL)
        log(f"Project folder: {target}")
        return 0

    proc = start_dev(target)
    log(f"Waiting for {APP_URL} …")
    if wait_for_app(APP_URL):
        webbrowser.open(APP_URL)
        log(f"Opened {APP_URL}")
    else:
        log(f"Server still starting — open {APP_URL} manually when ready.")

    log("Dev server is running in another window. Close that window to stop.")
    log(f"Project folder: {target}")
    try:
        proc.wait()
    except KeyboardInterrupt:
        proc.terminate()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
