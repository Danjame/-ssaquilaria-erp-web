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
      meta: { title: '库存' }
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
    },
    {
      path: 'supplier',
      name: 'supplier',
      component: () => import('@/views/inventory/supplier/index.vue'),
      meta: { title: '供应商' }
    },
    {
      path: 'category',
      name: 'category',
      component: () => import('@/views/inventory/category/index.vue'),
      meta: { title: '商品类别' }
    },
    {
      path: 'unit',
      name: 'unit',
      component: () => import('@/views/inventory/unit/index.vue'),
      meta: { title: '商品单位' }
    }
  ]
}

export default routes
