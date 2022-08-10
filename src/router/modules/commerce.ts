import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'commerce',
  component: RouterView,
  meta: { title: '订单管理' },
  children: [
    {
      path: 'purchase',
      name: 'purchase',
      component: () => import('@/views/commerce/purchase/index.vue'),
      meta: { title: '采购' }
    },
    {
      path: 'sale',
      name: 'sale',
      component: () => import('@/views/commerce/sale/index.vue'),
      meta: { title: '销售' }
    },
    {
      path: 'commodity',
      name: 'commodity',
      component: () => import('@/views/commerce/commodity/index.vue'),
      meta: { title: '商品' }
    },
    {
      path: 'client',
      name: 'client',
      component: () => import('@/views/commerce/client/index.vue'),
      meta: { title: '客户' }
    },
    {
      path: 'supplier',
      name: 'supplier',
      component: () => import('@/views/commerce/supplier/index.vue'),
      meta: { title: '供应商' }
    }
  ]
}

export default routes
