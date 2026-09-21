import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const buildTimestamp = new Date().toISOString();

// https://vite.dev/config/
export default defineConfig({
  base: './',
  define: {
    __BUILD_TIME__: JSON.stringify(buildTimestamp),
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-transform-build-time',
      transformIndexHtml(html) {
        return html.replace(/__BUILD_TIME__/g, JSON.stringify(buildTimestamp));
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
  },
});
