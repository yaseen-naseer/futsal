import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure the app is treated as a single-page application so unknown
  // routes are served with index.html in both dev and preview builds.
  appType: 'spa',
});
