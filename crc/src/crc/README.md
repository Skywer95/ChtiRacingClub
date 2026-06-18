# Ch'ti Racing Club

Site React + Vite. Admin sur `#admin` ou via le lien "Espace admin" en pied de page.

## Lancer en local
```bash
npm install
npm run dev
```

## Déployer sur Vercel
1. Pousse ce dossier sur un repo GitHub.
2. Sur vercel.com : New Project > importe le repo.
3. Framework détecté : Vite. Build `npm run build`, output `dist`. Deploy.

OU sans GitHub :
```bash
npm i -g vercel
vercel
```

## Modifier le contenu
- Contenu du site : objet `DEFAULT_DATA` (src/App.jsx).
- Thèmes / couleurs : objets `THEMES` et `MODES`.
- Persistance : objet `storageService` (actuellement localStorage du navigateur).

## Brancher Supabase plus tard
Remplace uniquement les 3 méthodes de `storageService` (load / save / clear)
par des appels Supabase. Aucun autre fichier à toucher.
