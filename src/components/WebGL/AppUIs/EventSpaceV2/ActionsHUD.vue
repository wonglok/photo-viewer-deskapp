<template>
  <div class=" absolute top-0 right-0 actions-gui overflow-scroll scrolling-touch">
    <div class="bg-white p-1 m-1">
      Prayer
    </div>
    <div v-for="mv in list.filter(e => e.type === 'prayer')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Gestures
    </div>
    <div v-for="mv in list.filter(e => e.type === 'gestures')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Breakdance
    </div>
    <div v-for="mv in list.filter(e => e.type === 'breakdance')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Thriller
    </div>
    <div v-for="mv in list.filter(e => e.type === 'thriller')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Dancing
    </div>
    <div v-for="mv in list.filter(e => e.type === 'dancing')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Football
    </div>
    <div v-for="mv in list.filter(e => e.type === 'football')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      SuperHero
    </div>
    <div v-for="mv in list.filter(e => e.type === 'superhero')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Sitting
    </div>
    <div v-for="mv in list.filter(e => e.type === 'sit')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Pose
    </div>
    <div v-for="mv in list.filter(e => e.type === 'pose')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
      Posture
    </div>
    <div v-for="mv in list.filter(e => e.type === 'posture')" :key="mv._id" class="m-1 border-gray-700 border p-1 text-xs bg-white cursor-pointer inline-block" @mouseover="onMouseOver($event, mv.displayName)" @click="$root.$emit('act', { name: mv.displayName }); copy(mv.displayName)">{{ mv.displayName }}</div>
    <div class="bg-white p-1 m-1">
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

  }
}
</script>

<style lang="postcss">
.actions-gui{
  cursor: pointer;
  width: 250px;
  height: calc(100px);
}
@screen lg{
  .actions-gui{
    width: 250px;
    height: calc(100% - 100px);
  }
}
</style>