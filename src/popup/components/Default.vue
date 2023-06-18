<script setup lang="ts">
import { storageDemo } from '~/logic/storage'
import type { Tab } from '~/logic/types'

const emit = defineEmits<{
  (event: 'changeTab', tab: Tab): void
}>()

const searchEnabled = ref(false)
const generateCount = ref(1)
const selectedModel = ref('GPT-4')

const settings = [
  {
    label: 'Search',
    value: searchEnabled.value,
    type: 'checkbox',
  },
  {
    label: 'Generate',
    value: generateCount.value,
    type: 'number',
    min: 1,
    max: 5,
  },
  {
    label: 'Model',
    value: selectedModel.value,
    type: 'text',
  },
]
</script>

<template>
  <div flex="~ row" w-full gap-2 items-center>
    <input v-model="storageDemo" w-full bg-lightblue-2 p-1.5 rounded-lg>
    <button
      i-solar:round-alt-arrow-right-bold
      btn-lightblue w-7 h-7
      @click="emit('changeTab', 'Sentences')"
    />
  </div>
  <p font-bold>
    Settings
  </p>
  <div flex="~ row wrap" w-full justify-around space-x-2xl items-center gap-y-4>
    <div v-for="(setting, index) in settings" :key="index" flex="~ row" gap-2 items-center>
      <p>{{ setting.label }}:</p>
      <input
        v-model="setting.value"
        :type="setting.type"
        :min="setting.min"
        :max="setting.max"
        :w="setting.label === 'Model' ? '80px' : '40px'"
      >
    </div>
  </div>
  <p font-bold>
    Languages
  </p>
</template>
