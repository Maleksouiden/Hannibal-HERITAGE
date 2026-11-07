#!/usr/bin/env python3
"""
Hannibal HERITAGE Windows bootstrap.

- Ensures Git + Node.js (via winget/choco when possible)
- Clones/updates https://github.com/Maleksouiden/Hannibal-HERITAGE
- npm install on first run (or when marker missing)
- Copies .env.example → .env if needed
- Starts `npm run dev` and opens http://localhost:3000

Idempotent: `.hannibal-setup-ok` in the install dir skips heavy reinstall.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import time
import webbrowser
from pathlib import Path

REPO_URL = "https://github.com/Maleksouiden/Hannibal-HERITAGE.git"
DEFAULT_DIR = Path.home() / "Documents" / "GitHub" / "Hannibal"
MARKER_NAME = ".hannibal-setup-ok"
APP_URL = "http://localhost:3000"


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
) -> subprocess.CompletedProcess[str]:
    log(f"> {' '.join(args)}")
    return subprocess.run(
        args,
        cwd=str(cwd) if cwd else None,
        check=check,
        text=True,
        capture_output=capture,
    )


def ensure_git() -> None:
    if which("git"):
        log("Git: found")
        return
    log("Git not found. Trying winget…")
    if which("winget"):
        run(
            [
                "winget",
                "install",
                "--id",
                "Git.Git",
                "-e",
                "--accept-source-agreements",
                "--accept-package-agreements",
            ],
            check=False,
        )
    if not which("git"):
        log("ERROR: Install Git from https://git-scm.com/download/win then re-run.")
        sys.exit(1)
    log("Git: installed")


def ensure_node() -> None:
    if which("node") and which("npm"):
        ver = run(["node", "-v"], capture=True, check=False)
        log(f"Node: {ver.stdout.strip() if ver.stdout else 'found'}")
        return
    log("Node.js not found. Trying winget (OpenJS.NodeJS.LTS)…")
    if which("winget"):
        run(
            [
                "winget",
                "install",
                "--id",
                "OpenJS.NodeJS.LTS",
                "-e",
                "--accept-source-agreements",
                "--accept-package-agreements",
            ],
            check=False,
        )
    elif which("choco"):
        run(["choco", "install", "nodejs-lts", "-y"], check=False)
    # Refresh PATH for this process (common Node install locations)
    for extra in (
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "nodejs",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "nodejs",
    ):
        if extra.is_dir():
            os.environ["PATH"] = str(extra) + os.pathsep + os.environ.get("PATH", "")
    if not (which("node") and which("npm")):
        log(
            "ERROR: Install Node.js LTS from https://nodejs.org/ then re-run setup."
        )
        sys.exit(1)
    log("Node: ready")


def install_dir() -> Path:
    env = os.environ.get("HANNIBAL_HOME")
    if env:
        return Path(env)
    # Prefer next to the exe when frozen
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent / "Hannibal"
    return DEFAULT_DIR


def sync_repo(target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    git_dir = target / ".git"
    if git_dir.is_dir():
        log(f"Updating repo in {target}")
        run(["git", "fetch", "origin"], cwd=target, check=False)
        run(["git", "checkout", "master"], cwd=target, check=False)
        run(["git", "pull", "origin", "master"], cwd=target, check=False)
        return
    if target.exists() and any(target.iterdir()):
        log(f"ERROR: {target} exists but is not a git clone. Pick another folder.")
        sys.exit(1)
    log(f"Cloning {REPO_URL} → {target}")
    run(["git", "clone", "--branch", "master", REPO_URL, str(target)])


def ensure_env(target: Path) -> None:
    env_path = target / ".env"
    example = target / ".env.example"
    if env_path.exists():
        log(".env: exists")
        return
    if example.exists():
        shutil.copy(example, env_path)
        log(".env: created from .env.example (edit DB credentials if needed)")
    else:
        log("WARN: no .env.example found")


def npm_install(target: Path) -> None:
    log("Running npm install…")
    run(["npm", "install"], cwd=target)


def note_mysql(target: Path) -> None:
    log(
        "MySQL: optional for first launch. Storefront falls back to static catalogs "
        "if DB is down. Later: docker compose up -d && npm run db:migrate && npm run db:seed"
    )
    compose = target / "docker-compose.yml"
    if compose.exists() and which("docker"):
        log("Tip: Docker found — you can run `docker compose up -d` inside the project.")


def wait_for_app(url: str, timeout_s: int = 90) -> bool:
    try:
        import urllib.request
    except ImportError:
        return False
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as resp:
                if 200 <= getattr(resp, "status", 200) < 500:
                    return True
        except Exception:
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
    log("=== Hannibal HERITAGE setup ===")
    ensure_git()
    ensure_node()

    target = install_dir()
    sync_repo(target)
    ensure_env(target)
    note_mysql(target)

    marker = target / MARKER_NAME
    node_modules = target / "node_modules"
    if marker.exists() and node_modules.is_dir():
        log("Previous install detected — skipping npm install.")
    else:
        npm_install(target)
        write_marker(target)

    # Soft update of marker timestamp even on skip path after successful pull
    write_marker(target)

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
