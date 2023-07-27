<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import { storage } from '~/logic/storage'
import type { Tab } from '~/logic/types'

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
    value: storage.value.generateCount,
    id: 'generateCount',
    type: 'number',
    min: 1,
    max: 5,
  },
  {
    label: 'Model',
    value: storage.value.selectedModel,
    id: 'selectedModel',
    type: 'Multiselect',
  },
])

const languages = [
  'English',
  'French',
  'German',
  'Spanish',
  'Korean',
]

const models = [
  'gpt-3.5-turbo',
  'gpt-4',
]

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
</script>

<template>
  <div flex="~ row" w-full gap-2 items-center>
    <input v-model="storage.word" w-full bg-lightblue-2 p-1.5 rounded-lg>
    <button
      i-solar:round-alt-arrow-right-bold
      btn-lightblue w-7 h-7
      @click="emit('changeTab', 'Sentences')"
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
          :options="models"
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
          w-10
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
