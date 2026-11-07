# Hannibal HERITAGE — Windows setup

## What it does

`setup.py` / `setup.exe`:

1. Checks for **Git** and **Node.js LTS** (installs via `winget` / `choco` when available)
2. Clones or updates `https://github.com/Maleksouiden/Hannibal-HERITAGE` into  
   `%USERPROFILE%\Documents\GitHub\Hannibal` (override with env `HANNIBAL_HOME`)
3. Runs `npm install` on first install (or if `.hannibal-setup-ok` / `node_modules` missing)
4. Creates `.env` from `.env.example` when missing
5. Starts `npm run dev` and opens http://localhost:3000

MySQL is optional at first launch (storefront has a static catalog fallback).

## Run without building

```powershell
cd C:\Users\CC\Documents\GitHub\Hannibal
py -3 setup\setup.py
```

## Rebuild `setup.exe` (PyInstaller)

```powershell
cd C:\Users\CC\Documents\GitHub\Hannibal
py -3 -m pip install pyinstaller
py -3 -m PyInstaller --noconfirm --clean --onefile --name setup --distpath setup\dist --workpath setup\build --specpath setup setup\setup.py
```

Output: `setup\dist\setup.exe`

Also copy to the repo root for discovery:

```powershell
Copy-Item -Force setup\dist\setup.exe .\setup.exe
```

Double-click **`setup.exe`** (root or `setup\dist\`). While the GitHub repo is **private**, Git must already be logged in (Git Credential Manager / `gh auth`). After the repo is public, clone works anonymously.

## Notes

- Marker file: `<install-dir>\.hannibal-setup-ok`
- Do not commit local `.env` or `setup\build\`
