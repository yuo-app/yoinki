<script setup lang="ts">
import { storageDemo } from '~/logic/storage'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main flex="~ col" justify-between items-center h-200px w-300px px-4 py-5 text-center>
    <div flex="~ row" w-full gap-2 items-center>
      <input v-model="storageDemo" text-sm w-full bg-lightblue-2 p-1.5 rounded-lg>
      <button
        i-solar:round-alt-arrow-right-bold
        btn-lightblue w-7 h-7
        @click="storageDemo = ''"
      />
    </div>
    <button @click="openOptionsPage">
      Options
    </button>
  </main>
</template>
