const WorkerPlugin = require('worker-plugin')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [new WorkerPlugin()]
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: ['github']
      }
    }
  }
}
