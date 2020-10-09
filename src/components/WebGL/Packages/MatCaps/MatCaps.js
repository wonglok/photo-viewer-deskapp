import matcaps from './matcaps/png'
import { loadTexture, loadBlobURL } from '../../Core/loadTexture'
import { DefaultLoadingManager, MeshMatcapMaterial } from 'three'
import { EnvMapMatCapMaterial } from './EnvMapMatCapMaterial'


export class MatCaps {
  constructor () {
    this.raw = matcaps
    this.list = []
    this.urls = []
    for (let kn in matcaps) {
      let entry = {
        key: kn,
        cached: false,
        url: matcaps[kn],
        blob: matcaps[kn]
      }
      this.list.push(entry)
      this.urls.push(matcaps[kn])
    }
  }
  getPagedList (perPage, pageAt) {
    return this.list.slice(perPage * pageAt, perPage)
  }
  preloadAll () {
    DefaultLoadingManager.stats.itemsTotal += this.list.length
    return Promise.all(this.list.map(e => {
      return loadBlobURL(e.url)
        .then(b => {
          e.blob = b
          e.cached = true
          DefaultLoadingManager.stats.itemsLoaded++
          return e
        })
    }))
  }
  async getRandom () {
    let url = this.urls[Math.floor(this.urls.length * Math.random())]
    return await this.loadMatCap(url)
  }
  async loadMatCap (url) {
    let res = await loadTexture(url)
    // return new EnvMapMatCapMaterial({ matcap: res })
    return new MeshMatcapMaterial({ matcap: res })
  }
  async loadMatCapEnvMap (url) {
    let res = await loadTexture(url)
    return new EnvMapMatCapMaterial({ matcap: res })
    // return new MeshMatcapMaterial({ matcap: res })
  }
  async loadTexture (url) {
    let res = await loadTexture(url)
    return res
  }
  async loadImage (url) {
    let res = await loadTexture(url)
    return res.image
  }
}
