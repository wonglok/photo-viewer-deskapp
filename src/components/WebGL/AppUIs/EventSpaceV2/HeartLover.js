import { Object3D, EventDispatcher, Vector3 } from "three"
// import { Object3D, EventDispatcher, Vector3, Points, Geometry, ShaderMaterial } from "three"
import { loadGLTF } from '../../Core/loadGLTF'
// import { MatCapService } from '../../Packages/MatCaps/MatCapService'

import SpriteText from 'three-spritetext'

export class Emojis {
  constructor () {
    this.map = require('./emojis/glb.js').default
    // console.log(this.map)
  }
  getRandom () {
    let keys = Object.keys(this.map)
    let keysCount = keys.length
    let kn = keys[Math.floor(Math.random() * keysCount)]
    return {
      url: this.map[kn],
      kn
    }
  }
}

// class BlingBling {
//   constructor ({ o3d, onLoop, chroma, charContainer }) {
//     this.onLoop = onLoop
//     this.chroma = chroma
//     this.o3d = o3d
//     this.charContainer = charContainer

//     this.done = this.setup()
//   }
//   async setup () {
//     let geo = new Geometry()

//     let vtx = geo.vertices
//     let stars = 150
//     let radius = 20
//     let height = 30

//     for (let rad = 0; rad < stars; rad++) {
//       let each = rad / stars * Math.PI * 2.0
//       let y = rad / stars * height

//       let x = radius * ((Math.sin(each) * Math.sin(each)) - 0.5)
//       let z = radius * Math.sin(each) * Math.cos(each)
//       vtx.push(
//         new Vector3(x, y, z),
//       );
//     }

//     let map = false
//     if (this.chroma) {
//       map = this.chroma.out.texture
//     }
//     let uniforms = {
//       myTex: { value: map },
//       time: { value: 0 }
//     }
//     let mat = new ShaderMaterial({
//       uniforms,
//       vertexShader: `
//       uniform float time;
//       varying vec2 vUv;
//       const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

//       float noise( in vec2 p ) {
//         return sin(p.x)*sin(p.y);
//       }

//       float fbm4( vec2 p ) {
//           float f = 0.0;
//           f += 0.5000 * noise( p ); p = m * p * 2.02;
//           f += 0.2500 * noise( p ); p = m * p * 2.03;
//           f += 0.1250 * noise( p ); p = m * p * 2.01;
//           f += 0.0625 * noise( p );
//           return f / 0.9375;
//       }

//       float fbm6( vec2 p ) {
//           float f = 0.0;
//           f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
//           f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
//           f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
//           f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
//           f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
//           f += 0.015625*(0.5 + 0.5 * noise( p ));
//           return f/0.96875;
//       }

//       float pattern (vec2 p) {
//         float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
//         return abs(vout);
//       }

//       void main(void) {
//         vec3 nPos = position;
//         nPos *= pattern(vec2(time + nPos.x, nPos.y));
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
//         gl_PointSize = 4.0;
//         vUv = uv;
//       }
//     `,
//       fragmentShader: `
//       varying vec2 vUv;
//       uniform sampler2D myTex;
//       void main(void) {
//         vec4 color = texture2D(myTex, vUv);
//         float size = length(gl_PointCoord.xy - 0.5);

//         if (size < 0.5) {
//           gl_FragColor = vec4(color);
//         } else {
//           discard;
//         }
//       }
//       `
//     })
//     this.stars = new Points(geo, mat)

//     this.onLoop(() => {
//       uniforms.time.value = window.performance.now() * 0.001
//       this.stars.rotation.y += 0.0333
//     })

//     this.stars.position.y -= 5

//     this.o3d.add(this.stars)
//   }
// }

class Love {
  constructor () {
    let CharActions = require('./EventChar').CharActions
    this.cheers = CharActions.moves.filter(e => e.type === 'cheer')

    this.lovelyMessages = [
      `Thank you for uplifting my spirit.`,
      `Let's uplift more pepole!`,
      `Thank you!`,
      `Thank God! You made my day.`,
      `Let's Dance!`,
      `God Bless you for your love.`,
      `Thank you for your Kindness.`,
      `Love is supreme.`
    ]

    Love.idxLove = Love.idxLove || 0 // Math.floor(lovelyMessages.length * Math.random())
    Love.idxCheer = Love.idxCheer || Math.floor(Math.random() * this.cheers.length) // Math.floor(lovelyMessages.length * Math.random())
  }
  cheerYouNext () {
    let name = this.cheers[(Love.idxCheer % this.cheers.length)].displayName
    Love.idxCheer++
    return name
  }
  loveOutLoud () {
    let msg = this.lovelyMessages[Math.floor(Love.idxLove % this.lovelyMessages.length)]
    Love.idxLove++
    return msg
  }
}

class GameNPC extends EventDispatcher {
  constructor ({ o3d, onLoop, chroma, charContainer }) {
    super()
    this.onLoop = onLoop
    this.chroma = chroma
    this.o3d = o3d
    this.charContainer = charContainer
    this.love = new Love()
    this.size = {
      x: 16 / 2,
      y: 20,
      z: 16 / 2,
    }
    this.moodType = 'fighting'
    this.chars = ['swat', 'glassman', 'suzie']
    this.useCharacter = 'glassman'
    // this.useCharacter = this.chars[Math.floor(Math.random() * this.chars.length)]

    this.done = this.setup()
  }

  saySomething (say) {
    var myText = new SpriteText(say)
    // myText.material.blending = AdditiveBlending
    myText.material.transparent = true
    myText.material.opacity = 0.75
    myText.textHeight = 1
    myText.color = 'black'
    myText.backgroundColor = 'white'
    myText.padding = '3'

    myText.position.y += 20
    this.o3d.add(myText)
  }

  async setup () {
    // let base = new BaseMocker({ o3d: this.o3d, onLoop: this.onLoop, chroma: this.chroma })
    let Characeter = require('./EventChar').Character
    let char = new Characeter({ base: this, isNPC: true })

    await char.waitForSetup().then(() => {
      let danceName = this.love.cheerYouNext()
      char.actor.position.y += 13
      // char.actor.position.x += 15 / 2
      let rotateCharacter = new Object3D()
      rotateCharacter.add(char.actor)
      this.o3d.add(rotateCharacter)

      // char.actor.traverse(async item => {
      //   if (item.isMesh) {
      //     let stuff = await MatCapService.getRandom()
      //     item.material = stuff
      //     stuff.skinning = true
      //     stuff.flatShading = true
      //     // if (this.chroma) {
      //     //   stuff.envMap = this.chroma.out.envMap
      //     // }
      //   }
      // })

      char.act({ name: danceName })
      this.saySomething(this.love.loveOutLoud())

      let charWorldPos = new Vector3()
      let npcWorldPos = new Vector3()
      this.onLoop(() => {
        this.charContainer.getWorldPosition(charWorldPos)
        rotateCharacter.getWorldPosition(npcWorldPos)

        let howLong = npcWorldPos.clone().sub(charWorldPos).length()
        if (howLong >= 20) {
          rotateCharacter.lookAt(charWorldPos)
        } else {
          rotateCharacter.rotation.x = 0
          rotateCharacter.rotation.y = 0
          rotateCharacter.rotation.z = 0
        }
      })
    })
  }
}

export class HeartLover {
  constructor ({ onLoop, ammo, onClean, o3d, chroma, charContainer, rayplay }) {
    this.onLoop = onLoop
    this.ammo = ammo
    this.onClean = onClean
    this.o3d = o3d
    this.emojis = new Emojis()
    this.chroma = chroma
    this.charContainer = charContainer
    this.rayplay = rayplay

    this.insertSetCache = new Set([])

    //
    // let getRandomCheerName = () => cheers[Math.floor(Math.random() * cheers.length)].displayName
    // this.done = Promise.all(cheers.map(() => {
    //   // return true
    //   return CharActions.preloadByName({ name: e.displayName })
    // }))

    this.done = Promise.resolve()

    this.ammoWorld.addEventListener('halo', async (v) => {
      let mesh = this.ammo.getObjectsMap().get(v.uuid)
      // console.log(v)
      // console.log()
      if (mesh && !this.insertSetCache.has(v.uuid)) {
        mesh.material.opacity = 0.5
        mesh.material.transparent = true
        this.insertSetCache.add(v.uuid)

        // setTimeout(() => {
        //   mesh.material.opacity = 1
        //   this.insertSetCache.delete(v.uuid)
        // }, 5000)

        let newO3 = new Object3D()

        mesh.getWorldPosition(newO3.position)
        let emoji = this.emojis.getRandom()
        let gltfEmoji = await loadGLTF(emoji.url)
        gltfEmoji.scene.scale.set(20, 20, 20)
        this.onLoop(() => {
          gltfEmoji.scene.rotation.y += 0.02333
        })
        gltfEmoji.scene.position.x += 20
        gltfEmoji.scene.position.y += 5

        newO3.add(gltfEmoji.scene)
        this.o3d.add(newO3)

        new GameNPC({
          o3d: newO3,
          onLoop: this.onLoop,
          chroma: this.chroma,
          charContainer: this.charContainer
        })

        // new BlingBling({
        //   o3d: newO3,
        //   onLoop: this.onLoop,
        //   chroma: this.chroma,
        //   charContainer: this.charContainer
        // })
      }
    })
  }
  async waitForSetup () {
    return this.done
  }
  get ammoWorld () {
    return this.ammo.getDirect()
  }
}
