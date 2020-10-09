<template>
  <div></div>
</template>

<script>
import { Color, Mesh, TorusBufferGeometry } from 'three'
import { O3DNode } from '../../Core/O3DNode'
import { ShaderCubeChromatics } from '../../Packages/Materials/ShaderCubeChromatics'

export default {
  mixins: [
    O3DNode
  ],
  mounted () {
    this.geo = new TorusBufferGeometry(20, 4.1, 15, 145)
    this.geo.scale(15, 15, 15)
    this.mat = new ShaderCubeChromatics({ renderer: this.ctx.renderer, onLoop: this.onLoop, res: 128, color: new Color('#ffffff') })
    this.halo = new Mesh(this.geo, this.mat.out.material)
    this.o3d.add(this.halo)
    this.onLoop(() => {
      this.halo.rotation.x += 0.01 * 0.5
      this.halo.rotation.y += 0.01 * 0.5
      // this.halo.rotation.z += 0.01 * 3.333
    })
  }
}
</script>

<style>

</style>