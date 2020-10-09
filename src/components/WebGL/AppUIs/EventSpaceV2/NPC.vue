<template>
  <div>

  </div>
</template>

<script>
import { Color, EventDispatcher } from 'three'
import O3DNode from '../../Core/O3DNode'
// import { sleep } from '../../Core/loadFBXCached'
import { ShaderCubeChromatics } from '../../Packages/Materials/ShaderCubeChromatics'
export default {
  mixins: [
    O3DNode
  ],
  props: {
    char: {
      default: 'suzie'
    },
    act: {
      default: 'Fist Pump'
    }
  },
  mounted () {
    let vm = this
    this.chroma = vm.ctx.chroma
    if (!this.chroma) {
      this.chroma = new ShaderCubeChromatics({
        renderer: this.ctx.renderer,
        onLoop: this.onLoop,
        res: 128,
        color: new Color('#ffffff')
      })
    }
    class GameNPC extends EventDispatcher {
      constructor ({ o3d, onLoop, chroma }) {
        super()
        this.onLoop = onLoop
        this.chroma = chroma
        this.o3d = o3d
        this.size = {
          x: 16 / 2,
          y: 20,
          z: 16 / 2,
        }
        this.moodType = 'fighting'
        // this.chars = ['swat', 'glassman', 'suzie']
        this.useCharacter = vm.char || 'swat'
        // this.useCharacter = vm.char
        // this.useCharacter = this.chars[Math.floor(Math.random() * this.chars.length)]

        this.done = this.setup()
      }

      async setup () {
        let Characeter = require('./EventChar').Character
        let char = new Characeter({ base: this, isNPC: true })
        this.character = char

        vm.$on('act', ({ name }) => {
          char.act({ name })
        })
        vm.o3d.visible = false
        await char.waitForSetup()
        .then(() => {
          char.actor.position.y += 18
          this.o3d.add(char.actor)
          vm.$emit('actor', { base: this, char })
          vm.o3d.visible = true

          char.act({ name: vm.act })
          vm.$watch('act', () => {
            char.act({ name: vm.act })
          })

          // return sleep(1000)
        }).then(() => {


        })
      }
    }
    new GameNPC({
      o3d: this.o3d,
      onLoop: this.onLoop,
      chroma: this.chroma || this.ctx.chroma,
    })
  }
}
</script>

<style>

</style>