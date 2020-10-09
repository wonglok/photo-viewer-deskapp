<template>
  <div class="full relative">
    <!-- <GradientBG :pz="-20" v-if="camera"></GradientBG> -->
    <div class="absolute top-0 left-0 h-full w-full flex items-center justify-between">
      <div class="text-xl mx-4">
        <router-link to="/">Actions</router-link>
      </div>
      <div class="text-xl mx-4 flex">
        <img src="./img/db-reload.svg" class="mr-4 cursor-pointer" v-if="updateIsReady" @click="reload" alt="">
        <img src="./img/menu.svg" @click="$emit('menu-toggle');" class="cursor-pointer" alt="">
      </div>
    </div>
  </div>
</template>

<script>
// import { RenderRoot } from '../../Core/RenderRoot'
// import { PCamera } from '../../Core/PCamera'
// import { Scene, Color } from 'three'

export default {
  mixins: [
    // RenderRoot
  ],
  data () {
    return {
      updateIsReady: false,
      scene: false,
      camera: false
    }
  },
  methods: {
    async reload () {
      try {
        if ('serviceWorker' in navigator) {
          let registrations = await navigator.serviceWorker.getRegistrations()
          for (let registration of registrations) {
            // await registration.update()
            await registration.unregister()
          }
        }
      } catch (e) {
        console.error(e)
      }
      window.location.reload(true)
    }
  },
  mounted () {
    // this.scene = new Scene()
    // this.camera = new PCamera({ element: this.ctx.element, onResize: this.onResize })
    // this.camera.position.z = 100

    // this.scene.background = new Color('#ffffff')
    // this.scene.add(this.o3d)

    window.addEventListener('app-ready-for-update-please-refresh', () => {
      this.updateIsReady = true
    })
  }
}
</script>

<style>

</style>