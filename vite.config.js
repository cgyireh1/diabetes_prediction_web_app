import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload': {
        target: 'https://diabetes-prediction-web-app-l0ks.onrender.com/',
        changeOrigin: true,
        secure: false,
      },

      '/predict': {
        target: 'https://diabetes-prediction-web-app-l0ks.onrender.com/',
        changeOrigin: true,
        secure: false,
      },

      '/retrain-model': {
        target: 'https://diabetes-prediction-web-app-l0ks.onrender.com/',
        changeOrigin: true,
        secure: false,
      },

    },
  },
});
