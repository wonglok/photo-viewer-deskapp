const WorkerPlugin = require('worker-plugin')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [new WorkerPlugin()]
  },
  electronBuilder: {
    builderOptions: {
      publish: ['github']
    }
  }
}
