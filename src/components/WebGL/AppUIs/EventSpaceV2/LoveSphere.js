import { SphereBufferGeometry, Mesh } from "three"

export class LoveSphere {
  constructor ({ onLoop, onClean, ctx, o3d }) {
    this.onLoop = onLoop
    this.onClean = onClean
    this.ctx = ctx
    this.o3d = o3d

    this.geo = new SphereBufferGeometry(100000, 64, 64)
    this.sphere = new Mesh(this.geo, this.ctx.chroma.out.material)
    this.o3d.add(this.sphere)
    this.sphere.rotateX(Math.PI * 0.5)
  }
}
