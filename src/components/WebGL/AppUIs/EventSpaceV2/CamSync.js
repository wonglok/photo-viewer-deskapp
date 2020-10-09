import { PerspectiveCamera, Vector3 } from 'three'
/*
new CamSync({
  char,
  o3d: base.o3d,
  onLoop: this.onLoop,
  camera: this.ctx.camera,
  element: this.ctx.renderer.domElement,
  onClean: this.onClean
})
*/
class Looker {
  constructor ({ object, onLoop }) {
    this.onLoop = onLoop
    this.object = object

    this.current = new Vector3()
    this.diff = new Vector3()
    this.last = new Vector3()
    this.currentLerp = new Vector3()
    this.diffLerp = new Vector3()
    let runner = () => {
      if (this.last.length() === 0.0) {
        this.object.getWorldPosition(this.current)
        this.last.copy(this.current)
      }
      this.object.getWorldPosition(this.current)
      this.currentLerp.lerp(this.current, 0.2)
      this.diff.copy(this.current).sub(this.last)
      this.diffLerp.lerp(this.diff, 0.2)
      this.last.copy(this.current)
    }
    runner()
    this.onLoop(runner)
  }
}

export class CamSync {
  constructor ({ onLoop, onClean, camera, element, actor, o3d }) {
    this.onLoop = onLoop
    this.camera = camera
    this.element = element
    this.actor = actor
    this.o3d = o3d

    this.onClean = onClean
    this.canRun = true
    this.onClean(() => {
      this.canRun = false
    })
    this.campos = new Vector3(0, 4, 23)
    this.run({ actor, o3d })
  }
  async run ({ actor }) {
    let parts = {
      boneGroup: false,
      head: false,
      hips: false
    }

    actor.traverse((e) => {
      if (e.name === 'Armature') {
        parts.boneGroup = e
      }
      console.log(e.name, e.type)
      if (e.name === 'mixamorigHips') {
        parts.hips = e
      }
      if (e.name === 'mixamorigHead') {
        parts.head = e
      }
    })

    let targetHips = new Looker({ onLoop: this.onLoop, object: parts.hips })

    this.ppcam = new PerspectiveCamera(75, 1, 0.1, 10000)
    this.ppcam.position.copy(this.campos)
    parts.hips.add(this.ppcam)
    let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    let controls = new OrbitControls(this.ppcam, this.element)
    controls.enableDamping = true
    this.onLoop(() => {
      controls.update()
    })

    this.onLoop(() => {
      this.camera.position.copy(targetHips.current).add(this.ppcam.position)
      this.camera.lookAt(targetHips.currentLerp)
    })

    // let targetHead = new Looker({ onLoop: this.onLoop, object: parts.head })

    // let targetHead = new Looker({ onLoop: this.onLoop, object: parts.head })
    // let targetHips = new Looker({ onLoop: this.onLoop, object: parts.hips })
    // parts.hips.add(this.camera)

    // this.ppcamera = new PerspectiveCamera(75, 1, 0.000001, 1000000)
    // this.ppcamera.position.copy(this.campos)

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // let controls = new OrbitControls(this.ppcamera, this.element)
    // controls.enableDamping = true
    // this.onLoop(() => {
    //   controls.update()
    // })
    // let targetPPCam = new Looker({ onLoop: this.onLoop, object: this.ppcamera })

    // this.camera.position.copy(targetHips.current).add(this.campos)
    // this.onLoop(() => {
    //   this.camera.position.add(targetPPCam.diff)

    //   this.camera.position.add(targetHips.diffLerp)
    //   this.camera.lookAt(targetHips.currentLerp)
    // })
  }
}