import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // GitHub Pages serves the site from /brewmap/
    base: process.env.GITHUB_ACTIONS ? '/brewmap/' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      // Browser-side Maps key: must be restricted by HTTP referrer in Google Cloud.
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || env.GOOGLE_MAPS_PLATFORM_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
