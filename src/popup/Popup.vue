<script lang="ts" setup>
import type { DefineComponent } from 'vue'
import Default from './components/Default.vue'
import Sentences from './components/Sentences.vue'
import type { Tab } from '~/logic/types'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const components: Record<Tab, DefineComponent<any, any, any>> = {
  Default,
  Sentences,
}

const selectedTab = ref<Tab>('Default')
</script>

<template>
  <main flex="~ col" justify-between items-center w-300px px-4 py-5 text-center text-sm gap-5>
    <component :is="components[selectedTab]" @change-tab="selectedTab = $event" />
    <button text-xs @click="openOptionsPage">
      Options
    </button>
  </main>
</template>
