import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Vector3, TextureLoader, Color } from 'three'

export class HowToStart {
  constructor ({ o3d, onLoop, chroma, charContainer, rayplay, vm }) {
    this.onLoop = onLoop
    this.chroma = chroma
    this.o3d = o3d
    this.charContainer = charContainer

    this.vm = vm
    this.rayplay = rayplay

    this.done = this.setup()
  }
  setup () {
    this.geo = new BoxBufferGeometry(40, 25, 1, 2, 2, 2)
    this.map = new TextureLoader().load(require('./storyboard/lift-up.png'))
    this.mat = new MeshBasicMaterial({ wireframe: false, map: this.map, transparent: true, opacity: 1, color: 0xfffffff })
    this.mesh = new Mesh(this.geo, this.mat)
    let color = new Color('#343434')
    this.frame = new Mesh(this.geo, new MeshBasicMaterial({ color }))

    // if (this.chroma) {
    //   this.frame.material = this.chroma.out.material
    // }

    this.mesh.add(this.frame)
    this.frame.position.z -= 0.5
    this.frame.scale.x = 1.1
    this.frame.scale.y = 1.1
    this.frame.scale.z = 1

    this.worldPos = new Vector3().fromArray([126.0895767211914, 25, 364.65924072265625])
    // this.charContainer.getWorldPosition(this.worldPos)

    this.worldPos.x += 40
    this.worldPos.y += 3
    this.worldPos.z += 100

    this.onLoop(() => {
      let time = window.performance.now() * 0.01
      color.offsetHSL(0, 0, 0.025 * (Math.sin(time)))
      this.frame.material.color = color

      this.mesh.position.copy(this.worldPos)
      this.mesh.position.y += Math.sin(time * 0.1) * 1
    })

    // this.mesh.rotation.x += Math.PI * 0.5 * 0.3
    this.mesh.rotation.y += -Math.PI * 0.5 * 0.3

    // this.rayplay.add(this.mesh, () => {
    //   this.vm.$emit('showMenu', true)
    // })
    // this.rayplay.add(this.frame, () => {
    //   this.vm.$emit('showMenu', true)
    // })

    this.o3d.add(this.mesh)
  }
}