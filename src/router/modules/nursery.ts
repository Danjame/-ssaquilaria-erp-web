import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'nursery',
  component: RouterView,
  meta: { title: '苗圃管理' },
  children: [
    {
      path: 'plant',
      name: 'plant',
      component: () => import('@/views/nursery/plant/index.vue'),
      meta: { title: '幼苗' }
    },
    {
      path: 'cultivation',
      name: 'cultivation',
      component: () => import('@/views/nursery/cultivation/index.vue'),
      meta: { title: '培育' }
    }
  ]
}

export default routes
