import * as path from 'path'
import * as fs from 'fs'
import * as webpack from 'webpack'
import * as Plugin from '../src/webpack-plugin'

const resolve = (p: string) => path.resolve(__dirname, p)

const compiler = (plugin: Plugin): webpack.Compiler => {
  return webpack({
    mode: 'none',
    entry: resolve('./fixtures/fake-router.js'),
    output: {
      path: resolve('./fixtures/out'),
      filename: 'main.js'
    },
    resolve: {
      alias: {
        '@': resolve('./fixtures/')
      }
    },
    plugins: [plugin]
  })
}

const matchOutputWithSnapshot = () => {
  const out = fs.readFileSync(resolve('./fixtures/out/main.js'), 'utf8')
  expect(out).toMatchSnapshot()
}

describe('webpack plugin', () => {
  beforeEach(() => {
    fs.unlinkSync(path.resolve(__dirname, '../index.js'))
  })

  it('imports dynamically created routes', done => {
    const plugin = new Plugin({
      pages: resolve('fixtures/pages')
    })

    compiler(plugin).run(() => {
      matchOutputWithSnapshot()
      done()
    })
  })
})
