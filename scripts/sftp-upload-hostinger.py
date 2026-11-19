#!/usr/bin/env python3
"""One-shot SFTP upload of Hannibal-hostinger.zip. Do not commit credentials."""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import paramiko

HOST = os.environ.get("HOSTINGER_SSH_HOST", "191.101.13.5")
PORT = int(os.environ.get("HOSTINGER_SSH_PORT", "65002"))
USER = os.environ.get("HOSTINGER_SSH_USER", "u850937302")
PASSWORD = os.environ["HOSTINGER_SSH_PASSWORD"]
ZIP_PATH = Path(
    os.environ.get(
        "HOSTINGER_ZIP",
        Path(__file__).resolve().parents[1] / "dist" / "Hannibal-hostinger.zip",
    )
)
REMOTE_NAME = "Hannibal-hostinger.zip"


def main() -> int:
    print(f"CONNECT {USER}@{HOST}:{PORT}", flush=True)
    print(f"ZIP {ZIP_PATH} bytes={ZIP_PATH.stat().st_size}", flush=True)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        HOST,
        port=PORT,
        username=USER,
        password=PASSWORD,
        timeout=45,
        banner_timeout=45,
        auth_timeout=45,
        allow_agent=False,
        look_for_keys=False,
    )
    print("AUTH_OK", flush=True)

    stdin, stdout, stderr = client.exec_command(
        "pwd; ls -la; ls domains 2>/dev/null; "
        "ls domains/*/public_html 2>/dev/null | head -n 20"
    )
    print(stdout.read().decode("utf-8", "replace"), flush=True)
    err = stderr.read().decode("utf-8", "replace").strip()
    if err:
        print("STDERR", err[:500], flush=True)

    sftp = client.open_sftp()
    candidates: list[str] = []
    try:
        for d in sftp.listdir("domains"):
            candidates.append(f"domains/{d}/public_html")
    except OSError as exc:
        print("domains list fail:", exc, flush=True)
    candidates += ["public_html", "."]

    target_dir = "."
    for c in candidates:
        try:
            sftp.stat(c)
            target_dir = c
            print("USE_DIR", c, flush=True)
            break
        except OSError:
            continue

    remote = f"{target_dir}/{REMOTE_NAME}".replace("//", "/")
    print("UPLOAD_TO", remote, flush=True)
    t0 = time.time()
    last = -1

    def cb(transferred: int, total: int) -> None:
        nonlocal last
        mb = transferred // (5 * 1024 * 1024)
        if mb != last or transferred == total:
            last = mb
            print(f"PROGRESS {transferred}/{total}", flush=True)

    sftp.put(str(ZIP_PATH), remote, callback=cb)
    st = sftp.stat(remote)
    print("UPLOAD_DONE", round(time.time() - t0, 1), "s size=", st.st_size, flush=True)
    sftp.close()
    client.close()
    print("DONE", flush=True)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print("FAIL", type(exc).__name__, exc, flush=True)
        raise SystemExit(1)
