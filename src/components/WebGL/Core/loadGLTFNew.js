import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FileLoader } from 'three'
import { LoadingManager } from './LoadingManager'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/libs/draco/')

export const rafSleep = () => new Promise((resolve) => { window.requestAnimationFrame(resolve) })
export const sleep = (t = 0) => new Promise((resolve) => { setTimeout(resolve, t) })

let localforage = require('localforage')
let loadArrayBuffer = async (url) => {
  return new Promise((resolve) => {
    let loaderFile = new FileLoader(LoadingManager)
    loaderFile.setResponseType('arraybuffer')
    loaderFile.load(url, (arrbuff) => {
      resolve(arrbuff)
    }, (v) => {
      let manager = LoadingManager
      if (manager.onURL) {
        manager.onURL(url, v.loaded / v.total)
      }
    })
  })
}

let provideArrayBuffer = async (url, store) => {
  let NS = 'array-buffer-@' + url
  try {
    var value = await store.getItem(NS);
    if (!value) {
      let arrayBuffer = await loadArrayBuffer(url)
      value = arrayBuffer
      await store.setItem(NS, arrayBuffer)
    }
    // console.log(value)
    return value
  } catch (err) {
    console.log(err)
    await store.removeItem(NS)
  }
}

let loaderModel = new GLTFLoader(LoadingManager)
loaderModel.setDRACOLoader(dracoLoader)

let modelParser = (arrBuff) => {
  return new Promise((resolve) => {
    loaderModel.parse(arrBuff, '/', (parsed) => {
      // console.log(parsed)
      resolve(parsed)
    })
  })
}
var store = localforage.createInstance({
  name: 'localGLB'
});

var storeJSON = localforage.createInstance({
  name: 'localGLTF-JSON'
});

export let provideJSON = async (url, storeJSON) => {
  let NS = 'JSON-STORE-@' + url
  try {
    var value = await storeJSON.getItem(NS);
    if (!value) {
      let json = await makeJSON(url)
      value = json
      await storeJSON.setItem(NS, json)
    }
    // console.log(value)
    return value
  } catch (err) {
    console.log(err)
    await storeJSON.removeItem(NS)
  }
}

export const loadGLTF = async (url) => {
  LoadingManager.value += 0.9999
  let mocked = await getProcGLTF(url)
  await sleep()
  let parsed = await modelParser(JSON.stringify(mocked))
  await sleep()
  LoadingManager.value -= 0.9999
  return parsed
}

let exporter = new GLTFExporter()

export const makeJSON = async (url) => {
  let gltf = await loadGLTFViaArrayBuffer(url)
  return new Promise((resolve) => {
    exporter.parse(gltf.scene, (json) => {
      resolve(json)
    }, { binary: false, animations: gltf.animations })
  })
}

export const getProcGLTF = async (url) => {
  // return await makeJSON(url)
  let json = await provideJSON(url, storeJSON)
  return json
}

export const loadGLTFViaArrayBuffer = async (url) => {
  let arrayBuffer = await provideArrayBuffer(url, store)
  await rafSleep()

  let gltfobj = await modelParser(arrayBuffer)
  await rafSleep()

  return gltfobj
}

// export class StoreGLTFLoader {
//   load (url, resolve) {
//     loadGLTF(url)
//       .then((gltf) => {
//         resolve(gltf)
//       })
//   }
// }
