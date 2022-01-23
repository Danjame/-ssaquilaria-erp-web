import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'inventory',
  component: RouterView,
  meta: { title: '进销存' },
  children: [
    {
      path: 'product',
      name: 'product',
      component: () => import('@/views/inventory/product/index.vue'),
      meta: { title: '产品' }
    },
    {
      path: 'sale',
      name: 'sale',
      component: () => import('@/views/inventory/sale/index.vue'),
      meta: { title: '销售' }
    },
    {
      path: 'purchase',
      name: 'purchase',
      component: () => import('@/views/inventory/purchase/index.vue'),
      meta: { title: '采购' }
    }
  ]
}

export default routes
