<template>
  <div class="w-full">
    <div class="mdarea" v-html="htmlData"></div>
  </div>
</template>

<script>
import marked from 'marked'
import 'highlight.js/styles/rainbow.css'
var hljs   = require('highlight.js')

marked.setOptions({
  highlight: function(code, lang) {
    return `<div class="hljs">${hljs.highlight(lang, code).value}</div>`
  }
})

let renderer = {
  link(href, title, text){
    let link = href
    let target = false
    if (link.indexOf('http') === 0) {
      target = 'target="_blank"'
    }
    return `
      <a class="hover:bg-blue-300 hover:shadow bg-gray-200 duration-500 transition-all shadow-md no-underline inline-block mr-1 pt-1 px-3 rounded-full" href="${link}" ${target} alt="${title}">${text} <img class="${target ? '' : 'hidden'} inline h-4 ml-1 mr-1 mb-2" src="${require('./icons/extlink.svg')}" /></a>
    `
  }
}

marked.use({ renderer })

export default {
  props: {
    md: {}
  },
  data () {
    return {
      htmlData: ''
    }
  },
  mounted () {
    let render = () => {
      let txt = this.md || ''
      txt = txt.trim()
      this.htmlData = marked(txt)
    }
    render()
    this.$watch('md', () => {
      render()
    }, { deep: true })
  },
  beforeDestroy () {
  },
  computed: {
  }
}
</script>

<style lang="postcss">
.mdarea > * {
  @apply mb-3;
}
.mdarea h1{
  @apply text-3xl;
}
.mdarea h2{
  @apply text-2xl;
}
.mdarea h3{
  @apply text-xl;
}
.mdarea a{
}
.mdarea ol{
  @apply list-decimal pl-5 ml-3;
}
.mdarea ul{
  @apply list-disc pl-5 ml-3;
}
.mdarea li{
  @apply my-4;
}
.mdarea pre .hljs{
  @apply p-4;
}
.mdarea p code {
  @apply bg-green-600 px-3 py-1 rounded-full shadow-md text-white inline-block;
}
.mdarea p code:hover {
  @apply shadow-lg;
}
</style>

