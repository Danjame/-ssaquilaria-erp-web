import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/inventory',
  component: RouterView,
  children: [
    {
      path: '',
      name: 'inventory',
      component: () => import('@/views/inventory/index.vue')
    },
    {
      path: '/inventory/product',
      name: 'product',
      component: () => import('@/views/inventory/product.vue')
    }
  ]
}

export default routes
