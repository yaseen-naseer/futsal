# Futsal Scoreboard

This project provides a web-based scoreboard and control dashboard for futsal matches. It is built with React, Vite, and Tailwind CSS.

## Design Tokens

Custom design tokens are defined in `tailwind.config.js` and exposed through Tailwind utility classes.

### Colors

- `brand` (`brand-50` … `brand-900`): primary blue palette used throughout controls and backgrounds.
- `accent` (`accent-50` … `accent-900`): secondary red palette for emphasis and opponent styling.

### Fonts

- `font-sans`: Inter, used for general text.
- `font-display`: Orbitron, used for headings and scores.

### Spacing

- `18` (`p-18`, `gap-18`, etc.): 4.5rem spacing step for generous layout
- `128` (`w-128`, `h-128`, etc.): 32rem large dimension utility

Use these tokens with standard Tailwind class syntax, e.g. `bg-brand-500`, `font-display`, or `p-18`.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Lint the project:

```bash
npm run lint
```
