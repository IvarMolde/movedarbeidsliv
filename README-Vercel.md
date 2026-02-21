# Deploy til Vercel

1) Push koden til et GitHub-repo (hvis ikke allerede):

```bash
# initialiser repo (hvis nødvendig)
git init
git add .
git commit -m "Initial commit"
# legg til origin, bytt URL til ditt repo
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

2) Importer i Vercel:

- Logg inn på https://vercel.com
- Click "New Project" → Import Git Repository → velg repo
- Defaults fungerer vanligvis. Build command: `npm run build`. Output directory: `dist`.

3) Lokalt testing før push:

```bash
npm ci
npm run build
npm run preview
```

4) Notes
- `vercel.json` er inkludert for å sikre riktig static-build config og SPA-ruting.
- Hvis du vil at jeg automatisk oppretter GitHub-repo eller konfigurerer Vercel for deg, gi tilgang (eller følg instruksene over).
