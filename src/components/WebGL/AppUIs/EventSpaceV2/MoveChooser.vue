<template>
  <div class="full flex flex-col lg:flex-row relative">
    <div class="order-2 lg:order-1 h-2/3 w-full lg:w-1/2 lg:h-full">
      <ActionPreview></ActionPreview>
    </div>
    <div class="order-1 lg:order-2 h-1/3 w-full lg:w-1/2 lg:h-full">
      <ActionsPanel @act="$emit('act', $event)"></ActionsPanel>
    </div>
  </div>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue'
export default {
  mixins: [
    O3DVue
  ]
}
</script>

<style>

</style>