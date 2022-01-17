import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'system',
  component: RouterView,
  children: [
    {
      path: '',
      name: 'system',
      component: () => import('@/views/system/index.vue')
    }
  ]
}

export default routes
