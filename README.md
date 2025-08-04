## Futsal

This project now includes basic Progressive Web App (PWA) support. The app can
be installed on supported browsers and works offline using a simple service
worker.

### Build for PWA

1. Install dependencies with `npm install`.
2. Build the project: `npm run build`.
3. Preview the production build locally (this serves the generated service
   worker): `npm run preview`.

The `dist/` folder will contain the production assets along with `manifest.json`
and `sw.js` that enable installation and offline caching.
