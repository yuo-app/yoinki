<script lang="ts" setup>
import type { SentencesStorage, Tab } from '~/logic/types'
import { sentencesStorage, storage } from '~/logic/storage'

const emit = defineEmits<{
  (event: 'changeTab', tab: Tab): void
}>()

// storage.value.translation = ''
// storage.value.definition = 'Just a moment... 👍'
// storage.value.definitionTranslated = ''
// sentencesStorage.value = []

const calcHeight = (result: SentencesStorage) => {
  if (!result.sentence || !result.sentenceTranslated)
    return 0

  const sentenceRows = Math.ceil(result.sentence.length / 35)
  const sentenceTranslatedRows = Math.ceil(result.sentenceTranslated.length / 35)

  return Math.max(sentenceRows, sentenceTranslatedRows) * 30
}
</script>

<template>
  <div flex="~ col" w-full gap-5 items-center>
    <div flex="~ col" w-full gap-2>
      <button
        i-solar:alt-arrow-left-bold
        btn-lightblue w-7 h-7 absolute top-4 left-1
        @click="emit('changeTab', 'Default')"
      />
      <p>
        <b>
          {{ storage.word }}
          <br>
          {{ storage.translation }}
        </b>
        <br><br>
        {{ storage.definition }}
        <br>
        {{ storage.definitionTranslated }}
      </p>
    </div>
    <div flex="~ col" w-full gap-3>
      <div
        v-for="(result, index) in sentencesStorage" :key="index"
        flex="~ row" w-full gap-3 cursor-pointer
      >
        <p
          text-xl relative w-0 my-a font-bold left--2
          :text="result.selected ? 'lightblue-5' : 'lightblue-8'"
        >
          {{ index + 1 }}.
        </p>
        <div
          flex w-full items-center bg-lightblue-1 p-1.5 rounded-lg
          :style="{ height: `${calcHeight(result)}px` }"
          :border="result.selected ? '2 dashed lightblue-5' : '2 solid transparent'"
          @click="result.selected = !result.selected"
          @mouseover="result.hovered = true"
          @mouseleave="result.hovered = false"
        >
          <span
            w-full
            v-html="result.hovered ? result.sentenceTranslated : result.sentence"
          />
        </div>
      </div>
    </div>
    <button
      btn-lightblue px-5
      :disabled="sentencesStorage.every(result => result.selected === false)"
    >
      Add
    </button>
  </div>
</template>
