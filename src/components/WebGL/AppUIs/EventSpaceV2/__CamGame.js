
export class CamLock {
  constructor ({ target, camera, onLoop, element, onClean, onResize, base }) {
    this.isMobile = 'ontouchstart' in window
    this.element = element
    this.camera = camera
    this.onLoop = onLoop
    this.target = target
    this.onClean = onClean
    this.onResize = onResize
    this.base = base

    this.canRun = true
    this._mode = 'chase'

    this.camLockPosition = new Vector3(0, 13.5 / 2 - 6, -15)

    this.gyro = false

    this.onClean(() => {
      this.canRun = false
    })

    this.head = target
    target.traverse((item) => {
      // console.log(item.name)
      if (item.name === 'mixamorigHead') {
        this.head = item
      }
      if (item.name === 'mixamorigHips') {
        this.hips = item
      }
    })

    this.run()
  }
  setupGYRO () {
    if (this.gyro) {
      this.gyro.use = !this.gyro.use
      return
    }
    this.gyro = new GyroExpress({ ...this })
  }
  get mode  () {
    return this._mode
  }
  set mode  (v) {
    if (this._mode !== v) {
      this.needsReload = true
    }
    if (v === 'follow') {
      if (this.gyro) {
        this.gyro.use = false
      }
    }
    this._mode = v
    return v
  }
  run () {
    let lookTarget = new Object3D()
    this.target.add(lookTarget)
    this.needsReload = true

    this.camera.position.copy(this.camLockPosition)

    // this.target.add(this.camera)

    let charLookAtTargetV3Last = new Vector3()
    let charLookAtTargetV3Temp = new Vector3()
    let charLookAtTargetV3 = new Vector3()

    let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    this.controls = new OrbitControls(this.camera, this.element)
    this.controls.enableDamping = true
    this.onClean(() => {
      this.controls.dispose()
    })

    // look at position v3
    let lp3 = new Vector3()

    // world pos v3
    let wp3 = new Vector3()

    this.onLoop(() => {
      if (!this.canRun) {
        return
      }

      if (this.mode === 'follow') {
        // this.camera.position.x = 0
        // this.camera.position.y = 0
        // this.camera.position.z = 0
        if (this.camera.userData.oldPos && this.needsReload) {
          this.needsReload = false
          this.target.remove(this.camera)
          this.camera.position.copy(this.camera.userData.oldPos)
        }

        this.controls.update()
        lookTarget.updateMatrix()
        lookTarget.updateMatrixWorld()
        lookTarget.updateWorldMatrix()
        charLookAtTargetV3.setFromMatrixPosition(lookTarget.matrixWorld)

        let diff = charLookAtTargetV3Temp.copy(charLookAtTargetV3Last).sub(charLookAtTargetV3)
        this.camera.position.sub(diff)

        this.camera.getWorldPosition(wp3)
        this.camera.userData.oldPos = wp3

        charLookAtTargetV3Last.copy(charLookAtTargetV3)

        this.controls.target0.lerp(charLookAtTargetV3, 0.8)
        this.controls.target.lerp(charLookAtTargetV3, 0.8)
        this.controls.saveState()
      } else if (this.mode === 'chase') {
        this.controls.update()
        lookTarget.updateMatrix()
        lookTarget.updateMatrixWorld()
        lookTarget.updateWorldMatrix()
        charLookAtTargetV3.setFromMatrixPosition(lookTarget.matrixWorld)

        let diff = charLookAtTargetV3Temp.copy(charLookAtTargetV3Last).sub(charLookAtTargetV3)
        this.camera.position.sub(diff)
        charLookAtTargetV3Last.copy(charLookAtTargetV3)

        this.controls.target0.lerp(charLookAtTargetV3, 0.8)
        this.controls.target.lerp(charLookAtTargetV3, 0.8)
        this.controls.saveState()

        if (this.needsReload) {
          this.target.add(this.camera)
          if (this.gyro && this.gyro.use) {
            lp3.x = this.gyro.euler.y * -1 * 20
            lp3.y = (this.gyro.euler.x + Math.PI * 0.25) * (13) * -1
            lp3.z = 0
          } else {
            lp3.x = 0
            lp3.y = 0
            lp3.z = 0
          }

          this.camera.position.copy(this.camLockPosition).add(lp3)
          this.camera.lookAt(this.target.position)

          this.camera.getWorldPosition(wp3)
          this.camera.userData.oldPos = wp3
        }

        // if (this.gyro && this.gyro.use) {
        //   this.camera.position.y += this.gyro.diff.y
        //   this.camera.position.x += this.gyro.diff.x
        // }

        // this.camera.position.lerp(charLookAtTargetV3, 0.2)
        // this.camera.position.z -= 8
        // this.camera.lookAt(this.controls.target)

        // head.add(this.camera)''
      }
    })

    this.element.addEventListener('touchstart', () => {
      this.mode = 'follow'
    })
    this.element.addEventListener('mousedown', () => {
      this.mode = 'follow'
    })
    this.element.addEventListener('touchmove', () => {
      this.mode = 'follow'
    })
    this.element.addEventListener('wheel', () => {
      this.mode = 'follow'
    })
    window.addEventListener('keydown', () => {
      this.mode = 'chase'
      // this.mode = 'follow'
    })
  }
}