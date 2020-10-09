<template>
  <div>
    <div class="touch-action-manipulation select-none absolute z-30 bottom-0 left-0 pl-5 pb-5" v-if="game">
      <!-- <div class="touch-action-manipulation select-none flex"> -->
        <!-- <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border  text-20 text-white" :class="{ 'bg-blue-500': game.useGyro, 'bg-white': !game.useGyro }" @click="() => gui('toggle-gyro', {})">
          <img class="touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/gyro.svg" alt="">
        </div> -->
        <!--
        <div v-if="camlocker" class="inline-block rounded-full text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white">
          <img v-show="camlocker.mode === 'follow'"  @click="camlocker.mode = 'chase'" class=" scale-75 invert-filter transform select-none  pointer-events-none" src="./img/touch.svg" alt="">
          <img v-show="camlocker.mode !== 'follow'"  @click="camlocker.mode = 'follow'" class=" scale-75 invert-filter transform select-none  pointer-events-none" src="./img/camcorder.svg" alt="" />
        </div> -->
      <!-- </div> -->

      <!--  -->

      <!--
      <div class="touch-action-manipulation select-none" @touchstart.prevent="() => {}" @touchmove.prevent="() => {}">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-left', true)" @mousedown="gui('go-left', true)"  @touchend="gui('go-left', false)" @mouseup="gui('go-left', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/left.svg" alt="">
        </div>
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-right', true)" @mousedown="gui('go-right', true)" @touchend="gui('go-right', false)" @mouseup="gui('go-right', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/right.svg" alt="">
        </div>
      </div>

      <div class="touch-action-manipulation select-none" @touchstart.prevent="() => {}" @touchmove.prevent="() => {}">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-forward', true)" @mousedown="gui('go-forward', true)"  @touchend="gui('go-forward', false)" @mouseup="gui('go-forward', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/up.svg" alt="">
        </div>
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-backward', true)" @mousedown="gui('go-backward', true)" @touchend="gui('go-backward', false)" @mouseup="gui('go-backward', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/down.svg" alt="">
        </div>
      </div>
      -->

      <div ref="static" class="ml-4 mb-4 touch-action-manipulation select-none no-touchy" style="width: 100px; height: 100px; transform: scale(1.25);"></div>
    </div>

    <div class="touch-action-manipulation select-none absolute z-30 top-0 left-0 pl-2 pt-2" v-if="game">
      <div v-if="camlocker && camlocker.isMobile" class="inline-block rounded-full touch-action-manipulation text-center select-none p-3 mx-1 my-1 w-12 h-12 border-gray-800 border bg-white text-20 text-black" :class="{ 'bg-blue-500': camlocker.gyro && camlocker.gyro.use && camlocker.mode === 'chase', 'dd-bg-white': camlocker.gyro && !camlocker.gyro.use || !camlocker.gyro || camlocker.mode === 'follow' }" @click="camlocker.setupGYRO(); camlocker.mode = 'chase'">
        <img class="touch-action-manipulation scale-75 transform select-none pointer-events-none" src="./img/gyroscope.svg" alt="">
      </div>

      <div class="inline-block rounded-full touch-action-manipulation text-center select-none p-3 mx-1 my-1 w-12 h-12 bg-white text-20 text-black" @click="gui('key-x', fight); fight = !fight">
        <img class="touch-action-manipulation scale-75 transform select-none pointer-events-none" src="./img/gamepad.svg" alt="">
      </div>

    </div>

    <div class="touch-action-manipulation select-none absolute z-30 top-0 right-0 pl-2 pt-2" v-if="game">
      <!-- <div v-if="camlocker && camlocker.isMobile" class="inline-block rounded-full touch-action-manipulation text-center select-none p-3 mx-1 my-1 w-12 h-12 border-gray-800 border bg-white text-20 text-black" :class="{ 'bg-blue-500': camlocker.gyro && camlocker.gyro.use && camlocker.mode === 'chase', 'dd-bg-white': camlocker.gyro && !camlocker.gyro.use || !camlocker.gyro || camlocker.mode === 'follow' }" @click="camlocker.setupGYRO(); camlocker.mode = 'chase'">
        <img class="touch-action-manipulation scale-75 transform select-none pointer-events-none" src="./img/gyroscope.svg" alt="">
      </div> -->

      <div class="inline-block rounded-full touch-action-manipulation text-center select-none p-3 mx-1 my-1 w-12 h-12 bg-white text-20 text-black">
        <a href="/"><img class="touch-action-manipulation scale-75 transform select-none pointer-events-none" src="./img/menu.svg" alt=""></a>
      </div>
    </div>

    <div class="touch-action-manipulation select-none  absolute z-30 bottom-0 right-0 pr-5 pb-5" v-if="game">
      <!-- <div class="touch-action-manipulation select-none flex justify-end">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white bg-white" @click="goToPage()">
          <img class=" touch-action-manipulation scale-100 transform select-none  pointer-events-none" src="./img/menu.svg" alt="">
        </div>
      </div> -->

      <!-- <div class="touch-action-manipulation select-none  flex justify-end items-center"> -->
        <!-- <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white bg-white" @click="showToolsBox = !showToolsBox">
          <img class="touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/party.svg" alt="">
        </div> -->

        <!-- <div v-if="camlocker && camlocker.isMobile" class="inline-block white-border-round rounded-full touch-action-manipulation text-center select-none p-3 mx-1 my-1 w-12 h-12 dd-border-gray-100 dd-border  text-20 text-black" :class="{ 'bg-blue-500': camlocker.gyro && camlocker.gyro.use && camlocker.mode === 'chase', 'dd-bg-white': camlocker.gyro && !camlocker.gyro.use || !camlocker.gyro || camlocker.mode === 'follow' }" @click="camlocker.setupGYRO(); camlocker.mode = 'chase'">
          <img class="touch-action-manipulation scale-75 invert-filter transform select-none invert-filter pointer-events-none" src="./img/gyroscope.svg" alt="">
        </div> -->

        <!-- <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @click="gui('toggle-fight', true)">
          <img class="touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/gamepad.svg" alt="">
        </div> -->
      <!-- </div> -->

      <!-- <div class="touch-action-manipulation select-none  flex justify-end items-center">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white pointer-events-none" @click="gui('key-x', fight); fight = !fight">
          <img class="touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/gamepad.svg" alt="">
        </div>
      </div> -->

      <div class="touch-action-manipulation select-none flex justify-end items-center" @touchstart.prevent="() => {}" @touchmove.prevent="() => {}">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('key-t', true)" @mousedown="gui('key-t', true)"  @touchend="gui('key-t', false)" @mouseup="gui('key-t', false)">
          <img v-show="game && game.moodType === 'peaceful'" class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/love.svg" alt="">
          <img v-show="game && game.moodType === 'fighting'" class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/fight1.svg" alt="">
        </div>

        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('key-space', true)" @mousedown="gui('key-space', true)"  @touchend="gui('key-space', false)" @mouseup="gui('key-space', false)">
          <img v-show="game && game.moodType === 'peaceful'" class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/dance.svg" alt="">
          <img v-show="game && game.moodType === 'fighting'" class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/dance.svg" alt="">
        </div>
      </div>

      <!-- <div class="touch-action-manipulation select-none" v-show="game" @touchstart.prevent="() => {}" @touchmove.prevent="() => {}">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('turn-left', true)" @mousedown="gui('turn-left', true)"  @touchend="gui('turn-left', false)" @mouseup="gui('turn-left', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/turn-left.svg" alt="">
        </div>
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('turn-right', true)" @mousedown="gui('turn-right', true)" @touchend="gui('turn-right', false)" @mouseup="gui('turn-right', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/turn-right.svg" alt="">
        </div>
      </div> -->

      <!--
      <div class="touch-action-manipulation select-none" @touchstart.prevent="() => {}" @touchmove.prevent="() => {}">
        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-left', true)" @mousedown="gui('go-left', true)"  @touchend="gui('go-left', false)" @mouseup="gui('go-left', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/left.svg" alt="">
        </div>

        <div class="inline-block rounded-full white-border-round touch-action-manipulation text-center select-none p-3 mx-1 my-1 dd-border-gray-100 dd-border text-20 text-white" @touchstart="gui('go-right', true)" @mousedown="gui('go-right', true)" @touchend="gui('go-right', false)" @mouseup="gui('go-right', false)">
          <img class=" touch-action-manipulation scale-75 invert-filter transform select-none  pointer-events-none" src="./img/right.svg" alt="">
        </div>
      </div> -->

    </div>
  </div>
</template>

<script>
import nipplejs from 'nipplejs'
export default {
  props: {
    game: {},
    camlocker: {}
  },
  data () {
    return {
      fight: true,
      ctrl: {}
    }
  },
  methods: {
    gui (event, data) {
      if (this.ctrl[event] !== data) {
        this.ctrl[event] = data
        this.game.dispatchEvent({ type: event, data: data })
      }

      if (event === 'go-forward') {
        this.camlocker.mode = 'chase'
      } else if (event === 'go-backward') {
        this.camlocker.mode = 'chase'
      } else if (event === 'turn-left') {
        this.camlocker.mode = 'chase'
      } else if (event === 'turn-right') {
        this.camlocker.mode = 'chase'
      }
    }
  },
  mounted () {
    this.manager = nipplejs.create({
      zone: this.$refs['static'],
      mode: 'static',
      position: {left: '50%', top: '50%'},
      color: 'white',
      size: 100
    });
    let dir = ''
    this.manager.on('dir:up', () => {
      dir = 'up'
      this.gui('go-forward', true)
      this.gui('go-backward', false)
      this.gui('go-left', false)
      this.gui('go-right', false)

      this.gui('turn-left', false)
      this.gui('turn-right', false)
    })
    this.manager.on('dir:down', () => {
      dir = 'down'
      this.gui('go-forward', false)
      this.gui('go-backward', true)
      this.gui('go-left', false)
      this.gui('go-right', false)

      this.gui('turn-left', false)
      this.gui('turn-right', false)
    })
    this.manager.on('dir:left', () => {
      if (dir === 'up') {
        this.gui('go-forward', true)
      } else if (dir === 'down') {
        this.gui('go-backward', true)
      } else if (dir === '') {
        this.gui('turn-left', true)
        this.gui('turn-right', false)
      }
      this.gui('go-left', false)
      this.gui('go-right', false)
    })
    this.manager.on('dir:right', () => {
      if (dir === 'up') {
        this.gui('go-forward', true)
      } else if (dir === 'down') {
        this.gui('go-backward', true)
      } else if (dir === '') {
        this.gui('turn-left', false)
        this.gui('turn-right', true)
      }
      // this.gui('go-forward', false)
      // this.gui('go-backward', false)
      this.gui('go-left', false)
      this.gui('go-right', false)

      // this.gui('turn-left', false)
      // this.gui('turn-right', false)
    })


    /*
    {
        identifier: 0,              // the identifier of the touch/mouse that triggered it
        position: {                 // absolute position of the center in pixels
            x: 125,
            y: 95
        },
        force: 0.2,                 // strength in %
        distance: 25.4,             // distance from center in pixels
        pressure: 0.1,              // the pressure applied by the touch
        angle: {
            radian: 1.5707963268,   // angle in radian
            degree: 90
        },
        instance: Nipple            // the nipple instance that triggered the event
    }

        90,
    135     45,

  180        0, 360

    225     315

        270,
    */

    this.manager.on('start', () => {
      this.gui('go-forward', false)
      this.gui('go-backward', false)
      this.gui('go-left', false)
      this.gui('go-right', false)
      this.gui('turn-left', false)
      this.gui('turn-right', false)
    })

    this.manager.on('end', () => {
      dir = ''
      this.gui('go-forward', false)
      this.gui('go-backward', false)
      this.gui('go-left', false)
      this.gui('go-right', false)
      this.gui('turn-left', false)
      this.gui('turn-right', false)
    })

    this.manager.on('move', (ev, data) => {
      this.gui('joystick', JSON.parse(JSON.stringify(data)))
    })
    this.manager.on('end', () => {
      this.gui('joystick', false)
    })

    // window.addEventListener('keydown', e => {
    //   if (e.keyCode === 88) {
    //     this.gui('toggle-fight')
    //   }
    // })
    // window.addEventListener('keyup', e => {
    //   if (e.keyCode === 88) {
    //     this.gui('key-x', false)
    //   }
    // })
  },
  beforeDestroy () {
    this.manager.destroy()
  }
}
</script>

<style lang="postcss">
.moves-box{
  height: 170px;
}
@screen lg {
  .moves-box{
    height: calc(100% - 250px);
  }
}
.select-none, .select-none * {
  user-select: none;
}

.bg-transp-black{
  background-color: rgba(0,0,0,0.3);
}
.bg-transp-white{
  background-color: rgba(255,255,255,0.3);
}
.touch-action-manipulation, .touch-action-manipulation * {
  touch-action: manipulation;
}
.white-border-round {
  border: white solid 1px;
}
.invert-filter{
  filter: invert(1);
}

.no-touchy, .no-touchy * {
  touch-action: manipulation;
  user-select: none;
}
</style>