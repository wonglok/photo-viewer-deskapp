
var path = require('path')
let exporter = {
}

async function importAll (r) {
  r.keys().forEach(key => {
    let filename = path.basename(key).replace('.png', '')
    exporter[filename] = r(key)
  })
  return exporter
}

// importAll(require.context('~/components/Pages', true, /\.vue$/, 'sync'), 'sync')
importAll(require.context('./', true, /\.png$/, 'sync'), 'sync')

export default exporter
