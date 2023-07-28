<script lang="ts" setup>
import { agent } from '~/logic/agent'

const result = ref<string | null>(null)

async function send() {
  result.value = null
  result.value = await agent({})
}
</script>

<template>
  <button
    btn-lightblue
    w="3/4 md:2/3"
    @click="send"
  >
    Send
  </button>
  <pre text-left>
    {{ result }}
  </pre>
</template>
