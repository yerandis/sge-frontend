// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     // Proxy: redirige las llamadas a /api al backend
//     // Así evitamos problemas de CORS durante desarrollo
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//       }
//     }
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite reemplaza literalmente 'global' por 'globalThis' en el bundle
    // globalThis es el equivalente estándar de 'global' en navegadores modernos
    global: 'globalThis',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // El WebSocket también necesita proxy si no usas la URL directa
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,  // ← habilita el proxy de WebSocket
      },
    },
  },
});