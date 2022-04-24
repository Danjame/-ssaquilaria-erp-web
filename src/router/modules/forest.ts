import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'forest',
  component: RouterView,
  meta: { title: '林木管理' },
  children: [
    {
      path: 'tree',
      name: 'tree',
      component: () => import('@/views/forest/tree/index.vue'),
      meta: { title: '树木' }
    },
    {
      path: 'task',
      name: 'task',
      component: () => import('@/views/forest/task/index.vue'),
      meta: { title: '工单' }
    },
    {
      path: 'farm',
      name: 'farm',
      component: () => import('@/views/forest/farm/index.vue'),
      meta: { title: '林场' }
    },
    {
      path: 'area',
      name: 'area',
      component: () => import('@/views/forest/area/index.vue'),
      meta: { title: '区域' }
    },
    {
      path: 'opertype',
      name: 'opertype',
      component: () => import('@/views/forest/opertype/index.vue'),
      meta: { title: '记录类' }
    },
    {
      path: 'operitem',
      name: 'operitem',
      component: () => import('@/views/forest/operitem/index.vue'),
      meta: { title: '记录项' }
    }
  ]
}

export default routes
