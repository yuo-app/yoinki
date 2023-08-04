<script setup lang="ts">
import { storage } from '~/logic/storage'

const options = computed(() => [
  {
    label: 'OpenAI API key',
    value: storage.value.openaiApiKey,
    id: 'openaiApiKey',
    hide: ref(true),
  },
  {
    label: 'Bing API key',
    value: storage.value.bingApiKey,
    id: 'bingApiKey',
    hide: ref(true),
  },
])

const languageOptions = computed(() => [
  {
    label: 'Definition in Source Language',
    value: storage.value.sourceLanguageDefinition,
    id: 'sourceLanguageDefinition',
  },
  {
    label: 'Sentence translations in Source Language',
    value: storage.value.sourceLanguageSentence,
    id: 'sourceLanguageSentence',
  },
])
</script>

<template>
  <main px-4 py-10 text-center text-gray-700 dark:text-gray-200 flex="~ col" gap-5 w-full>
    <img src="/assets/icon.svg" icon-btn mx-2 text-2xl absolute alt="extension icon">

    <div text-2xl font-bold>
      Options
    </div>

    <div flex="~ col" justify-between items-center py-2 text-center text-sm gap-5 m-a w="3/4 md:2/3">
      <div v-for="(option, index) in options" :key="index" flex="~ col" items-center justify-center w-full>
        <div flex="~ row" w-full gap-2>
          <label text-sm font-bold w-20>{{ option.label }}:</label>
          <input
            v-model="option.value"
            :type="option.hide.value ? 'password' : 'text'"
            w-full bg-lightblue-2 p-1.5 rounded-lg
            @input="storage[option.id] = ($event.target as HTMLInputElement).value"
          >
          <button
            :class="option.hide.value ? 'i-solar:eye-closed-bold mt-1' : 'i-solar:eye-broken'"
            btn-lightblue w-7 h-7
            @click="option.hide.value = !option.hide.value;console.log(option.hide.value)"
          />
        </div>
      </div>
      <div v-for="(option, index) in languageOptions" :key="index" flex="~ row" items-center justify-start w-full gap-5>
        <label flex-1 text-right text-sm font-bold>{{ option.label }}:</label>
        <input
          v-model="option.value"
          type="checkbox"
          w-4 h-4 text-left mr="1/2"
          @change="storage[option.id] = ($event.target as HTMLInputElement).checked"
        >
      </div>
    </div>
  </main>
</template>
