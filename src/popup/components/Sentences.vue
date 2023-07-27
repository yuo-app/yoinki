<script lang="ts" setup>
import type { Tab } from '~/logic/types'
import { storage } from '~/logic/storage'

const emit = defineEmits<{
  (event: 'changeTab', tab: Tab): void
}>()

const sentenceResults = ref([
  {
    text: 'He hurried to finish his homework lest he should miss his favorite show.',
    selected: false,
  },
  {
    text: 'She kept her distance from the edge of the cliff lest she fall into the abyss.',
    selected: false,
  },
  {
    text: 'She wore a hat and sunglasses, lest she should be recognized by the paparazzi.',
    selected: false,
  },
])

function styleResult(result: string) {
  return result.replace(storage.value.word.toString(), `<b>${storage.value.word}</b>`)
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
        {{ storage.word }}
      </p>
    </div>
    <div flex="~ col" w-full gap-3>
      <div
        v-for="(result, index) in sentenceResults" :key="index"
        flex="~ row" w-full gap-3 cursor-pointer
      >
        <p
          text-xl relative w-0 my-a font-bold left--1
          :text="result.selected ? 'lightblue-5' : 'lightblue-8'"
        >
          {{ index + 1 }}.
        </p>
        <span
          bg-lightblue-1 p-1.5 rounded-lg w-full
          :border="result.selected ? '2 dashed lightblue-5' : '2 solid transparent'"
          @click="result.selected = !result.selected"
          v-html="styleResult(result.text)"
        />
      </div>
    </div>
    <button
      btn-lightblue px-5
      :disabled="sentenceResults.every(result => result.selected === false)"
    >
      Add
    </button>
  </div>
</template>
