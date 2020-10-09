<template>
  <div @click="$emit('click')"><slot></slot></div>
</template>

<script>
import { O3DNode } from './O3DNode'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export default {
  mixins: [O3DNode],
  mounted () {
    this.htmlLabel = new CSS2DObject(this.$el)
    this.o3d.add(this.htmlLabel)
  },
  beforeDestroy () {
    this.o3d.remove(this.htmlLabel)
  }
}
</script>

<style>

</style>