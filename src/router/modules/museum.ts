import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'museum',
  component: RouterView,
  meta: { title: '博物馆' },
  children: [
    {
      path: 'visit',
      name: 'visit',
      component: () => import('@/views/museum/visit/index.vue'),
      meta: { title: '参观预约' }
    }
  ]
}

export default routes
