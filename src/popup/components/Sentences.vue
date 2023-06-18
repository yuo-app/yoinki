<script lang="ts" setup>
import type { Tab } from '~/logic/types'

const emit = defineEmits<{
  (event: 'changeTab', tab: Tab): void
}>()
</script>

<template>
  <div flex="~ row" w-full gap-2 items-center>
    <button
      i-solar:arrow-left-bold
      btn-lightblue w-7 h-7 absolute top-2 left-2
      @click="emit('changeTab', 'Default')"
    />
  </div>
</template>
