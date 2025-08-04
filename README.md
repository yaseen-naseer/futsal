## Futsal

An overlay application for futsal matches built with Vite, React, TypeScript and Tailwind CSS.

### Development

1. Install dependencies with `npm install`.
2. Start the dev server: `npm run dev`.
3. Lint the code: `npm run lint`.
4. Build for production: `npm run build`.
5. Preview the production build: `npm run preview`.

### Progressive Web App

This project includes basic Progressive Web App (PWA) support. The app can be installed on supported browsers and works offline using a simple service worker.

To build with PWA features:

1. Install dependencies with `npm install`.
2. Build the project: `npm run build`.
3. Preview the production build locally (this serves the generated service worker): `npm run preview`.

The `dist/` folder will contain the production assets along with `manifest.json` and `sw.js` that enable installation and offline caching.
