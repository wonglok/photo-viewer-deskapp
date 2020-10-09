<template>
  <div class="full relative"  style="background-color: rgba(255,255,255,0.90);">
    <!-- <GradientBG  v-if="camera"></GradientBG> -->
    <!-- <Halo v-if="camera"></Halo> -->

    <div class="absolute top-0 left-0 h-full w-full overflow-y-auto" style="background-color: rgba(255,255,255,0.35);">
      <div class="w-full flex items-center justify-between" style="height: 56px;">
        <div class="text-xl mx-4">
          Actions Finder ✞
        </div>
        <div class="text-xl mx-4">
          <img src="./img/close.svg" @click="$emit('menu-toggle')" alt="">
        </div>
      </div>
      <div class="w-full p-4">
        <router-link to="/find-actions">Find Actions</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import { RenderRoot } from '../../Core/RenderRoot'
// import { PCamera } from '../../Core/PCamera'
// import { Scene } from 'three'

export default {
  mixins: [
    // RenderRoot
  ],
  data () {
    return {
      scene: false,
      camera: false
    }
  },
  mounted () {
    // this.scene = new Scene()
    // this.camera = new PCamera({ element: this.ctx.element, onResize: this.onResize })
    // this.camera.position.z = 100

    // // this.scene.background = new Color('#ffffff')
    // this.scene.add(this.o3d)
  }
}
</script>

<style>

</style>