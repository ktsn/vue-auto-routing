import * as path from 'path'
import * as fse from 'fs-extra'
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
  const out = fse.readFileSync(resolve('./fixtures/out/main.js'), 'utf8')
  expect(out).toMatchSnapshot()
}

const addPage = (p: string) => {
  const to = resolve(path.join('fixtures/pages', p))
  fse.outputFileSync(to, '')
}

const removePage = (p: string) => {
  const to = resolve(path.join('fixtures/pages', p))
  fse.unlinkSync(to)
}

describe('webpack plugin', () => {
  beforeEach(() => {
    fse.removeSync(resolve('../index.js'))

    // reset pages
    fse.removeSync(resolve('fixtures/pages'))
    addPage('index.vue')
    addPage('users/foo.vue')
    addPage('users/_id.vue')
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

  it('watches adding a page', done => {
    const plugin = new Plugin({
      pages: resolve('fixtures/pages')
    })

    let count = 0
    const watching = compiler(plugin).watch({}, () => {
      count++
      switch (count) {
        case 1:
          addPage('users.vue')
          break
        default:
          matchOutputWithSnapshot()
          watching.close(done)
      }
    })
  })

  it('watches removing a page', done => {
    const plugin = new Plugin({
      pages: resolve('fixtures/pages')
    })

    let count = 0
    const watching = compiler(plugin).watch({}, () => {
      count++
      switch (count) {
        case 1:
          removePage('users/foo.vue')
          break
        default:
          matchOutputWithSnapshot()
          watching.close(done)
      }
    })
  })

  it('does not fire compilation when the route does not changed', done => {
    const plugin = new Plugin({
      pages: resolve('fixtures/pages')
    })

    let count = 0
    const watching = compiler(plugin).watch({}, () => {
      count++
      switch (count) {
        case 3:
          fail('webpack watcher seems to go infinite loop')
          done()
          break
        default:
      }
    })

    setTimeout(() => {
      watching.close(done)
    }, 1000)
  })
})
