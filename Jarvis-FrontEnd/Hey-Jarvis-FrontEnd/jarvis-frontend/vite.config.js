// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';
// import removeConsole from 'vite-plugin-remove-console';

// export default defineConfig({
//   base: './', 
//   plugins: [
//     react(),
//     tailwindcss(),
//     removeConsole({
//       // Optional: keep important logs if needed
//       // exclude: ['error', 'warn']
//     }),
//   ],
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    removeConsole({
      // Optional: keep important logs if needed
      // exclude: ['error', 'warn']
    }),
  ],
})
