import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'manufacture',
  component: RouterView,
  meta: { title: '生产管理' },
  children: [
    {
      path: 'product',
      name: 'product',
      component: () => import('@/views/manufacture/product/index.vue'),
      meta: { title: '产品' }
    },
    {
      path: 'material',
      name: 'material',
      component: () => import('@/views/manufacture/material/index.vue'),
      meta: { title: '原料' }
    },
    {
      path: 'sapling',
      name: 'sapling',
      component: () => import('@/views/manufacture/sapling/index.vue'),
      meta: { title: '苗木' }
    },
    {
      path: 'movement',
      name: 'movement',
      component: () => import('@/views/manufacture/movement/index.vue'),
      meta: { title: '出入库' }
    },
    {
      path: 'category',
      name: 'category',
      component: () => import('@/views/manufacture/category/index.vue'),
      meta: { title: '产品类别' }
    },
    {
      path: 'rank',
      name: 'rank',
      component: () => import('@/views/manufacture/rank/index.vue'),
      meta: { title: '原料级别' }
    },
    {
      path: 'unit',
      name: 'unit',
      component: () => import('@/views/manufacture/unit/index.vue'),
      meta: { title: '单位' }
    }
  ]
}

export default routes
