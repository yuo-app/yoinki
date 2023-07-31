<script lang="ts" setup>
import { storage } from '~/logic'
import { agent } from '~/logic/agent'

const result = ref<string | null>(null)

async function send() {
  result.value = null
  result.value = await agent(3, storage.value.openaiApiKey)({})
  console.log(result.value)
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
</template>
