<template>
  <div class="full relative" :class="{ 'neu-bg': neu }">
    <!-- <DocsCanvas class="full hiddensmall">
      <GradientBG :pz="-20"></GradientBG> -->

      <div class="p-3 py-6 absolute top-0 left-0 w-full">
        <router-link :to="link.path" v-for="link in links" :key="link.path">
          <div class="px-3 py-2 mx-6font-light "  @click="$emit('menu-toggle')" :class="{ 'text-right': neu }">
            {{ link.name }}
          </div>
        </router-link>
      </div>
    <!-- </DocsCanvas> -->
  </div>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue.js'
export default {
  mixins: [
    O3DVue
  ],
  props: {
    neu: {
      default: true
    }
  },
  data () {
    return {
      links: require('./MenuListData.js').MenuListData
    }
  }
}
</script>

<style lang="postcss">
.hiddensmall canvas{
  display: none;
}
@screen lg {
  .hiddensmall canvas{
    display: block;
  }
}
</style>