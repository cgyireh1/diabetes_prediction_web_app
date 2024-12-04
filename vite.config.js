import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },

      '/predict': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },

      '/retrain-model': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },

    },
  },
});
