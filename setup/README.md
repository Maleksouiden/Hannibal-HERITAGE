# Hannibal HERITAGE — Windows setup

## Blank-PC one-click flow

1. Double-click **`setup.exe`** (repo root or `setup/dist/`).
2. Approve **UAC / Run as administrator** when prompted.
3. Setup detects and installs anything missing:
   - **Git**, **Node.js LTS**, **Docker Desktop**
   - Prefer **winget** (`--silent`), then **Chocolatey**, then official silent installers
   - Reloads Machine/User `PATH` into the process after each install
4. Clones or updates `https://github.com/Maleksouiden/Hannibal-HERITAGE` into  
   `%USERPROFILE%\Documents\GitHub\Hannibal` (override with env `HANNIBAL_HOME`; if the exe already sits inside a clone, that folder is used)
5. `npm install` (skipped when `.hannibal-setup-ok` + `node_modules` exist)
6. Creates `.env` from `.env.example` (random `AUTH_SECRET` when copying)
7. `docker compose up -d` → Prisma `generate` + `migrate deploy` + `seed`
8. Starts `npm run dev` (or leaves an existing http://localhost:3000 alone) and opens the browser

Python is **not** required on the target PC when using `setup.exe` (PyInstaller onefile). Python is only needed to rebuild the exe.

## Run without building

```powershell
# Still elevates via UAC when launched
cd C:\Users\CC\Documents\GitHub\Hannibal
py -3 setup\setup.py
```

## Rebuild `setup.exe` (PyInstaller)

```powershell
cd C:\Users\CC\Documents\GitHub\Hannibal
py -3 -m pip install pyinstaller
py -3 -m PyInstaller --noconfirm --clean --onefile --name setup --distpath setup\dist --workpath setup\build --specpath setup setup\setup.py
Copy-Item -Force setup\dist\setup.exe .\setup.exe
```

Output: `setup\dist\setup.exe` and repo-root `setup.exe`.

While the GitHub repo is **private**, Git must already be logged in (Git Credential Manager / `gh auth`). After the repo is public, clone works anonymously.

## Notes

- Marker file: `<install-dir>\.hannibal-setup-ok`
- Do not commit local `.env` or `setup\build\`
- First-time Docker Desktop may require reboot / WSL2; re-run setup after the engine is healthy
