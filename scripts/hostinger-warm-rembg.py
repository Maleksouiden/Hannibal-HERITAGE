#!/usr/bin/env python3
"""Pre-download rembg model on Hostinger so API requests stay under nginx timeout."""

from __future__ import annotations

import os
import sys

import paramiko

HOST = os.environ.get("HOSTINGER_SSH_HOST", "191.101.13.5")
PORT = int(os.environ.get("HOSTINGER_SSH_PORT", "65002"))
USER = os.environ.get("HOSTINGER_SSH_USER", "u850937302")
PASSWORD = os.environ["HOSTINGER_SSH_PASSWORD"]

REMOTE_SCRIPT = r"""
set -euo pipefail
export HOME=/home/u850937302
DOM="$HOME/domains/darkslategrey-turkey-880639.hostingersite.com"
PY="$DOM/.venv-rembg/bin/python"
SCRIPT="$DOM/public_html/scripts/rembg_cli.py"
ls -la "$PY" "$SCRIPT"
"$PY" -c "from PIL import Image; Image.new('RGB',(64,64),(0,128,0)).save('/tmp/hh-warm.png'); print('PNG_OK')"
"$PY" "$SCRIPT" -i /tmp/hh-warm.png -o /tmp/hh-warm-out.png --model isnet-general-use
ls -la /tmp/hh-warm-out.png
echo WARM_OK
"""


def main() -> int:
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
    stdin, stdout, stderr = client.exec_command(REMOTE_SCRIPT, timeout=900)
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line, end="", flush=True)
    err = stderr.read().decode("utf-8", "replace")
    if err.strip():
        print("STDERR", err[-6000:], flush=True)
    code = stdout.channel.recv_exit_status()
    client.close()
    print("EXIT", code, flush=True)
    return 0 if code == 0 else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print("FAIL", type(exc).__name__, exc, flush=True)
        raise SystemExit(1)
