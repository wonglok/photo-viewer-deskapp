<template>
  <div class="full p-5">
    <MDArea class=" max-w-2xl" :md="require('raw-loader!./QuickStart.md').default"></MDArea>
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