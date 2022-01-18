import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'inventory',
  component: RouterView,
  children: [
    {
      path: 'product',
      name: 'product',
      component: () => import('@/views/inventory/product.vue')
    },
    {
      path: 'sale',
      name: 'sale',
      component: () => import('@/views/inventory/sale.vue')
    },
    {
      path: 'purchase',
      name: 'purchase',
      component: () => import('@/views/inventory/purchase.vue')
    }
  ]
}

export default routes
