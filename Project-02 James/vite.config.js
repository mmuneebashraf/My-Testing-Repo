import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Customize the output directory if needed
  },
  server: {
    open: true, // Open the browser automatically when the server starts
  },
});
