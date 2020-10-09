import * as PhysicsFactoryClass from './PhysicsAmmo'
// import * as Comlink from 'comlink'
import { BufferGeometry, Vector3 } from 'three'

export class PhysicsAmmoInterface {
  constructor ({ mode = 'auto', onLoop }) {
    this.mode = mode
    this.onLoop = onLoop
    this.done = this.run()
    this.updateMeshMap = new Map()
    this.bufferGeoCacheMap = new Map()
  }
  getObjectsMap () {
    return this.updateMeshMap
  }
  async waitForSetup () {
    return this.done
  }
  async run () {
    this.ammoWorld = await new PhysicsFactoryClass.AmmoWorld({ mode: this.mode, onLoop: this.onLoop })

    await this.ammoWorld.waitForSetup()

    this.subscribe((updateMap) => {
      this.updateMap = updateMap

      if (this.updateMap) {
        let ent = this.updateMap.entries()
        for (let [uuid, update] of ent) {
          let mesh = this.updateMeshMap.get(uuid)
          // console.log(update.position, update.quaternion)
          if (update && mesh) {
            mesh.position.copy(update.position)
            mesh.quaternion.copy(update.quaternion)
          }
          // console.log(update.position, update.quaternion)
        }
      }
    })

    // this.onLoop(() => {
    //   // this.ammoWorld.exec().then(v => {
    //   //   this.updateMap = v
    //   // })
    // })
    // window.addEventListener('focus', () => {
    //   this.ammoWorld.canRun = true
    // })
    // window.addEventListener('blur', () => {
    //   this.ammoWorld.canRun = false
    // })

  }

  set ready (v) {
    if (this.ammoWorld) {
      this.ammoWorld.ready = v
    } else {
      setTimeout(() => {
        this.ready = v
      }, 0)
    }
  }

  getDirect () {
    return this.ammoWorld
  }

  subscribe (v) {
    this.ammoWorld.subscribe(v)
  }

  addUpdateItem (mesh) {
    this.updateMeshMap.set(mesh.uuid, mesh)
  }

  addMesh ({ info, mesh, rootScale = 1, mass = 0.1 }) {
    this.updateMeshMap.set(mesh.uuid, mesh)

    let geometry = mesh.geometry

    if (!(geometry instanceof BufferGeometry)) {
      console.log(geometry)
      if (!this.bufferGeoCacheMap.has(mesh.geometry.uuid)) {
        geometry = new BufferGeometry().fromGeometry(geometry)
        this.bufferGeoCacheMap.set(mesh.geometry.uuid, geometry)
      } else {
        geometry = this.bufferGeoCacheMap.get(mesh.geometry.uuid)
      }
    }

    let attributes = geometry.attributes
    let position = attributes.position
    let array = position.array

    // console.log(mesh.uuid)
    let target = new Vector3()
    geometry.computeBoundingBox()
    geometry.boundingBox.getCenter(target)

    this.ammoWorld.addMesh({
      info,
      geoUUID: mesh.geometry.uuid,
      uuid: mesh.uuid,
      target: target.toArray(),
      position: mesh.position.toArray(),
      quaternion: mesh.quaternion.toArray(),
      matrixWorld: mesh.matrixWorld.toArray(),
      scale: mesh.scale.toArray(),
      rootScale,
      mass,
      array: array
    })
  }

  async close () {
    if (this.ammoWorld) {
      await this.ammoWorld.close()
    }
  }

}