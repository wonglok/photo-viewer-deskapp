import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FileLoader, AnimationClip } from 'three'
// import { LoadingManager } from './LoadingManager'

export const sleep = (t = 0) => new Promise((resolve) => { setTimeout(resolve, t) })

let localforage = require('localforage')
export let loadArrayBuffer = async (url) => {
  return new Promise((resolve) => {
    let loaderFile = new FileLoader()
    loaderFile.setResponseType('arraybuffer')
    loaderFile.load(url, (arrbuff) => {
      resolve(arrbuff)
    }, (v) => {
      console.log(v)
    })
  })
}

export let provideArrayBuffer = async (url, store) => {
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

let loaderModel = new FBXLoader()

export let modelParser = (blobURL) => {
  return new Promise((resolve) => {
    loaderModel.load(blobURL, (stuff) => {
      resolve(stuff)
    })
  })
}

export let getBlobFromArrayBuffer = async (arrBuff) => {
  let blob = new Blob([arrBuff], { type: 'application/octet-stream' })
  let url = URL.createObjectURL(blob)
  return url
}

var store = localforage.createInstance({
  name: 'localFBX'
});


var storeJSON = localforage.createInstance({
  name: 'localFBXJSON'
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

export const getProcFBX = async (url) => {
  let json = await provideJSON(url, storeJSON)
  return json
}

export const makeJSON = async (url) => {
  let arrayBuffer = await provideArrayBuffer(url, store)
  await sleep()
  let bloblURL = await getBlobFromArrayBuffer(arrayBuffer)
  await sleep()

  let gltfobj = await modelParser(bloblURL)
  await sleep()

  if (gltfobj.animations && gltfobj.animations.length > 0) {
    let json = gltfobj.toJSON()

    json.animations = gltfobj.animations.map(i => {
      return AnimationClip.toJSON(i)
    })

    return json
  } else {
    let json = gltfobj.toJSON()

    return json
  }
}

export const loadFBX = async (url) => {
  let arrayBuffer = await provideArrayBuffer(url, store)
  // await rafSleep()
  let bloblURL = await getBlobFromArrayBuffer(arrayBuffer)
  // await rafSleep()
  let gltfobj = await modelParser(bloblURL)
  // await rafSleep()

  return gltfobj.toJSON()
}

export class StoreFBXLoader {
  load(url, resolve) {
    loadFBX(url)
      .then((gltf) => {
        resolve(gltf)
      })
  }
}
