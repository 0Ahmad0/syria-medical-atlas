import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{rollupOptions:{output:{manualChunks:{'map-engine':['maplibre-gl']}}}}});
