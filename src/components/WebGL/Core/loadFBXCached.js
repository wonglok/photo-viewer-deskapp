import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ObjectLoader, AnimationClip } from 'three'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FileLoader } from 'three'
import { LoadingManager } from './LoadingManager'
// import processFBX from 'comlink-loader!./processFBX.worker'
import localforage from 'localforage'

export const sleep = (t) => new Promise((resolve) => { setTimeout(resolve, t) })
//
// let localforage = require('localforage')
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

let loaderModel = new FBXLoader(LoadingManager)

let modelParser = (blobURL) => {
  return new Promise((resolve) => {
    loaderModel.load(blobURL, (stuff) => {
      resolve(stuff)
    })
  })
}

let getBlobFromArrayBuffer = async (arrBuff) => {
  let blob = new Blob([arrBuff], { type: 'application/octet-stream' })
  let url = URL.createObjectURL(blob)
  return url
}

var store = localforage.createInstance({
  name: 'localFBX'
});

// let workers = [
//   new processFBX(),
//   new processFBX()
// ]

// let i = 0
// let newOBJ = new ObjectLoader()
// export const loadFBXWorker = async (url) => {
//   let worker = workers[i % workers.length]
//   i++

//   let mockedFBX = await worker.getProcFBX(url)
//   await sleep()
//   let parsed = newOBJ.parse(mockedFBX)
//   await sleep()

//   return parsed
// }

// export const loadFBXURL = async (url) => {
//   let worker = workers[i % workers.length]
//   i++
//   let bloblURL = await worker.getURL(url)
//   let gltfobj = await modelParser(bloblURL)
//   return gltfobj
// }

export const loadFBXMAIN = async (url) => {
  let arrayBuffer = await provideArrayBuffer(url, store)
  // await rafSleep()
  let bloblURL = await getBlobFromArrayBuffer(arrayBuffer)
  // await rafSleep()
  let gltfobj = await modelParser(bloblURL)
  // await rafSleep()

  return gltfobj
}

let newOBJ = new ObjectLoader()

export const loadFBXCached = async (url) => {
  let mockedFBX = await getProcFBX(url)
  await sleep()
  let parsed = newOBJ.parse(mockedFBX)
  await sleep()

  return parsed
}

// export class StoreFBXLoader {
//   load(url, resolve) {
//     loadFBX(url)
//       .then((gltf) => {
//         resolve(gltf)
//       })
//   }
// }


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