import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// base : le site est servi par GitHub Pages sous /rock-paper-scissors/
export default defineConfig({ base: '/rock-paper-scissors/', plugins: [svelte(), tailwindcss()] })
