<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import OpenAI from 'openai'
import { agent, agentSentence } from '~/logic/agent'
import { sentencesStorage, storage } from '~/logic/storage'
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

const openai = new OpenAI({
  apiKey: storage.value.openaiApiKey,
  dangerouslyAllowBrowser: true,
})

async function send() {
  // const result = await agent(
  //   storage.value,
  // )({}, { render: true })

  // storage.value.translation = result.translation
  // storage.value.definition = result.definition
  // storage.value.definitionTranslated = result.definitionTranslated

  // let sentences = []

  // if (result.sentences.startsWith('['))
  //   sentences = JSON.parse(`${result.sentences}]`)
  // else
  //   sentences = JSON.parse(`[{"sentence": ${result.sentences}]`)

  // sentencesStorage.value = sentences.map((sentence: any) => ({
  //   sentence: sentence.sentence,
  //   sentenceTranslated: sentence.sentenceTranslated,
  //   selected: false,
  //   hovered: false,
  // }))

  const response = await agent(
    openai,
    storage.value,
  )

  storage.value = { ...storage.value, ...response }

  const sentences = await agentSentence(
    openai,
    storage.value,
  )

  sentencesStorage.value = sentences
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
      </template>
      <template v-else>
        <input
          v-model="setting.value"
          :type="setting.type"
          :min="setting.min"
          :max="setting.max"
          :step="setting.step"
          :w="setting.type === 'checkbox' ? '4' : '12'"
          :h="setting.type === 'checkbox' ? '4' : '8'"
          bg-lightblue-1 px-1.5 py-1 rounded-lg text-center
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
