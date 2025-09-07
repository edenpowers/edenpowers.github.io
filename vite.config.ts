import { resolve } from 'path'
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: root,
  base : '/edenpowers.github.io/',
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        blog: resolve(root, 'blog', 'index.html'),
        rules_writeup: resolve(root, 'blog/rules-writeup', 'index.html')
      }
    }
  }
})
