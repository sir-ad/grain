import { defineConfig } from 'vite';

import { resolve } from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        components: resolve(__dirname, 'components.html'),
        demo: resolve(__dirname, 'demo.html'),
        about: resolve(__dirname, 'about.html'),
        kb: resolve(__dirname, 'kb/index.html'),
        stream: resolve(__dirname, 'kb/stream.html'),
        think: resolve(__dirname, 'kb/think.html'),
        tool: resolve(__dirname, 'kb/tool.html'),
        form: resolve(__dirname, 'kb/form.html')
      }
    }
  }
});
