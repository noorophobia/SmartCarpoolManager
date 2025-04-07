// Import the 'defineConfig' helper from Vite.
 import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import istanbul from 'vite-plugin-istanbul';

 export default defineConfig({
   // Add the React plugin to handle React files and enable fast refresh.
   plugins: [
     react(),
     istanbul({
      include: 'src/**',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.jsx', '.ts', '.tsx']
    })
  ],
})
