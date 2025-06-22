// nuxt3-fleet-pub/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [ vue() ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Nuxt3FleetPub',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs';
        if (format === 'cjs') return 'index.cjs';
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@nuxt/content'], 
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@nuxt/content': 'NuxtContent', // Good practice for globals if needed
        },
      },
    },
  },
});
