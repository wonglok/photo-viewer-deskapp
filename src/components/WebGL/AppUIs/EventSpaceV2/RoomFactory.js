
import { loadFBX } from '../../Core/loadFBX'
import { loadTexture } from '../../Core/loadTexture'
import { MatCapService } from '../../Packages/MatCaps/MatCapService'
import { MeshMatcapMaterial, DoubleSide, RepeatWrapping, Vector2 } from 'three'

export class RoomFactory {
  constructor ({ addMesh, o3d, ctx }) {
    this.addMesh = addMesh
    this.ctx = ctx
    this.o3d = o3d
    this.birthPlace = [126.0895767211914, 25, 364.65924072265625 + 220]
    this.matcaps = MatCapService
    this.done = this.setup()
  }
  async waitForSetup () {
    return this.done
  }
  async setup () {
    let { addMesh } = this
    let fbx = await loadFBX(require('file-loader!./room/factory-simple-fbx.fbx'))

    let silver = await loadTexture(require('./matcap/silver.png'))
    let silverMatCap = new MeshMatcapMaterial({ matcap: silver, side: DoubleSide })
    let metalFloor = await loadTexture(require('./texture/metal-floor.jpg'))

    let bluePipe = await loadTexture(require('./matcap/bluePipe.png'))
    let bluePipeMatCap = new MeshMatcapMaterial({ matcap: bluePipe, side: DoubleSide })

    let metalicGold = await loadTexture(require('./matcap/metalicGold.png'))
    let metalicGoldMatCap = new MeshMatcapMaterial({ matcap: metalicGold, side: DoubleSide })

    let rootScale = 1
    this.o3d.add(fbx)

    fbx.traverse((item) => {
      if (item.isMesh) {
        // if (process.env.NODE_ENV === 'development') {
        //   if (this.ctx && this.ctx.rayplay) {
        //     this.ctx.rayplay.add(item, () => {
        //       console.log(item.name)
        //     })
        //   }
        // }

        addMesh({ mesh: item, rootScale, mass: 0 })

        if (item.name === 'Plane') {
          item.material = silverMatCap.clone()
          item.material.map = metalFloor
          metalFloor.wrapS = RepeatWrapping
          metalFloor.wrapT = RepeatWrapping
          metalFloor.repeat = new Vector2(300, 300)
        } else if (item.name === 'Cylinder002' || item.name === 'Cylinder024') {
          item.material = bluePipeMatCap
        } else if (item.name === 'Cylinder023') {
          item.material = metalicGoldMatCap
        } else {
          item.material = silverMatCap.clone()
        }
      }
    })
  }
}
