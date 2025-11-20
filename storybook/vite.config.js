import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Alias per importare i componenti EDS dalla cartella blocks del progetto padre
      '@blocks': path.resolve(__dirname, '../blocks'),
      '@scripts': path.resolve(__dirname, '../scripts'),
      '@styles': path.resolve(__dirname, '../styles'),
      
      // Intercetta le importazioni AEM e reindirizzale ai mock per Storybook
      '../../scripts/aem.js': path.resolve(__dirname, 'src/eds-components/aem-mock.js'),
      '../scripts/aem.js': path.resolve(__dirname, 'src/eds-components/aem-mock.js'),
      '../../scripts/scripts.js': path.resolve(__dirname, 'src/eds-components/scripts-mock.js'),
      '../scripts/scripts.js': path.resolve(__dirname, 'src/eds-components/scripts-mock.js'),
    }
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