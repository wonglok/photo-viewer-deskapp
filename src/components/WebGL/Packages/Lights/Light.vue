<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DNode } from '../../Core/O3DNode'
import { Light } from 'three'

export default {
  name: 'Light',
  mixins: [O3DNode],
  props: {
    intensity: {
      defult: 3
    }
  },
  components: {
  },
  beforeDestroy () {
    this.o3d.children.forEach((item) => {
      this.o3d.remove(item)
    })
  },
  methods: {
    async loadStuff () {
      var light = new Light(0xffffff, this.intensity); // soft white light
      this.$watch('intensity', () => {
        light.intensity = this.intensity
      })
      this.o3d.add(light)
    }
  },
  async mounted () {
    await this.loadStuff()
  }
}
</script>

<style>

</style>
