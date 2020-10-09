<template>
  <div class="full p-5 scrolling-touch overflow-y-scroll">
    <MDArea class=" max-w-2xl" :md="require('raw-loader!./CodeStructureTitle.md').default"></MDArea>
    <img src="./img/structure.svg" class=" max-w-full mb-6" alt="">
    <MDArea class=" max-w-2xl" :md="require('raw-loader!./CodeStructureMain.md').default"></MDArea>
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