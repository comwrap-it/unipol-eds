import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      // Alias per importare i componenti EDS dalla cartella blocks del progetto padre
      { find: '@blocks', replacement: path.resolve(__dirname, '../blocks') },
      { find: '@scripts', replacement: path.resolve(__dirname, '../scripts') },
      { find: '@styles', replacement: path.resolve(__dirname, '../styles') },

      // Intercetta le importazioni AEM e reindirizzale ai mock per Storybook (a qualsiasi profondità)
      { find: /^(\.\.\/)+scripts\/aem\.js$/, replacement: path.resolve(__dirname, 'src/eds-components/aem-mock.js') },
      { find: /^(\.\.\/)+scripts\/scripts\.js$/, replacement: path.resolve(__dirname, 'src/eds-components/scripts-mock.js') },
    ],
    dedupe: ['lit', 'lit-html', 'lit-element'],
  },
  build: {
    lib: {
      entry: 'src/main.js',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  server: {
    open: true
  },
  // Configurazione per gestire i file CSS dei componenti EDS
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  // Assicura che Vite processi correttamente i CSS
  assetsInclude: ['**/*.css'],
  optimizeDeps: {
    include: ['lit']
  }
});
