import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,jsx,tsx,js,ts}', 'index.html'],
    exclude: ['node_modules', '.git'],
  },
})