import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetWebFonts({
      fonts: { sans: 'Inter' },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: [
    [/^btn-(.*)$/, ([, c]) => `px-4 py-2 rounded-full font-bold text-sm transition text-white bg-${c}-5 hover:bg-${c}-4 active:bg-${c}-6 disabled:bg-${c}-3 disabled:text-${c}-7`],
  ],
})
