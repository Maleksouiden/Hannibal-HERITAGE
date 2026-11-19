#!/usr/bin/env python3
"""Install modern Python + rembg on Hostinger (system python is 3.6)."""

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
cd "$HOME"
DOM="$HOME/domains/darkslategrey-turkey-880639.hostingersite.com"
mkdir -p "$DOM"
cd "$DOM"

# Install uv if missing
if [ ! -x "$HOME/.local/bin/uv" ]; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi
export PATH="$HOME/.local/bin:$PATH"
uv --version

# Managed CPython 3.12 + project venv
uv python install 3.12
rm -rf .venv-rembg
uv venv --python 3.12 .venv-rembg
uv pip install --python .venv-rembg/bin/python 'rembg[cpu]>=2.0.57' 'onnxruntime>=1.17.0' 'Pillow>=10.0.0'
.venv-rembg/bin/python -c 'import rembg; print("REMBG_OK")'
echo "VENV_PY=$DOM/.venv-rembg/bin/python"
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
    stdin, stdout, stderr = client.exec_command(REMOTE_SCRIPT, timeout=1200)
    # Stream output
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line, end="", flush=True)
    err = stderr.read().decode("utf-8", "replace")
    if err.strip():
        print("STDERR", err[-4000:], flush=True)
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
