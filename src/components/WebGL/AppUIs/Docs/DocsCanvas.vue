<template>
  <div>
    <slot v-if="camera"></slot>
    <!-- <FastFlame></FastFlame> -->
  </div>
</template>

<script>
import { RenderRoot } from '../../Core/RenderRoot'
import { Scene, Color } from 'three'
import { PCamera } from '../../Core/PCamera'
export default {
  mixins:[
    RenderRoot
  ],
  data () {
    return {
      scene: false,
      camera: false
    }
  },
  methods: {
    init () {
      this.scene = new Scene()
      this.camera = new PCamera({ element: this.element, onResize: this.onResize })
      this.camera.position.z = 100
      this.scene.add(this.o3d)
      this.scene.background = new Color('#ffffff')
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
</style>