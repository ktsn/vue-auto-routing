function Foo() {
  return import(/* webpackChunkName: "foo" */ '@/pages/foo.vue')
}
function Id() {
  return import(/* webpackChunkName: "id" */ '@/pages/_id.vue')
}

export default [
  {
    name: 'foo',
    path: '/foo',
    component: Foo
  },
  {
    name: 'id',
    path: '/:id?',
    component: Id
  }
]
