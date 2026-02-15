import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For GitHub Pages: if repo is not username.github.io, set base to repo name
    // Set VITE_BASE_PATH environment variable if deploying to a subdirectory
    // Example: VITE_BASE_PATH=/repo-name/
    const base = env.VITE_BASE_PATH || '/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL || 'http://django:8000',
            changeOrigin: true,
          },
          '/accounts': {
            target: env.VITE_API_BASE_URL || 'http://django:8000',
            changeOrigin: true,
          },
          '/admin': {
            target: env.VITE_API_BASE_URL || 'http://django:8000',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
