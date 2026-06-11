import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development, any request to /api is forwarded to the Express
    // backend, so the browser talks to one origin and CORS stays simple.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
