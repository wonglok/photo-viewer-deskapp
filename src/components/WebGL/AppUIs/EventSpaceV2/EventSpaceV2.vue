<template>
  <div class="full relative no-touch-canvas no-touchy-one-level">
    <!-- <StandardLights></StandardLights> -->
    <O3D :px="0" :pz="0" :py="0">
      <AmbinetLight :color="0xffffff" :helper="isDev && isOff" :intensity="1.0"></AmbinetLight>
    </O3D>
    <EventGUI v-if="game && camlocker" :game="game" :camlocker="camlocker"></EventGUI>

    <NPC ref="npc1" :char="'swat'" :position="{ x: 126.0895767211914, y: 0, z: 364.65924072265625 + 220 - 30 }"></NPC>
    <!-- <NPC ref="npc2" :position="{ x: 126.0895767211914 + 30.33, y: 0, z: 364.65924072265625 + 220 - 30 }"></NPC>
    <NPC ref="npc3" :position="{ x: 126.0895767211914 + -30.33, y: 0, z: 364.65924072265625 + 220 - 30 }"></NPC> -->

    <!-- <Halo :scale="{ x: 10, y: 10, z: 10 }"></Halo> -->

    <LoadingGUI :force="force"></LoadingGUI>
    <!-- <ActionsHUD></ActionsHUD> -->
  </div>
</template>

<script>
import { RenderRoot } from '../../Core/RenderRoot'
import { Scene, Color, MeshBasicMaterial, Mesh, TorusBufferGeometry } from 'three'
import { PCamera } from '../../Core/PCamera'
import { RayPlay } from '../../Core/RayPlay'
import { PhysicsAmmoInterface } from './PhysicsAmmoInterface'
import { ShaderCubeChromatics } from '../../Packages/Materials/ShaderCubeChromatics'
import { CharList } from './CharList'
// import { ShaderCubeToy } from '../../Packages/Materials/ShaderCubeToy'

export default {
  mixins:[
    RenderRoot
  ],
  data () {
    return {
      force: true,
      scene: false,
      camera: false,
      rayplay: false,
      ammo: false,
      game: false,
      camlocker: false
    }
  },
  methods: {
    init () {
      // let CharActions = require('./EventChar.js').CharActions
      // CharActions.preload()

      this.scene = new Scene()
      this.camera = new PCamera({ element: this.element, onResize: this.onResize })

      this.scene.add(this.o3d)
      this.scene.background = new Color('#232323')

      this.rayplay = new RayPlay({ mounter: this.element, onResize: this.onResize, onLoop: this.onLoop, camera: this.camera, onClean: this.onClean })
    },
    async initSystem () {
      let chroma = new ShaderCubeChromatics({ renderer: this.ctx.renderer, onLoop: this.onLoop, res: 128, color: new Color('#ffffff') })
      this.chroma = chroma

      // let LoveSphere = require('./LoveSphere.js').LoveSphere
      // new LoveSphere({
      //   onLoop: this.onLoop,
      //   ctx: this.ctx,
      //   onClean: this.onClean,
      //   o3d: this.o3d
      // })

      this.ammo = new PhysicsAmmoInterface({ mode: 'manual', onLoop: this.onLoop })
      await this.ammo.waitForSetup()

      // this.ammo.getDirect().addEventListener('love-halo', () => {
      // })

      let torus = new TorusBufferGeometry(20, 4.1, 15, 145)
      let fallingBox = () => {
        // falling box
        let mat = new MeshBasicMaterial({ color: new Color('#ffffff'), wireframe: false, envMap: chroma.out.envMap })
        let mesh = new Mesh(torus, mat)
        mesh.position.y = 100
        mesh.position.z = (Math.random() - 0.5) * 600
        mesh.position.x = (Math.random() - 0.5) * 600

        this.o3d.add(mesh)

        this.ammo.addMesh({
          info: {
            name: 'Halo',
            isHalo: true,
          },
          mesh,
          mass: 0.1,
          rootScale: 1
        })
      }

      for (let i = 0; i < 15; i++) {
        fallingBox()
      }

      // let ground = () => {
      //   let geo = new BoxGeometry(1500, 1, 1500, 5, 5, 5)
      //   let mat = new MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
      //   let mesh = new Mesh(geo, mat)
      //   this.o3d.add(mesh)
      //   this.ammo.addMesh({
      //     mesh,
      //     mass: 0,
      //     rootScale: 1
      //   })
      // }
      // ground()

      let makeFactory = async () => {
        let RoomFactory = require('./RoomFactory.js').RoomFactory
        let room = new RoomFactory({ ctx: this.ctx, o3d: this.o3d, addMesh: v => this.ammo.addMesh(v) })
        let birthPlace = room.birthPlace
        this.camera.position.fromArray(room.birthPlace)
        this.camera.position.y += 100
        await room.waitForSetup()

        // this.camera.lookAt(new Vector3().fromArray(room.birthPlace))

        let chars = CharList.map(e => e.key)
        let urlChar = this.$route.query.character
        if (!chars.includes(this.$route.query.character)) {
          urlChar = 'swat'
        }

        let EventChar = require('./EventChar.js').EventChar
        let eventChar = new EventChar({
          ammo: this.ammo,
          onLoop: this.onLoop,
          onResize: this.onResize,
          birthPlace,
          useCharacter: urlChar || 'ricky',
          // useCharacter: window.innerWidth >= 1280 ? 'swat' : 'glassman',
          chroma
        })

        this.game = eventChar

        await eventChar.waitForSetup()

        this.$root.$on('act', ({ name }) => {
          eventChar.act({ name })
          // this.$refs.npc1.$emit('act', { name })
          // this.$refs.npc2.$emit('act', { name })
          // this.$refs.npc3.$emit('act', { name })
        })

        this.o3d.add(eventChar.o3d)
        // this.game.dispatchEvent({ type: 'toggle-fight', data: true })

        let CamLock = require('./EventChar.js').CamLock
        this.camlocker = new CamLock({
          target: eventChar.o3d,
          onLoop: this.onLoop,
          camera: this.ctx.camera,
          element: this.ctx.renderer.domElement,
          onClean: this.onClean
        })

        // let CamGame = require('./CamGame.js').CamGame
        // new CamGame({
        //   actor: eventChar.charVisual.actor,
        //   o3d: eventChar.charVisual.actor.parent,
        //   onLoop: this.onLoop,
        //   camera: this.ctx.camera,
        //   element: this.ctx.renderer.domElement,
        //   onClean: this.onClean
        // })

        // let CamLock = require('./EventChar.js').CamLock
        // this.camlocker = new CamLock({
        //   target: eventChar.o3d,
        //   onLoop: this.onLoop,
        //   camera: this.ctx.camera,
        //   element: this.ctx.renderer.domElement,
        //   onClean: this.onClean
        // })

        this.ammo.ready = true

        let HeartLover = require('./HeartLover.js').HeartLover
        this.heartLover = new HeartLover({
          ammo: this.ammo,
          onLoop: this.onLoop,
          onClean: this.onClean,
          o3d: this.o3d,
          chroma: this.chroma,
          charContainer: eventChar.o3d,
          rayplay: this.rayplay
        })

        await this.heartLover.waitForSetup()

        // let HowToStart = require('./HowToStart.js').HowToStart
        // this.howToStart = new HowToStart({
        //   ammo: this.ammo,
        //   onLoop: this.onLoop,
        //   onClean: this.onClean,
        //   o3d: this.o3d,
        //   chroma: this.chroma,
        //   rayplay: this.rayplay,
        //   vm: this,
        //   charContainer: eventChar.o3d
        // })

        // let HowToMove = require('./HowToMove.js').HowToMove
        // this.howToMove = new HowToMove({
        //   ammo: this.ammo,
        //   onLoop: this.onLoop,
        //   onClean: this.onClean,
        //   o3d: this.o3d,
        //   chroma: this.chroma,
        //   rayplay: this.rayplay,
        //   vm: this,
        //   charContainer: eventChar.o3d
        // })

        setTimeout(() => {
          this.force = false
        }, 1)
      }

      makeFactory()

      this.onClean(() => {
        if (process.env.NODE_ENV === 'development') {
          window.location.reload()
        }
      })
    }
  },
  mounted () {
    this.init()
    this.initSystem()
  },
  beforeDestroy () {
  }
}
</script>

<style>
.no-touchy, .no-touchy *, canvas.no-touch-canvas, .no-touch-canvas canvas, .no-touchy-one-level {
  touch-action: manipulation;
  user-select: none;
}
</style>