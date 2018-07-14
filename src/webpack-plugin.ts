import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'
import { Compiler } from 'webpack'
import { generateRoutes, GenerateConfig } from 'vue-route-generator'

const pluginName = 'VueAutoRoutingPlugin'

interface Options extends GenerateConfig {}

namespace VueAutoRoutingPlugin {
  export type AutoRoutingOptions = Options
}

class VueAutoRoutingPlugin {
  constructor(private options: Options) {
    assert(options.pages, '`pages` is required')
  }

  apply(compiler: Compiler) {
    compiler.hooks.run.tap(pluginName, () => {
      const code = generateRoutes(this.options)
      const to = path.resolve(__dirname, '../index.js')
      fs.writeFileSync(to, code)
    })
  }
}

export = VueAutoRoutingPlugin
