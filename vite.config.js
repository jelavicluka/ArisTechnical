import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      '.ngrok-free.app',
      'f88a-2a05-4f44-1607-3700-20c1-de19-175d-7a7f.ngrok-free.app',
    ],
  },
})
