import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ai-resume-formatter/',
  server: { port: 5173 },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  }
});
