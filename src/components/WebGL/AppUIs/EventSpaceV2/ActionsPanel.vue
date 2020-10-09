<template>
  <div class="h-full w-full actions-panel overflow-scroll scrolling-touch p-3">
    <div>
      Prayer
    </div>
    <div v-for="mv in list.filter(e => e.type === 'prayer')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Gestures
    </div>
    <div v-for="mv in list.filter(e => e.type === 'gestures')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Breakdance
    </div>
    <div v-for="mv in list.filter(e => e.type === 'breakdance')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Thriller
    </div>
    <div v-for="mv in list.filter(e => e.type === 'thriller')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Dancing
    </div>
    <div v-for="mv in list.filter(e => e.type === 'dancing')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Football
    </div>
    <div v-for="mv in list.filter(e => e.type === 'football')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      SuperHero
    </div>
    <div v-for="mv in list.filter(e => e.type === 'superhero')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Sitting
    </div>
    <div v-for="mv in list.filter(e => e.type === 'sit')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Pose
    </div>
    <div v-for="mv in list.filter(e => e.type === 'pose')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Posture
    </div>
    <div v-for="mv in list.filter(e => e.type === 'posture')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div>
      Control
    </div>
    <div v-for="mv in list.filter(e => e.type === 'control')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
  </div>
</template>

<script>
import { Moves } from './EventChar'
let copy2clip = require('copy-to-clipboard')
export default {
  data () {
    return {
      list: new Moves()
    }
  },
  methods: {
    copy (v) {
      copy2clip(v)
    },
    onMouseOver (evt, displayName) {
      if (evt.shiftKey) {
        this.$root.$emit('act', { name: displayName });
      }
    }
},
mounted () {
// addToList({ mapper: require('./moves/controls/fbx').default, type: 'control' })
//     addToList({ mapper: require('./moves/cheer/fbx').default, type: 'cheer' })
//     addToList({ mapper: require('./moves/gestures/fbx').default, type: 'gestures' })
//     addToList({ mapper: require('./moves/sit/fbx').default, type: 'sit' })

//     addToList({ mapper: require('./moves/posture-fixed/fbx').default, type: 'pose' })
//     addToList({ mapper: require('./moves/posture/fbx').default, type: 'posture' })

//     addToList({ mapper: require('./moves/superhero/fbx').default, type: 'superhero' })

//     addToList({ mapper: require('./moves/breakdance/fbx').default, type: 'breakdance' })
//     addToList({ mapper: require('./moves/dancing/fbx').default, type: 'dancing' })

  }
}
</script>

<style lang="postcss">
</style>
