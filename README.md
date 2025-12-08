# meta-cart-frontend

Vue 3 + Vite frontend managed with `pnpm`. The app lists carts, shows cart details, and adds items; merchants endpoints are wired for future use.

## Setup
```bash
cd meta-cart-frontend
pnpm install
pnpm dev   # http://localhost:5173, expects backend at http://localhost:8080 or VITE_API_BASE
pnpm build
pnpm preview
```

## Structure
- `src/App.vue` layout and theme toggle
- `src/components/*` presentational components
- `src/api.js` REST calls (uses `VITE_API_BASE`, defaults to `http://localhost:8080`)
- `src/style.css` shared styling
