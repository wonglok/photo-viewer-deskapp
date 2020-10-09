<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DNode, getScreen } from '../../Core/O3DNode'
import { PlaneBufferGeometry, Vector2, Mesh, RawShaderMaterial } from 'three'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'
export default {
  name: 'GradientBG',
  mixins: [O3DNode],
  props: {
  },
  data () {
    return {
    }
  },
  mounted () {
    // let RES_SIZE = 1024
    this.$on('init', async () => {
      let screen = getScreen({ camera: this.ctx.camera, depth: this.o3d.position.z })
      let geo = new PlaneBufferGeometry(screen.width || 1, screen.height || 1, 2, 2)
      let uniforms = {
        time: { value: 0 },
        sceneRect: { value: new Vector2() }
      }

      let mat = new RawShaderMaterial({
        // eslint-disable-next-line
        vertexShader: require('raw-loader!./glsl/fbm.vs.glsl').default,
        // eslint-disable-next-line
        fragmentShader: require('raw-loader!./glsl/fbm.fs.glsl').default,
        uniforms,
        transparent: true
      })

      let mesh = new Mesh(geo, mat)

      this.onResize(async () => {
        let element = this.ctx.element
        let elRect = element.getBoundingClientRect()
        uniforms.sceneRect.value = new Vector2(elRect.width, elRect.height)
        let screen = getScreen({ camera: this.ctx.camera, depth: this.o3d.position.z })
        let geo = new PlaneBufferGeometry(screen.width || 1, screen.height || 1, 2, 2)
        mesh.geometry = geo
      })

      this.o3d.children.forEach((v) => {
        this.o3d.remove(v)
      })
      this.o3d.add(mesh)

      this.onLoop(() => {
        mesh.material.uniforms['time'].value = window.performance.now() * 0.001
      })
    })
    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
