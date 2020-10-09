# Any Page

On any page, you can have multiple canvases or just 1 canvas. We have an option to lazy render visible canvases.

# RenderRoot

The Render Root is where the WebGL Canvas is inserted. It usually holds the camera and the scene object.

```html
<template>
  <div class="full relative">
    <GradientBG :pz="-20" v-if="camera"></GradientBG>
    <div class="absolute top-0 left-0 h-full w-full flex items-center justify-between">
      <div class="text-xl mx-4">
        O3D-GEN3
      </div>
      <div class="text-xl mx-4">
        <img src="./img/menu.svg" @click="$emit('menu-toggle')" class="lg:hidden" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { RenderRoot } from '../../Core/RenderRoot'
import { PCamera } from '../../Core/PCamera'
import { Scene, Color } from 'three'

export default {
  mixins: [
    RenderRoot
  ],
  data () {
    return {
      scene: false,
      camera: false
    }
  },
  mounted () {
    this.scene = new Scene()
    this.camera = new PCamera({ element: this.ctx.element, onResize: this.onResize })
    this.camera.position.z = 100

    this.scene.background = new Color('#ffffff')
    this.scene.add(this.o3d)
  }
}
</script>

<style>

</style>
```

# O3D Layout

There are a few ways to use `<O3D></O3D>` layout

```html
<O3D layout="happy">
  <GLFlower />
</O3D>

<script>
export default {
  data () {
    return {
      layouts: {
        happy: {}
      }
    }
  },
  mounted () {
    this.onLoop(() => {
      this.layouts.happy.rx += 0.0001
    })
  }
}
</script>
```


```html
<O3D rx="time">
  <GLFlower />
</O3D>

<script>
export default {
  data () {
    return {
      time: 0
    }
  },
  mounted () {
    this.onLoop(() => {
      this.time += 0.0001
    })
  }
}
</script>
```

# 3D Visuals

To insert 3d visuals into scene or adapt different watchers and props into your own Three.JS classes.

```html
<template>
  <O3D>
    <slot></slot>
  </O3D>
</template>

<script>
import { O3DNode } from '../../Core/O3DNode'
import { EnergyArt } from './EnergyArt'
export default {
  props: {
    lowres: {
      default: false
    }
  },
  mixins: [O3DNode],
  methods: {
    main () {
      let resX = 256
      let resY = 256
      if (this.lowres) {
        resX = 128
        resY = 128
      }
      this.mesh = new EnergyArt({ renderer: this.ctx.renderer, onLoop: this.onLoop, onResize: this.onResize, onClean: this.onClean, resX, resY })
      this.o3d.add(this.mesh.out.o3d)

      this.o3d.rotation.x = Math.PI * 0.25
      this.o3d.rotation.z = Math.PI * -0.15

      // this.o3d.rotation.z = Math.PI * 0.5
    }
  },
  mounted () {
    this.main()
  }
}
</script>

<style>
</style>

```