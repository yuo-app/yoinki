<script setup lang="ts">
import { storage } from '~/logic/storage'
import SendButton from '~/components/SendButton.vue'

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
    </div>
    <Suspense>
      <SendButton />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </main>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
