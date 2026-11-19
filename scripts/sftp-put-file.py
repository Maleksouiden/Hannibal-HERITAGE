#!/usr/bin/env python3
"""Upload one local file to Hostinger public_html via SFTP."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import paramiko

HOST = os.environ.get("HOSTINGER_SSH_HOST", "191.101.13.5")
PORT = int(os.environ.get("HOSTINGER_SSH_PORT", "65002"))
USER = os.environ.get("HOSTINGER_SSH_USER", "u850937302")
PASSWORD = os.environ["HOSTINGER_SSH_PASSWORD"]
LOCAL = Path(os.environ["HOSTINGER_LOCAL_FILE"])
REMOTE_REL = os.environ["HOSTINGER_REMOTE_REL"]  # e.g. scripts/rembg_cli.py
DOMAIN = os.environ.get(
    "HOSTINGER_DOMAIN", "darkslategrey-turkey-880639.hostingersite.com"
)


def main() -> int:
    if not LOCAL.is_file():
        print("MISSING", LOCAL, flush=True)
        return 1
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
    sftp = client.open_sftp()
    remote = f"domains/{DOMAIN}/public_html/{REMOTE_REL}".replace("//", "/")
    # ensure parent exists
    parent = "/".join(remote.split("/")[:-1])
    try:
        sftp.stat(parent)
    except OSError:
        # mkdir -p style
        parts = parent.split("/")
        cur = ""
        for p in parts:
            if not p:
                continue
            cur = f"{cur}/{p}" if cur else p
            try:
                sftp.stat(cur)
            except OSError:
                sftp.mkdir(cur)
    sftp.put(str(LOCAL), remote)
    st = sftp.stat(remote)
    print(f"UPLOADED {remote} size={st.st_size}", flush=True)
    sftp.close()
    client.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print("FAIL", type(exc).__name__, exc, flush=True)
        raise SystemExit(1)
