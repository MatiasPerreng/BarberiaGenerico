import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Incluir IP pública/LAN para acceder desde otro dispositivo o por red
    allowedHosts: [
      "kingbarber.webhop.net",
      "167.62.232.17",
      "186.53.205.51",
      "179.27.203.212",
      "localhost",
      "127.0.0.1",
    ],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
