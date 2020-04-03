import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'
import { Compiler } from 'webpack'
import { generateRoutes } from 'vue-route-generator'

const pluginName = 'VueAutoRoutingPlugin'

interface Options {
  pages: string;
  pageName?: string;
  importPrefix?: string;
  dynamicImport?: boolean;
  chunkNamePrefix?: string;
  nested?: boolean;
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
          this.options.forEach(option => {
            generate(option)
          })
          const indexPath = path.resolve(__dirname, '../index.js');
          const code = generateIndex(this.options)
          if (fs.existsSync(indexPath) &&
            fs.readFileSync(indexPath, 'utf8').trim() === code.trim()) {
            return;
          }
          fs.writeFileSync(indexPath, code);
        } else {
          throw new Error('options type need object or array')
        }
      } catch (error) {
        compilation.errors.push(error)
      }
    })
  }
}

export = VueAutoRoutingPlugin
