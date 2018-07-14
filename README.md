# vue-auto-routing

Generate Vue Router routing automatically.

## Installation

```bash
$ npm install -D vue-auto-routing
```

## Usage

vue-auto-routing resolves Vue Router routing automatically by using [vue-route-generator](https://github.com/ktsn/vue-route-generator). The routes are generated with the same rules with [Nuxt routing](https://nuxtjs.org/guide/routing).

To use this, you import `vue-auto-routing` and pass it into Vue Router constructor options.

```js
// Import generated routes
import routes from 'vue-auto-routing'

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // Pass the generated routes into the routes option
  routes
})
```

You also need to add a webpack plugin vue-auto-routing provides. The plugin options are the same as [vue-route-generator options](https://github.com/ktsn/vue-route-generator#references)

```js
// webpack.config.js

const VueAutoRoutingPlugin = require('vue-auto-routing/lib/webpack-plugin')

module.exports = {
  // ... other options ...

  plugins: [
    new VueAutoRoutingPlugin({
      // Path to the directory that contains your page components.
      pages: 'src/pages',

      // A string that will be added to importing component path (default @/pages/).
      importPrefix: '@/pages/'
    })
  ]
}
```

## License

MIT
