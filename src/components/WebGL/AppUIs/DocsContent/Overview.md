
# Code Overview
Here are some quick examples to demonstarate what this framework is about.

- Simple Object 3D Layout similar to div element and Slot in Vue

```html
  <O3D py="0">
    <DanceFloor>
      <O3D px="-20">
        <GLFlower />
      </O3D>
      <O3D px="30">
        <GLFlower />
      </O3D>
    </DanceFloor>
  </O3D>
```

- Simple Hooks for onResize and onLoop

```js
mounted () {
  let camera = new THREE.PerspectiveCamera()
  this.onResize(() => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  let v3 = new THREE.Vector3()
  this.onLoop(() => {
    let target = v3.setFromMatrixPosition(characterHead.matrixWorld)
    camera.lookAt(target)
  })
}
```

- Easy HTML UI Integration for quick development

```html
<O3D>
  <GLFlower />
</O3D>

<div class="absolute top-0 left-0">
  <button @click="danceMove = 'Gangnam Style'">Gangnam Style</button>
  <button @click="danceMove = 'Brooklyn Uprock'">Brooklyn Uprock</button>
</div>
```

- Easy Access Parent Compoennt Properties with Context

```js
// Yessssss!
var cubeCamera = this.ctx.cubeCam
```

```js
// Nooooooo!
var cubeCamera = this.$parent.$parent.cubeCam
```

# Other Features

- Reuse Mindset in Vue and Three.JS
- Productivity First Design by AutoLoad Component Folders
- White Box Framework Approach, Allow Customistaion to the Max
- Support Large Scale Code Base
- Small Core, Many Component Addons

# Up Next

[Code Walkthough](/docs/code-walkthrough)