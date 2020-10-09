# Installation

1. Clone the project or donwload ZIP on [Github](https://github.com/wonglok/o3d-gen3).

2. Go to the folder and run `yarn`

3. run `yarn dev`

# Add a new Page

1. Copy a new Canvas inisde the Canvas Folder.

2. Add the Route
```javascript
  let routes = [
    {
      path: '/my-new-page',
      component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
    }
  ]
```

3. Start Coding. Have fun!
