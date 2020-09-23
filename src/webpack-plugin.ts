import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'
import { Compiler } from 'webpack'
import { generateRoutes, GenerateConfig } from 'vue-route-generator'

const pluginName = 'VueAutoRoutingPlugin'

interface Options extends GenerateConfig {
  pageName?: string;
}

namespace VueAutoRoutingPlugin {
  export type AutoRoutingOptions = Options
}

class VueAutoRoutingPlugin {
  constructor(private options: Options | Options[]) {
    if (Array.isArray(options)) {
      options.forEach(option => {
        assert(option.pages, '`pages` is required');
      })
    } else {
      assert(options.pages, '`pages` is required');
    }
  }

  apply(compiler: Compiler) {
    const generate = (option: Options) => {
      const code = generateRoutes(option)
      let to;
      if (option.pageName) {
        to = path.resolve(__dirname, `../${option.pageName}.js`);
      } else {
        to = path.resolve(__dirname, '../index.js');
      }
      if (
        fs.existsSync(to) &&
        fs.readFileSync(to, 'utf8').trim() === code.trim()
      ) {
        return
      }
      if (!fs.existsSync(path.dirname(to))) {
        fs.mkdirSync(path.dirname(to))
      }
      fs.writeFileSync(to, code)
    }
    const generateIndex = (options: Options[]) => {
      let importCode = '', exportCode = '';
      options.forEach(option => {
        importCode += `import ${option.pageName} from './${option.pageName}';\n`
        exportCode += `${option.pageName},`
      })
      return `${importCode}export{${exportCode}}`
    }

    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      try {
        if (Object.prototype.toString.call(this.options) === '[object Object]') {
          generate(this.options as Options);
        } else if (Array.isArray(this.options)) {
          const isAvailable = this.options.every((value) => {
            return typeof value.pageName === 'string'
          })
          if (!isAvailable) {
            throw new Error('MPA router option need pageName')
          }
          this.options.forEach(option => {
            generate(option)
          })
          const indexPath = path.resolve(__dirname, '../index.js');
          const code = generateIndex(this.options)
          if (fs.existsSync(indexPath) &&
            fs.readFileSync(indexPath, 'utf8').trim() === code.trim()) {
            return;
          }
          if (!fs.existsSync(path.dirname(indexPath))) {
            fs.mkdirSync(path.dirname(indexPath))
          }
          fs.writeFileSync(indexPath, code);
        } else {
          throw new Error('options must be an object or an array')
        }
      } catch (error) {
        compilation.errors.push(error)
      }
    })
  }
}

export = VueAutoRoutingPlugin
