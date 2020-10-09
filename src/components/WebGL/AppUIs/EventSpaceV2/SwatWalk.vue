<template>
  <O3D><slot></slot></O3D>
</template>

<script>
// import { WoozyMaterial } from '../../Core/WoozyMaterial'
import { O3DNode } from '../../Core/O3DNode'
import { ShaderCube } from '../../Packages/Materials/ShaderCube'
import { loadFBX } from '../../Core/loadFBX'
import { loadTexture } from '../../Core/loadTexture'
import { Color, MeshMatcapMaterial, DoubleSide } from 'three'

export default {
  mixins: [O3DNode],
  props: {
    envMap: {},
    opacity: {
      default: 1
    },
  },
  watch: {
    opacity (v) {
      this.setOpacity(v)
    }
  },
  methods: {
    setOpacity (v) {
      this.o3d.traverse(async (item) => {
        if (item.isMesh) {
          item.material.transparent = true
          item.material.opacity = v
        }
      })
    },
    async setup () {
      let url = require('file-loader!./room/space-walk.fbx')
      let silverTextureURL = require('./matcap/silver.png')
      // let textureLaoder = new TextureLoader()
      let silverTexture = loadTexture(silverTextureURL)

      let shaderCube = new ShaderCube({ renderer: this.ctx.renderer, loop: this.onLoop, res: 50, color: new Color('#ffffff') })
      // let woozy = new WoozyMaterial()
      // woozy.tCube = shaderCube.out.envMap

      loadFBX(url).then(async (fbx) => {
        let matcap = await silverTexture
        fbx.traverse((item) => {
          if (item.isMesh) {
            // console.log(item.name)
            item.material =  shaderCube.out.material
            if (item.name === 'Mesh018' || item.name === 'Mesh013' || item.name === 'Mesh017') {
              item.material = new MeshMatcapMaterial({ matcap, side: DoubleSide })
            }
            item.material.side = DoubleSide
            item.material.transparent = true
          }
        })

        let scale = 0.5
        this.o3d.position.y = 242.6 * scale
        fbx.scale.x = scale
        fbx.scale.y = scale
        fbx.scale.z = scale
        this.o3d.add(fbx)

        this.setOpacity(this.opacity)
      })
    }
  },
  mounted () {
    this.setup()
  }
}
</script>

<style>

</style>