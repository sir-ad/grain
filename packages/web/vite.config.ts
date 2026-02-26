import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AISemanticsWeb',
      formats: ['es', 'umd'],
      fileName: 'ai-semantics-web'
    },
    rollupOptions: {
      external: ['@ai-semantics/core'],
      output: {
        globals: {
          '@ai-semantics/core': 'AISemanticsCore'
        },
        assetFileNames: 'ai-semantics-web.[ext]'
      }
    },
    cssCodeSplit: false,
    cssInjectedByJs: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ai-semantics/core': resolve(__dirname, '../core/src')
    }
  }
});
