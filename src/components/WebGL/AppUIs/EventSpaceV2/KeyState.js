export class KeyState {
  constructor ({ base }) {
    this.base = base
    let isDown = {
      isDownAny: false,
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
    this.isDown = isDown

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

    var onKeyDown = async (event) => {
      isDown.isDownAny = true
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
          // if (this.parent.mode === 'full') {
          //   toggleFightMode()
          // }
          isDown.mood = true
          break;

        default:
          break
      }

      // syncCmd()

      // if (actionKeyMap.find(e => {
      //   return e.type === 'doOnce' && e.cmd === btn.cmd
      // })) {
      //   btn.skip = true
      // } else {
      //   btn.skip = false
      // }

      // runCmd()

      // if (this.lastPlayingMove) {
      //   this.lastPlayingMove.fadeOut(0.15)
      // }
    }
    var onKeyUp = async (event) => {
      isDown.isDownAny = false
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

      // syncCmd()

      // if (btn.skip) {
      //   return
      // }
      // runCmd()
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

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    return isDown
  }
}