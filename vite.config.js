import { defineConfig } from 'vite'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
    plugins: [
        WindiCSS(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                popup: resolve(__dirname, 'src/popup/popup.html'),
            },
        }
    },
})
