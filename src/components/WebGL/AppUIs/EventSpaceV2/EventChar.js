import { AnimationMixer, Clock, LinearEncoding, Object3D, EventDispatcher, Vector3, PerspectiveCamera, Euler, MeshBasicMaterial } from 'three'
import { loadGLTF } from "../../Core/loadGLTF"
import { getID } from '../../Core/O3DNode'
// import { loadFBX } from '../../Core/loadFBX.js'
import { loadFBXCached } from '../../Core/loadFBXCached.js'
import { KeyState } from './KeyState'
import { Promise } from 'core-js'

export class GyroExpress {
  constructor ({ target, camera, onLoop, element, onClean, onResize, base }) {
    this.element = element
    this.camera = camera
    this.onLoop = onLoop
    this.target = target
    this.onClean = onClean
    this.onResize = onResize
    this.base = base

    this.use = true

    this.euler = new Euler()
    this.diff = new Vector3()
    // this.lookTarget = new Object3D()

    this.setupGYRO()
  }
  setupGYRO () {
    let DeviceOrientationControls = require('three/examples/jsm/controls/DeviceOrientationControls').DeviceOrientationControls

    this.proxyCam = new PerspectiveCamera(75, 1, 0.01, 100000000000000)

    // this.lookTarget.position.y = 0
    // this.lookTarget.position.z = 10
    // this.proxyCam.add(this.lookTarget)
    this.gyro = new DeviceOrientationControls(this.proxyCam, this.element)
    this.gyro.dampping = true
    this.onClean(() => {
      this.gyro.dispose()
    })
    this.onLoop(() => {
      if (!this.use) {
        return
      }
      this.gyro.enabled = true
      this.gyro.update()

      if (this.euler.x === 0.0 && this.euler.y === 0.0 && this.euler.z === 0.0) {
        this.euler.copy(this.proxyCam.rotation)
      }
      this.diff.copy(this.euler).sub(this.proxyCam.rotation)
      this.euler.copy(this.proxyCam.rotation)
    })
  }
}

// export class Looker {
//   constructor ({ object, offset = new Vector3(), onLoop }) {
//     this.onLoop = onLoop
//     this.object = object

//     this.current = new Vector3()
//     this.diff = new Vector3()
//     this.last = new Vector3()
//     let runner = () => {
//       if (this.last.length() === 0.0) {
//         this.object.getWorldPosition(this.current)
//         this.current.add(offset)
//         this.last.copy(this.current)
//       }
//       this.object.getWorldPosition(this.current)
//       this.current.add(offset)
//       this.diff.copy(this.current).sub(this.last)
//       this.last.copy(this.current)
//     }
//     this.runner = runner
//     this.onLoop(runner)
//   }
// }

export class Looker {
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

    this.camLockPosition = new Vector3(0, 4, 23)

    this.gyro = false

    this.onClean(() => {
      this.canRun = false
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
    let parts = {
      head: false,
      hips: false
    }
    this.target.traverse((e) => {
      if (e.name === 'mixamorigHips') {
        parts.hips = e
      }
      if (e.name === 'mixamorigHead') {
        parts.head = e
      }
    })

    this.ppcamera = new PerspectiveCamera(75, 1, 0.0000001, 1000000)
    this.ppcamera.position.y = this.camLockPosition.y
    this.ppcamera.position.z = -this.camLockPosition.z
    this.target.add(this.ppcamera)

    let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    let controls = new OrbitControls(this.ppcamera, this.element)
    this.onLoop(() => {
      controls.update()
    })

    let targetMover = new Looker({ onLoop: this.onLoop, object: this.target })
    let targetPPCam = new Looker({ onLoop: this.onLoop, object: this.ppcamera })

    this.target.getWorldPosition(this.camera.position)
    this.camera.position.y += this.camLockPosition.y
    this.camera.position.z += this.camLockPosition.z

    // if (this.gyro && this.gyro.use) {
    //   lp3.x = this.gyro.euler.y * -1 * 20
    //   lp3.y = (this.gyro.euler.x + Math.PI * 0.25) * (13) * -1
    //   lp3.z = 0
    // } else {
    //   lp3.x = 0
    //   lp3.y = 0
    //   lp3.z = 0
    // }

    let lv = new Vector3()
    this.onLoop(() => {
      this.camera.position.add(targetPPCam.diff)
      if (this.gyro && this.gyro.use) {
        lv.x = this.gyro.diff.y * -10
        lv.y = (this.gyro.diff.x) * 10
        lv.z = 0
        this.camera.position.add(lv)
      }
      this.camera.lookAt(targetMover.current)
    })

    // let targetMover = new Looker({ onLoop: this.onLoop, object: this.target })
    // // let targetHips = new Looker({ onLoop: this.onLoop, object: parts.hips })
    // this.campos = new Vector3(0, 4, 23)
    // this.ppcam = new PerspectiveCamera(75, 1, 0.1, 10000)
    // this.ppcam.position.copy(this.campos)
    // this.target.add(this.ppcam)
    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // let controls = new OrbitControls(this.ppcam, this.element)
    // controls.enableDamping = true
    // this.onLoop(() => {
    //   controls.update()
    // })

    // this.onLoop(() => {
    //   this.camera.position.copy(targetMover.current).add(this.ppcam.position)
    //   this.camera.lookAt(targetMover.currentLerp)
    // })
  }
}


export class Moves {
  constructor () {
    let movesOrig = []
    let addToList = ({ mapper, type }) => {
      let arr = []
      for (let kn in mapper) {
        arr.push({
          type,
          _id: getID(),
          displayName: kn,
          actionFBX: false,
          fbx: false,
          url: mapper[kn]
        })
      }
      arr.sort((a, b) => {
        if (a.displayName > b.displayName) {
            return 1
        } else if (b.displayName > a.displayName) {
            return -1
        } else {
          return 0
        }
      })
      movesOrig = [
        ...movesOrig,
        ...arr
      ]

      return arr
    }

    addToList({ mapper: require('./moves/prayer/fbx').default, type: 'prayer' })
    addToList({ mapper: require('./moves/controls/fbx').default, type: 'control' })
    addToList({ mapper: require('./moves/cheer/fbx').default, type: 'cheer' })
    addToList({ mapper: require('./moves/gestures/fbx').default, type: 'gestures' })
    addToList({ mapper: require('./moves/sit/fbx').default, type: 'sit' })

    addToList({ mapper: require('./moves/posture-fixed/fbx').default, type: 'pose' })
    addToList({ mapper: require('./moves/posture/fbx').default, type: 'posture' })

    addToList({ mapper: require('./moves/superhero/fbx').default, type: 'superhero' })

    addToList({ mapper: require('./moves/breakdance/fbx').default, type: 'breakdance' })
    addToList({ mapper: require('./moves/dancing/fbx').default, type: 'dancing' })
    addToList({ mapper: require('./moves/thriller/fbx').default, type: 'thriller' })

    addToList({ mapper: require('./moves/football/fbx').default, type: 'football' })

    return movesOrig
  }
}

export class CharActions {
  static moves = new Moves()
  constructor ({ base, isNPC }) {
    this.cache = new Map()
    this.base = base
    this.isNPC = isNPC
    this.lastPlayingMove = false
  }

  static async preload () {
    let preloadList = [
      'Mma Idle',
      'control standing idle',

      // 'Praying Knee',
      'Ymca Dance',

      // 'Hook 1',
      'Side Kick (2)',

      'jump',
      'running',
      'control jog backwards',
      'left strafe',
      'right strafe',

      // 'football jog forward diagonal (2)',
      // 'football jog forward diagonal',
      // 'football jog backward diagonal (2)',
      // 'football jog backward diagonal',

      'control turn left a bit',
      'control turn right a bit'
    ]
    let waiters = []
    for (let name of preloadList) {
      waiters.push(CharActions.preloadByName({ name, cahce: this.cache }))
    }
    try {
      await Promise.all(waiters)
    } catch (e) {
      console.log(e)
    }
  }

  async act ({ name, mixer }) {
    let action = await this.getActionByDisplayName({ name, mixer })
    mixer.stopAllAction()
    if (this.lastPlayingMove) {
      this.lastPlayingMove.fadeOut(0.3)
    }
    action.repetitions = Infinity
    action.reset().fadeIn(0.3).play()
    this.lastPlayingMove = action
  }
  async setupWithMixerNPC ({ name = 'Fist Pump', mixer }) {
    return await this.getActionByDisplayName({ inPlace: true, name, mixer })
  }
  async setupWithMixer ({ mixer }) {
    let jumpOver = await this.getActionByDisplayName({ inPlace: true, name: 'jump over', mixer })
    let mmaIdle = await this.getActionByDisplayName({ name: 'Mma Idle', mixer })
    let standIdle = await this.getActionByDisplayName({ name: 'control standing idle', mixer })
    // let warmup = await this.getActionByDisplayName({ name: 'Warming Up', mixer })

    // let peaceSkill1Name = 'Praying Knee'
    let peaceSkill1Name = 'Ymca Dance'
    let peaceSkill2Name = 'Ymca Dance'

    let peaceSkillAction1 = await this.getActionByDisplayName({ name: peaceSkill1Name, mixer })
    let peaceSkillAction2 = await this.getActionByDisplayName({ name: peaceSkill2Name, mixer })

    let fightSkillAction1 = await this.getActionByDisplayName({ name: 'Side Kick (2)', mixer })
    // let fightSkillAction1 = await this.getActionByDisplayName({ name: 'Hook 1', mixer })
    let fightSkillAction2 = await this.getActionByDisplayName({ name: 'Side Kick (2)', mixer })

    let jump = await this.getActionByDisplayName({ inPlace: true, name: 'jump', mixer })

    // let goingBack = await this.getActionByDisplayName({ inPlace: true, name: 'control run backwards', mixer })
    // let steppingBackFight = await this.getActionByDisplayName({ inPlace: true, name: 'control step backward fight', mixer })

    let runForward = await this.getActionByDisplayName({ inPlace: true, name: 'running', mixer })
    let runBack = await this.getActionByDisplayName({ inPlace: true, name: 'control jog backwards', mixer })
    let runLeft = await this.getActionByDisplayName({ inPlace: true, name: 'left strafe', mixer })
    let runRight = await this.getActionByDisplayName({ inPlace: true, name: 'right strafe', mixer })

    let goForwardLeft = await this.getActionByDisplayName({ inPlace: true, name: 'football jog forward diagonal (2)', mixer })
    let goForwardRight = await this.getActionByDisplayName({ inPlace: true, name: 'football jog forward diagonal', mixer })
    let goBackLeft = await this.getActionByDisplayName({ inPlace: true, name: 'football jog backward diagonal (2)', mixer })
    let goBackRight = await this.getActionByDisplayName({ inPlace: true, name: 'football jog backward diagonal', mixer })

    // let stepForward = await this.getActionByDisplayName({ inPlace: true, name: 'control go forward', mixer })
    // let stepBackward = await this.getActionByDisplayName({ inPlace: true, name: 'control go backward', mixer })
    // let stepLeft = await this.getActionByDisplayName({ inPlace: true, name: 'control go left', mixer })
    // let stepRight = await this.getActionByDisplayName({ inPlace: true, name: 'control go right', mixer })

    let turnLeft = await this.getActionByDisplayName({ inPlace: true, name: 'control turn left a bit', mixer })
    let turnRight = await this.getActionByDisplayName({ inPlace: true, name: 'control turn right a bit', mixer })

    let goingForward = runForward
    let goingBack = runBack
    let goingLeft = runLeft
    let goingRight = runRight

    let skillAction1 = peaceSkillAction1
    let skillAction2 = peaceSkillAction2
    // let vm = this
    let actionKeyMap = [
      {
        cmd: 'w',
        action: goingForward
      },
      {
        cmd: 'a',
        action: goingLeft
      },
      {
        cmd: 's',
        action: goingBack
      },
      {
        cmd: 'd',
        action: goingRight
      },
      {
        cmd: 'wa',
        action: goForwardLeft
      },
      {
        cmd: 'wd',
        action: goForwardRight
      },
      {
        cmd: 'sa',
        action: goBackLeft
      },
      {
        cmd: 'sd',
        action: goBackRight
      },
      {
        cmd: 'q',
        action: turnLeft
      },
      {
        cmd: 'e',
        action: turnRight
      },
      {
        cmd: 'r',
        type: 'doOnce',
        get action () {
          return skillAction1
        }
      },
      {
        cmd: 't',
        type: 'doOnce',
        get action () {
          return skillAction2
        }
      },
      {
        cmd: 'space',
        // type: 'doOnce',
        get action () {
          return jump
        }
      },
      {
        cmd: 'wsapce',
        type: 'runJumpOnce',
        get action () {
          return jumpOver
        }
      },
      {
        cmd: 'rest',
        get action () {
          return idle
        }
      }
    ]

    let syncCmd = () => {
      if (isDown.forward && isDown.left) {
        btn.cmd = 'wa'
      } else if (isDown.forward && isDown.space) {
        btn.cmd = 'wsapce'
      } else if (isDown.forward && isDown.right) {
        btn.cmd = 'wd'
      } else if (isDown.backward && isDown.left) {
        btn.cmd = 'sa'
      } else if (isDown.backward && isDown.right) {
        btn.cmd = 'sd'
      } else if (isDown.forward) {
        btn.cmd = 'w'
      } else if (isDown.backward) {
        btn.cmd = 's'
      } else if (isDown.left) {
        btn.cmd = 'a'
      } else if (isDown.right) {
        btn.cmd = 'd'
      } else if (isDown.turnLeft) {
        btn.cmd = 'q'
      } else if (isDown.turnRight) {
        btn.cmd = 'e'
      } else if (isDown.action1) {
        btn.cmd = 'r'
      } else if (isDown.action2) {
        btn.cmd = 't'
      } else if (isDown.space) {
        btn.cmd = 'space'
      } else {
        btn.cmd = 'rest'
      }
    }

    let idle = this.base.moodType === 'peaceful' ? standIdle : mmaIdle
    // mixer.stopAllAction()
    // idle.repetitions = Infinity
    // idle.play()

    // this.base.moodType = 'fighting'

    let toggleFightMode = () => {
      let last = idle
      if (this.base.moodType === 'fighting') {
        this.base.moodType = 'peaceful'
        idle = standIdle

        // goingLeft = runLeft
        // goingRight = runRight
        // goingBack = runBack
        // goingForward = runForward

        skillAction1 = peaceSkillAction1
        skillAction2 = peaceSkillAction2
      } else if (this.base.moodType === 'peaceful') {
        this.base.moodType = 'fighting'
        idle = mmaIdle

        // goingLeft = stepLeft
        // goingRight = stepRight
        // goingForward = stepForward
        // goingBack = stepBackward

        skillAction1 = fightSkillAction1
        skillAction2 = fightSkillAction2
      }
      mixer.stopAllAction()
      idle.crossFadeFrom(last, 0.3, true)
      idle.play()
    }
    this.base.moodType = 'fighting'
    toggleFightMode()

    this.base.addEventListener('toggle-fight', () => {
      toggleFightMode()
    })

    this.base.addEventListener('play-move', async (event) => {
      try {
        let { move } = event.data
        let action = await this.getActionByDisplayName({ name: move.displayName, mixer })
        mixer.stopAllAction()
        if (this.lastPlayingMove) {
          this.lastPlayingMove.fadeOut(0.3)
        }
        action.repetitions = Infinity
        action.reset().fadeIn(0.3).play()
        this.lastPlayingMove = action
      } catch (e) {
        console.log(e)
      }
    })

    // this.viewCameraMode = 'face'
    // this.dispatchEvent('play-move', { move: { displayName: 'Warming Up' }, cb: () => {} })

    let isDown = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      turnLeft: false,
      turnRight: false,
      action1: false,
      action2: false,
      space: false,
      modd: false
    }

    let btn = {
      isDownAny: false,
      lastCmd: '',
      _cmd: '',
      get cmd () {
        return btn._cmd
      },
      set cmd (v) {
        btn.lastCmd = btn._cmd
        btn._cmd = v
      },
      skip: false
    }


    let actionTimeoutID = 0
    let runCmd = () => {
      actionKeyMap.forEach((e) => {
        if (e.cmd !== btn.cmd) {
          e.action.fadeOut(0.5)
        }
      })
      let active = actionKeyMap.find(e => e.cmd === btn.cmd)
      if (active) {
        if (active.type === 'runJumpOnce') {
          if (!active.action.isRunning()) {
            this.base.canJump = true
            active.action.repetitions = 1
            mixer.stopAllAction()
            active.action.fadeIn(0.15).play()
            clearTimeout(actionTimeoutID)
            actionTimeoutID = setTimeout(() => {
              goingForward.crossFadeFrom(active.action, 0.23).play()
              this.base.canJump = true
            }, active.action.duration * 1000 - 0.23 * 1000)
          } else {
            this.base.canJump = false
          }
        } else if (active.type === 'doOnce') {
          if (!active.action.isRunning()) {
            this.base.canJump = true
            active.action.repetitions = 1
            mixer.stopAllAction()
            active.action.fadeIn(0.15).play()
            clearTimeout(actionTimeoutID)
            actionTimeoutID = setTimeout(() => {
              idle.crossFadeFrom(active.action, 0.23).play()
              this.base.canJump = true
            }, active.action.duration * 1000 - 0.23 * 1000)
          } else {
            this.base.canJump = false
          }
        } else {
          if (!active.action.isRunning()) {
            clearTimeout(actionTimeoutID)
            mixer.stopAllAction()
            active.action.fadeIn(0.2).play()
          }
        }
      }
    }

    // let moveForward, moveLeft, moveRight, moveBackward = false
    var onKeyDown = async (event) => {
      btn.isDownAny = true
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          isDown.forward = true
          break;

        case 37: // left
        case 65: // a
          isDown.left = true
          break;

        case 40: // down
        case 83: // s
          isDown.backward = true
          break;

        case 39: // right
        case 68: // d
          isDown.right = true
          break;

        case 32: // space
          isDown.space = true
          break;

        case 82: // r
          isDown.action1 = true
          break;

        case 84: // t
          isDown.action2 = true
          break;

        case 81: // q
          isDown.turnLeft = true
          break;

        case 69: // e
          isDown.turnRight = true
          break;

        case 88: // x
          toggleFightMode()
          isDown.mood = true
          break;

        default:
          break
      }

      syncCmd()

      if (actionKeyMap.find(e => {
        return e.type === 'doOnce' && e.cmd === btn.cmd
      })) {
        btn.skip = true
      } else {
        btn.skip = false
      }

      runCmd()

      if (this.lastPlayingMove) {
        this.lastPlayingMove.fadeOut(0.15)
      }
    }

    var onKeyUp = async (event) => {
      btn.isDownAny = false
      // let skipFadeOut = false
      // let isDownCopy = JSON.parse(JSON.stringify(isDown))

      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          isDown.forward = false
          break;

        case 37: // left
        case 65: // a
          isDown.left = false
          break;

        case 40: // down
        case 83: // s
          isDown.backward = false
          break;

        case 39: // right
        case 68: // d
          isDown.right = false
          break;

        case 81: // q
          isDown.turnLeft = false
          break;

        case 69: // e
          isDown.turnRight = false
          break;

        case 82: // r
          isDown.action1 = false
          break;

        case 84: // t
          isDown.action2 = false
          break;

        case 32:
          isDown.space = false
          break;

        case 88: // x
          isDown.mood = false
          break;

          default:
            break
      }

      syncCmd()

      if (btn.skip) {
        return
      }
      runCmd()
    }

    this.base.addEventListener('go-forward', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 87 })
      } else {
        onKeyUp({ keyCode: 87 })
      }
    })

    this.base.addEventListener('go-backward', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 83 })
      } else {
        onKeyUp({ keyCode: 83 })
      }
    })

    this.base.addEventListener('go-left', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 65 })
      } else {
        onKeyUp({ keyCode: 65 })
      }
    })

    this.base.addEventListener('go-right', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 68 })
      } else {
        onKeyUp({ keyCode: 68 })
      }
    })

    this.base.addEventListener('turn-left', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 81 })
      } else {
        onKeyUp({ keyCode: 81 })
      }
    })

    this.base.addEventListener('turn-right', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 69 })
      } else {
        onKeyUp({ keyCode: 69 })
      }
    })

    this.base.addEventListener('key-r', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 82 })
      } else {
        onKeyUp({ keyCode: 82 })
      }
    })
    this.base.addEventListener('key-t', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 84 })
      } else {
        onKeyUp({ keyCode: 84 })
      }
    })

    this.base.addEventListener('key-x', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 88 })
      } else {
        onKeyUp({ keyCode: 88 })
      }
    })

    this.base.addEventListener('key-space', (v) => {
      if (v.data) {
        onKeyDown({ keyCode: 32 })
      } else {
        onKeyUp({ keyCode: 32 })
      }
    })

    if (this.base.keys) {
      this.base.keys.joystick = false
      this.base.addEventListener('joystick', (ev) => {
        this.base.keys.joystick = ev.data
      })
    }

    if (!this.isNPC) {
      document.addEventListener( 'keydown', onKeyDown, false );
      document.addEventListener( 'keyup', onKeyUp, false );
    }
  }
  prepAnimation ({ pose, mixer, inPlace }) {
    if ((pose && !pose.animations) || (!pose)) {
      return Promise.reject(new Error('no pose'))
    }
    return new Promise((resolve) => {
      let action = false
      pose.animations.forEach((clip) => {
        if (inPlace) {
          if (clip.tracks[0] && clip.tracks[0].name === 'mixamorigHips.position') {
            let values = clip.tracks[0].values
            for (var i = 0; i < values.length; i += 3) {
              values[i + 0] = 0
              // values[i + 1] = 0
              values[i + 2] = 0
            }
          }
        }

        action = mixer.clipAction(clip)
        action.duration = clip.duration
        action.mixer = mixer
        resolve(action)
      });
    })
  }

  async loadMoveByName ({ name }) {
    let move = CharActions.moves.find(e => e.displayName === name)
    if (!move) {
      console.log('cannot find ... ' + name)
    }
    // let moveObj = await this.loadMove(move)
    return move
  }

  async getActionByDisplayName ({ inPlace, name, mixer }) {
    let moveObj = await this.loadMoveByName({ name })
    let url = moveObj.url
    let actionFBX = await CharActions.loadFBX({ url, cache: this.cache })
    let actionObj = await this.prepAnimation({ inPlace, pose: actionFBX, mixer })
    return actionObj
  }

  static async preloadByName ({ name }) {
    let move = CharActions.moves.find(e => e.displayName === name)
    if (move) {
      return CharActions.loadFBX({ url: move.url, cahce: this.cache })
    }
  }

  static async loadFBX ({ url, cache = false }) {
    if (cache) {
      if (cache.has(url)) {
        return cache.get(url)
      }
    }

    let actionFBX = await loadFBXCached(url)
    if (cache) {
      cache.set(url, actionFBX)
    }
    return actionFBX
  }
}

const TWEEN = require('@tweenjs/tween.js').default

export class Mixer {
  constructor ({ base, actor }) {
    var mixer = new AnimationMixer(actor)
    let clock = new Clock()
    base.onLoop(() => {
      let dt = clock.getDelta()
      TWEEN.update()
      mixer.update(dt)
    })
    return mixer
  }
}

export class Character {
  constructor ({ base, isNPC, initAct = 'Fist Pump' }) {
    this.base = base
    this.isNPC = isNPC
    this.initAct = initAct
    this.name = base.useCharacter

    // CharActions.preload()

    this.done = this.setup()
  }
  act ({ name }) {
    this.actions.act({ name, mixer: this.mixer })
  }
  async waitForSetup () {
    return this.done.then(() => {
      return this.base.doneCharMixer
    })
  }

  setupChroma ({ actor, chroma }) {
    actor.traverse(item => {
      if (item.isMesh) {
        item.material.envMap = chroma.out.envMap
      }
    })
  }

  mapCharBones ({ actor }) {
    let getEnd = (name) => {
      name = name.replace('mixamorig1', 'mixamorig')
      name = name.replace('mixamorig2', 'mixamorig')
      name = name.replace('mixamorig3', 'mixamorig')
      name = name.replace('mixamorig4', 'mixamorig')
      name = name.replace('mixamorig5', 'mixamorig')
      name = name.replace('mixamorig6', 'mixamorig')
      name = name.replace('mixamorig7', 'mixamorig')
      name = name.replace('mixamorig8', 'mixamorig')
      name = name.replace('mixamorig', 'mixamorig')
      return name
    }

    let fixName = (item) => {
      item.name = getEnd(item.name)
      // console.log(item.name)
    }

    actor.traverse((item) => {
      fixName(item)
      // console.log(item.name, item.type, item.isBone)

      if (item.isMesh) {
        item.frustumCulled = false
      }

      if (item.type === 'Bone') {
        this.bones[item.name] = item
      }
    })

    // console.log(this.bones)
  }

  setupProperTextureEncoding ({ actor }) {
    actor.traverse((item) => {
      if (item.isMesh) {
        if (item.material.map) {
          item.material.map.encoding = LinearEncoding
        }
        if (item.material.alphaMap) {
          item.material.alphaMap.encoding = LinearEncoding
        }
        if (item.material.metalnessMap) {
          item.material.metalnessMap.encoding = LinearEncoding
        }
        if (item.material.normalMap) {
          item.material.normalMap.encoding = LinearEncoding
        }
        if (item.material.roughnessMap) {
          item.material.roughnessMap.encoding = LinearEncoding
        }
        // item.material.toneMapped = true
        item.material.transparent = true
        item.frustumCulled = false
      }
    })
  }

  async setup () {
    if (this.name === 'glassman') {
      this.glb = await loadGLTF(require('file-loader!./char/glassman.glb'))
      this.glb.scene.rotation.x += Math.PI * 0.05
      this.glb.scene.rotation.y += Math.PI * 0.03
      this.glb.scene.traverse(item => {
        if (item.isMesh) {
          let envMap = undefined
          if (this.chroma) {
            envMap = this.chroma.out.envMap
          }
          item.material = new MeshBasicMaterial({ skinning: true, flatShading: true, envMap })
        }
      })
    } else if (this.name === 'swat') {
      this.glb = await loadGLTF(require('file-loader!./char/swat.glb'))
    } else if (this.name === 'suzie') {
      this.glb = await loadGLTF(require('file-loader!./char/suzie.glb'))
    } else if (this.name === 'alex') {
      this.glb = await loadGLTF(require('file-loader!./char/alex.glb'))
    } else if (this.name === 'peter') {
      this.glb = await loadGLTF(require('file-loader!./char/peter.glb'))
    } else if (this.name === 'david') {
      this.glb = await loadGLTF(require('file-loader!./char/david.glb'))
    } else if (this.name === 'frank') {
      this.glb = await loadGLTF(require('file-loader!./char/frank.glb'))
    } else if (this.name === 'girl') {
      this.glb = await loadGLTF(require('file-loader!./char/girl.glb'))
    } else if (this.name === 'janice') {
      this.glb = await loadGLTF(require('file-loader!./char/janice.glb'))
    } else if (this.name === 'joe') {
      this.glb = await loadGLTF(require('file-loader!./char/joe.glb'))
    } else if (this.name === 'ricky') {
      this.glb = await loadGLTF(require('file-loader!./char/ricky.glb'))
    } else if (this.name === 'steve') {
      this.glb = await loadGLTF(require('file-loader!./char/steve.glb'))
    }

    // this.glb = await loadGLTF(require('file-loader!./char/swat.glb'))

    // this.glb = await loadGLTF(require('file-loader!./char/suzie.glb'))

    this.scene = new Object3D()
    this.scene.add(this.glb.scene)
    this.scene.position.y = (this.base.size.y * -1) + (this.base.size.x * -0.5) + this.base.size.y * 0.3
    this.base.o3d.add(this.scene)
    // this.characterMixer = new CharacterMixer({ actor: this.scene, base: this.base, isNPC: this.isNPC })

    this.actor = this.scene
    this.scale = 10
    this.chroma = this.base.chroma

    this.mixer = new Mixer({ base: this.base, actor: this.actor })
    this.bones = {}
    this.mapCharBones({ actor: this.actor })
    this.setupProperTextureEncoding({ actor: this.actor })

    if (this.chroma && this.base.useCharacter === 'swat') {
      this.setupChroma({ actor: this.actor, chroma: this.chroma })
    }
    if (this.chroma && this.base.useCharacter === 'glassman') {
      this.setupChroma({ actor: this.actor, chroma: this.chroma })
    }

    this.actions = new CharActions({ base: this.base, isNPC: this.isNPC })

    if (this.isNPC) {
      this.base.doneCharMixer = Promise.resolve()
        .then(() => {
          this.actor.rotation.x = Math.PI * -0.5
          this.actor.scale.x = this.scale
          this.actor.scale.y = this.scale
          this.actor.scale.z = this.scale
        })

      let action = await this.actions.setupWithMixerNPC({ name: this.initAct, mixer: this.mixer })
      this.mixer.stopAllAction()
      action.repetitions = Infinity
      action.reset().play()
      // await sleep(500)
      return
    }

    this.actor.visible = false

    this.base.doneCharMixer = this.actions.setupWithMixer({ mixer: this.mixer })
      .then(() => {
        this.actor.rotation.x = Math.PI * -0.5
        this.actor.scale.x = this.scale
        this.actor.scale.y = this.scale
        this.actor.scale.z = this.scale
        this.actor.visible = true
      })
    await this.base.doneCharMixer
  }
}

export class EventChar extends EventDispatcher {
  constructor ({ onLoop, onResize, birthPlace = [0, 250, 0], chroma, ammo, useCharacter = 'glassman' }) {
    super({})
    this.ammo = ammo

    this.useCharacter = useCharacter
    this.isNPC = false

    this.chroma = chroma
    this.size = {
      x: 16 / 2,
      y: 20,
      z: 16 / 2,
    }
    this.moodType = 'fighting'
    this.birthPlace = birthPlace
    // this.birthPlace = [126.0895767211914, 150, 364.65924072265625]
    // this.birthPlace = [0.0, 50, 0.0]
    this.onLoop = onLoop
    this.onResize = onResize
    this.body = false
    this.o3d = new Object3D()
    this.keys = new KeyState({ base: this })

    this.doneCharGLB = this.setup()
  }
  async loadChar () {
    let char = new Character({ base: this })
    this.charVisual = char
    await char.waitForSetup()
  }
  act ({ name }) {
    if (this.charVisual) {
      this.charVisual.act({ name })
    }
  }
  async setup () {
    this.o3d.position.fromArray(this.birthPlace)
    this.o3d.rotation.y = Math.PI
    this.o3d.name = 'character'

    if (this.useCharacter) {
      await this.loadChar()
    }

    let uuid = this.o3d.uuid
    let position = this.o3d.position.toArray()
    let quaternion = this.o3d.quaternion.toArray()
    let directAmmoWorld = this.ammo.getDirect()
    await directAmmoWorld.createYou({ size: this.size, uuid, position, quaternion })

    this.ammo.addUpdateItem(this.o3d)
    this.onLoop(() => {
      let newStr = JSON.stringify(this.keys)
      if (newStr !== this.lastStr) {
        this.lastStr = newStr
        directAmmoWorld.syncKeys({ keys: JSON.parse(JSON.stringify(this.keys)) })
      }
    })
  }

  waitForSetup () {
    return this.doneCharGLB.then(() => {
      return this.doneCharMixer
    })
  }
}
