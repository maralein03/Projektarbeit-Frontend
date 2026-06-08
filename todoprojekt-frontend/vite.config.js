import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    port: 5176,
    strictPort: false, // Try next port if 5176 is in use
  },
})
