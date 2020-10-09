<template>
  <div class="full">

    <section class="full relative">
      <GLArtCanvas :rounded="'0px 0px 0px 0px'" class="full absolute top-0 left-0" style="z-index: -1;" bgcolor="#000000">
        <!-- <MBLinesBloom :pz="-20" :scale="{ x: 1.2, y: 1.2, z: 1.2 }"></MBLinesBloom> -->
        <Bloomer :settings="{
          exposure: 1.0,
          bloomStrength: 2,
          bloomThreshold: (950.72) / 100.0,
          bloomRadius: 80.99 / 100.0 * 2
        }"></Bloomer>

        <!-- <GLFlower :pz="20"></GLFlower> -->
        <!-- <GradientBG :pz="-20"></GradientBG> -->
        <Halo :scale="{ x: 0.2, y: 0.2, z: 0.2 }" :pz="-20"></Halo>

        <!-- <NPC :char="'swat'" :scale="{ x: 5, y: 5, z: 5 }" :position="{ x: 0, y: -80, z: 0 }"></NPC> -->

        <StandardLights></StandardLights>

        <SwatWalk :py="30"></SwatWalk>

        <!-- <GLFlower></GLFlower> -->
        <!-- <FastFlame :lowres="true" :sy="1 * 2" :sx="3.6 * 2"></FastFlame> -->
      </GLArtCanvas>

      <div class="full overflow-scroll scrolling-touch"  style="background-color: rgba(0,0,0,0.6)">

        <div class="mx-auto max-w-xl py-12 px-6 text-white text-center">
          <div class=" text-2xl m-3 pb-6">Touch a Halo ✞ by Lok Lok</div>

          <div class="m-3">
            With the touch of Love from Jesus, you can forgive, bravely love others despite all the hurt on earth.
          </div>

          <div class="m-3">
            Fogiveness are actions and decisions that you can make inspite of your contrary feelings.
          </div>

          <div class="m-3">
            When we do our part of choosing forgiveness, God can do his part.
          </div>

          <div class="m-3">
            Let your presence reminds everyone of their own halo within, that everyone can shine like Heaven on Earth.
          </div>

          <div class="m-3">
            Choose your character.
          </div>

          <div>
            <button :key="'char' + i" v-for="(char, i) in CharList" :style="{ backgroundColor: idx + '' === (char.key) + '' ? 'rgba(255,255,255,0.3)' : '' }" class="p-1 border border-white rounded-full px-3 outline-none text-xs m-1" @click="idx = char.key">{{ char.name }}</button>
          </div>
          <div>
            <a class="inline-block m-3" :href="`/app?character=${idx}`">
              <button v-if="!showLoading" class="p-3 border border-white rounded-full px-8 outline-none" style="background-color: rgba(255,255,255,0.3)">Start Game</button>
              <button v-if="showLoading" class="p-3 border border-white rounded-full px-8 outline-none" style="background-color: rgba(255,255,255,0.3)">Loading... {{ loadingPercentage }}%</button>
            </a>
          </div>

          <div>
            <a class="inline-block m-3" :href="`/find-actions?character=${idx}`">
              <button class="p-3 border border-white rounded-full px-5 outline-none text-xs">Explore Actions</button>
            </a>
          </div>

          <div class="m-3">
            Keyboard Control Instruction
          </div>

          <div class="m-3 whitespace-pre-wrap text-center">WASD = Run Direction,
QE = Turn left right,
Hold Space = Jump,
X = Toggle Fight Mode,
R = Do Action
          </div>

        </div>
      </div>

    </section>

    <section v-if="false" class="text-gray-700 body-font max-w-5xl mx-auto">
      <div class="container px-5 py-24 mx-auto flex flex-wrap">
        <div class="flex flex-wrap w-full">
          <div class="w-full rounded-lg md:mt-0 mt-12">
            <div class="course-catalogue-art rounded-lg ">
              <GLArtCanvas class="h-full w-full rounded-lg" :rounded="'8px 8px 8px 8px'">
                <!-- <Bloomer :settings="{
                  exposure: 1.0,
                  bloomStrength: 1.7,
                  bloomThreshold: 20.72 / 100.0,
                  bloomRadius: 72.99 / 100.0 * 2
                }"></Bloomer> -->

                <GLFlower></GLFlower>

                <!-- <EnergyArt :pz="50" :lowres="true"></EnergyArt> -->
                <!-- <FastFlame :sx="3.6" :lowres="true"></FastFlame> -->
              </GLArtCanvas>
            </div>
          </div>
          <!-- <img class="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://dummyimage.com/1200x500" alt="step"> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import { loadGLTF } from '../../Core/loadGLTF'
import { LoadingManager } from '../../Core/LoadingManager'
import { CharList } from '../EventSpaceV2/CharList'
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  data () {
    // let chars = [
    //   'ricky',
    //   'janice',
    //   'alex',
    //   'david',
    //   'frank',
    //   'girl',
    //   'glassman',
    //   'joe',
    //   'peter',
    //   'steve',
    //   'swat'
    // ]
    return {
      CharList: CharList,
      idx: 'swat',
      loadingPercentage: 3,
      showLoading: false
    }
  },
  mounted () {
    let CharActions = require('../EventSpaceV2/EventChar.js').CharActions
    CharActions.preload()
    require('../EventSpaceV2/loadAmmo.js').loadAmmo()
    // loadGLTF(require('file-loader!../EventSpaceV2/char/suzie.glb'))

    LoadingManager.hooks.push((v) => {
      if (v > 0) {
        this.showLoading = true
      }
      if (v === 1) {
        this.showLoading = false
      }
      this.loadingPercentage = (v * 100).toFixed(1)
      if (this.loadingPercentage < 0) {
        this.loadingPercentage = 0
      }
    })
  }
}
</script>

<style lang="postcss">
.course-banner{
  height: 60vh;
}
.course-banner-overlay{
  background-color: rgba(0, 0, 0, 0.185);
}

.course-catalogue-art{
  position: sticky;
  top: 30px;
  height: 550px;
  background-image: url(./img/cherry.jpg);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-color: #142f79;
}
/* @screen lg{
  .course-catalogue-art{
    height: 100%;
  }
} */
</style>