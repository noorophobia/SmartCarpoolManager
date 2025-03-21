// Import the 'defineConfig' helper from Vite.
 import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

 export default defineConfig({
   // Add the React plugin to handle React files and enable fast refresh.
   plugins: [
     react()
  ],
})
