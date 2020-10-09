<template>
  <div class="relative full" ref="frame">
    <img class="absolute  pointer-events-none select-none" ref="img" :src="bgImg" alt="Phone">
    <div class="absolute"  :style="{ backgroundImage: wallpaper ? `url(${wallpaper})` : '' }" ref="slotter"><slot v-if="ready"></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    maxWidth: {
      default: 414
    },
    wallpaper: {
      default: false,
    }
  },
  data () {
    return {
      ready: false,
      bgImg: require('html5-device-mockups/device-mockups/iPhone7/portrait_gold.png')
    }
  },
  mounted () {
    let area = () => {
      let height = 700
      let width = height * 0.4923599320882852
      return {
        width,
        height
      }
    }

    let render = ({ scale = 1.3 }) => {
      let { width, height } = area()
      if (!this.$refs.img || !this.$refs.slotter) {
        this.ready = false
        setTimeout(() => {
          sync()
        }, 100)
        return
      }
      this.$refs.img.style.width = (width * scale) + 'px'
      this.$refs.img.style.height = (height * scale) + 'px'

      this.$refs.frame.style.minHeight = (height * scale) + 'px'

      this.$refs.slotter.style.width = `${302 / width * scale * width}px`
      this.$refs.slotter.style.height = `${533 / height * scale * height}px`

      this.$refs.slotter.style.top = `${84 / width * scale * width}px`
      this.$refs.slotter.style.left = `${21 / height * scale * height}px`
      this.$refs.slotter.style.backgroundColor = `#CCCCCC`
      this.$refs.slotter.style.backgroundSize = `cover`
      this.$refs.slotter.style.backgroundPosition = `center center`

      this.$nextTick(() => {
        this.ready = true
      })
    }

    let sync = () => {
      let desierdWidth = this.$el.getBoundingClientRect().width

      if (desierdWidth <= 0) {
        setTimeout(sync, 100)
        return
      }

      if (desierdWidth > this.maxWidth) {
        desierdWidth = this.maxWidth
      }

      let scaler = desierdWidth / area().width
      render({ scale: scaler })
    }
    this.$nextTick(() => {
      sync()
    })
    this.$watch('maxWidth', () => {
      sync()
    })
    window.addEventListener('resize', () => {
      sync()
    })
    window.dispatchEvent(new Event('resize'))
  }
}
</script>

<style>
</style>