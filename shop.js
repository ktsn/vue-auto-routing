function Order() {
  return import(/* webpackChunkName: "order" */ '@/pages/order.vue')
}
function Product() {
  return import(/* webpackChunkName: "product" */ '@/pages/product.vue')
}

export default [
  {
    name: 'order',
    path: '/order',
    component: Order
  },
  {
    name: 'product',
    path: '/product',
    component: Product
  }
]
