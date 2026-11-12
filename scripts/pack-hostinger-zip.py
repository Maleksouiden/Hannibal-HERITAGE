#!/usr/bin/env python3
"""Build Hannibal-hostinger.zip with Unix 755/644 modes (Hostinger-safe).

Windows Compress-Archive writes external_attr=0 → Linux extract gets mode 000
and Next.js fails with EACCES on scandir (e.g. src/app/api/account).
"""

from __future__ import annotations

import os
import shutil
import stat
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
STAGE = DIST / "hostinger-stage"
ZIP_PATH = DIST / "Hannibal-hostinger.zip"
MEDIA_ZIP = Path(
    r"C:\Users\CC\AppData\Local\Cursor\AgentStores"
    r"\cursor_agent_stores\bc-4fb6321b-7e7e-45c9-aa78-d35803fa740c"
    r"\files\media\Hannibal-hostinger.zip"
)

INCLUDE_DIRS = ("src", "public", "prisma", "scripts")
INCLUDE_FILES = (
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "postcss.config.mjs",
    "tsconfig.json",
    "eslint.config.mjs",
    "prisma7.config.ts",
    ".env.example",
    "README-HOSTINGER.md",
    "README.md",
    ".gitignore",
    "docker-compose.yml",
)

# Unix create_system + mode in high 16 bits; MS-DOS dir bit for directories.
UNIX = 3
DIR_ATTR = (0o755 << 16) | 0x10
FILE_ATTR = 0o644 << 16


def reset_stage() -> None:
    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir(parents=True, exist_ok=True)
    DIST.mkdir(parents=True, exist_ok=True)


def copy_tree() -> None:
    for name in INCLUDE_DIRS:
        src = ROOT / name
        if src.is_dir():
            shutil.copytree(src, STAGE / name)

    # Never ship generated Prisma client
    generated = STAGE / "src" / "generated"
    if generated.exists():
        shutil.rmtree(generated)

    uploads = STAGE / "public" / "uploads"
    if uploads.is_dir():
        for child in uploads.iterdir():
            if child.name != ".gitkeep":
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink()

    for name in INCLUDE_FILES:
        src = ROOT / name
        if src.is_file():
            shutil.copy2(src, STAGE / name)

    for forbidden in (".env", "node_modules", ".next", ".git"):
        path = STAGE / forbidden
        if path.exists():
            if path.is_dir():
                shutil.rmtree(path)
            else:
                path.unlink()


def add_dir(zf: zipfile.ZipFile, arcname: str) -> None:
    arc = arcname.replace("\\", "/").rstrip("/") + "/"
    info = zipfile.ZipInfo(arc)
    info.create_system = UNIX
    info.external_attr = DIR_ATTR
    zf.writestr(info, b"")


def add_file(zf: zipfile.ZipFile, path: Path, arcname: str) -> None:
    arc = arcname.replace("\\", "/")
    info = zipfile.ZipInfo.from_file(path, arcname=arc)
    info.create_system = UNIX
    info.external_attr = FILE_ATTR
    # Keep a stable, compressible method
    with path.open("rb") as fh:
        zf.writestr(info, fh.read(), compress_type=zipfile.ZIP_DEFLATED)


def write_zip() -> None:
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()

    # Ensure every parent dir of every file is an explicit 755 entry
    dirs: set[str] = set()
    files: list[tuple[Path, str]] = []

    for path in STAGE.rglob("*"):
        rel = path.relative_to(STAGE).as_posix()
        if path.is_dir():
            dirs.add(rel)
            parent = Path(rel).parent
            while parent.as_posix() not in (".", ""):
                dirs.add(parent.as_posix())
                parent = parent.parent
        elif path.is_file():
            files.append((path, rel))
            parent = Path(rel).parent
            while parent.as_posix() not in (".", ""):
                dirs.add(parent.as_posix())
                parent = parent.parent

    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for d in sorted(dirs):
            add_dir(zf, d)
        for path, rel in sorted(files, key=lambda x: x[1]):
            add_file(zf, path, rel)


def verify() -> None:
    with zipfile.ZipFile(ZIP_PATH) as zf:
        infos = zf.infolist()
        account = [
            i
            for i in infos
            if i.filename.replace("\\", "/")
            in ("src/app/api/account/", "src/app/api/account/route.ts")
        ]
        bad = []
        for i in infos:
            mode = (i.external_attr >> 16) & 0o7777
            expect = 0o755 if i.is_dir() or i.filename.endswith("/") else 0o644
            if mode != expect or i.create_system != UNIX:
                bad.append((i.filename, oct(mode), i.create_system))

        print(f"ZIP_BYTES={ZIP_PATH.stat().st_size}")
        print(f"ENTRIES={len(infos)}")
        print(f"account_entries={[i.filename for i in account]}")
        print(
            "account_modes="
            + str([(i.filename, oct((i.external_attr >> 16) & 0o7777)) for i in account])
        )
        has_generated = any(
            i.filename.replace("\\", "/").startswith("src/generated") for i in infos
        )
        print(f"has_src_generated={has_generated}")
        print(f"bad_perm_count={len(bad)}")
        if bad[:5]:
            print(f"bad_perm_sample={bad[:5]}")
        if not account:
            raise SystemExit("FAIL: src/app/api/account missing from ZIP")
        if has_generated:
            raise SystemExit("FAIL: src/generated present in ZIP")
        if bad:
            raise SystemExit("FAIL: ZIP entries missing Unix 755/644 modes")


def copy_media() -> None:
    MEDIA_ZIP.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ZIP_PATH, MEDIA_ZIP)
    print(f"MEDIA_BYTES={MEDIA_ZIP.stat().st_size}")
    print(f"MEDIA_MATCH={MEDIA_ZIP.stat().st_size == ZIP_PATH.stat().st_size}")


def main() -> None:
    reset_stage()
    copy_tree()
    # Sanity: account route must exist in stage
    account = STAGE / "src" / "app" / "api" / "account" / "route.ts"
    if not account.is_file():
        raise SystemExit(f"FAIL: missing readable {account}")
    if not os.access(account, os.R_OK):
        raise SystemExit(f"FAIL: not readable {account}")
    print(f"OK_ACCOUNT={account}")

    write_zip()
    verify()
    copy_media()
    shutil.rmtree(STAGE)
    print("DONE")


if __name__ == "__main__":
    main()
