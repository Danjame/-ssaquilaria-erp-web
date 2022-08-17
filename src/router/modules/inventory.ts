import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'inventory',
  component: RouterView,
  meta: { title: '库存管理' },
  children: [
    {
      path: 'product',
      name: 'product',
      component: () => import('@/views/inventory/product/index.vue'),
      meta: { title: '产品' }
    },
    {
      path: 'material',
      name: 'material',
      component: () => import('@/views/inventory/material/index.vue'),
      meta: { title: '原料' }
    },
    {
      path: 'seedling',
      name: 'seedling',
      component: () => import('@/views/inventory/seedling/index.vue'),
      meta: { title: '苗木' }
    },
    {
      path: 'transaction',
      name: 'transaction',
      component: () => import('@/views/inventory/transaction/index.vue'),
      meta: { title: '库存变动' }
    },
    {
      path: 'category',
      name: 'category',
      component: () => import('@/views/inventory/category/index.vue'),
      meta: { title: '产品类别' }
    },
    {
      path: 'rank',
      name: 'rank',
      component: () => import('@/views/inventory/rank/index.vue'),
      meta: { title: '原料级别' }
    },
    {
      path: 'unit',
      name: 'unit',
      component: () => import('@/views/inventory/unit/index.vue'),
      meta: { title: '单位' }
    }
  ]
}

export default routes
