<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import { sentencesStorage, storage } from '~/logic/storage'
import { agent } from '~/logic/agent'
import { type Tab, languages, levels, models } from '~/logic/types'

const emit = defineEmits<{
  (event: 'changeTab', tab: Tab): void
}>()

const settings = computed(() => [
  {
    label: 'Search',
    value: storage.value.searchEnabled,
    id: 'searchEnabled',
    type: 'checkbox',
  },
  {
    label: 'Generate',
    value: storage.value.sentenceCount,
    id: 'sentenceCount',
    type: 'number',
    min: 1,
    max: 5,
  },
  {
    label: 'Level',
    value: storage.value.level,
    id: 'level',
    type: 'Multiselect',
  },
  {
    label: 'Model',
    value: storage.value.selectedModel,
    id: 'selectedModel',
    type: 'Multiselect',
  },
  {
    label: 'Temperature',
    value: storage.value.temperature,
    id: 'temperature',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.1,
  },
])

const languageSelections = computed(() => [
  {
    label: 'Source',
    value: storage.value.sourceLanguage,
    id: 'sourceLanguage',
  },
  {
    label: 'Target',
    value: storage.value.targetLanguage,
    id: 'targetLanguage',
  },
])

async function send() {
  console.log('storage', storage.value)
  const result = await agent(
    storage.value,
  )({}, { render: true })

  console.log('sentence count', storage.value.sentenceCount)
  console.log('result', result)

  console.log('translation', result.translation)
  storage.value.translation = result.translation

  console.log('definition', `${result.definition}\n\n${result.definitionTranslated}`)
  storage.value.definition = result.definition
  storage.value.definitionTranslated = result.definitionTranslated

  console.log('result.sentences split', `[{"sentence": "${result.sentences}]`)
  const sentences = JSON.parse(`[{"sentence": "${result.sentences}]`)

  sentencesStorage.value = sentences.map((sentence: any) => ({
    sentence: sentence.sentence,
    sentenceTranslated: sentence.sentenceTranslated,
    selected: false,
    hovered: false,
  }))

  console.log(sentencesStorage.value)
}
</script>

<template>
  <div flex="~ row" w-full gap-2 items-center>
    <input v-model="storage.word" w-full bg-lightblue-2 p-1.5 rounded-lg>
    <button
      i-solar:round-alt-arrow-right-bold
      btn-lightblue w-7 h-7
      @click="emit('changeTab', 'Sentences'); send()"
    />
  </div>
  <p font-bold>
    Settings
  </p>
  <div flex="~ row wrap" w-full justify-around items-center gap-y-4>
    <div v-for="(setting, index) in settings" :key="index" flex="~ row" gap-2 items-center>
      <p>{{ setting.label }}:</p>
      <template v-if="setting.type === 'Multiselect'">
        <Multiselect
          v-model="setting.value"
          :options="setting.id === 'selectedModel' ? models : levels"
          :searchable="true"
          w-50
          @change="storage[setting.id] = $event"
        />
        <!-- @change="storage[setting.id] = isNaN($event) ? $event : Number($event)" -->
      </template>
      <template v-else>
        <input
          v-model="setting.value"
          :type="setting.type"
          :min="setting.min"
          :max="setting.max"
          :step="setting.step"
          w-12 bg-lightblue-1 px-1.5 py-1 rounded-lg text-center
          @input="storage[setting.id] = setting.type === 'number'
            ? ($event.target as HTMLInputElement).value
            : ($event.target as HTMLInputElement).checked"
        >
      </template>
    </div>
  </div>
  <p font-bold>
    Languages
  </p>
  <div flex="~ col" w-full justify-around items-center gap-y-4>
    <div v-for="(language, index) in languageSelections" :key="index" flex="~ row" w-full gap-2 items-center>
      <p w-16>
        {{ language.label }}:
      </p>
      <Multiselect
        v-model="language.value"
        :options="languages"
        :searchable="true"
        open-direction="top"
        @change="storage[language.id] = $event"
      />
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
