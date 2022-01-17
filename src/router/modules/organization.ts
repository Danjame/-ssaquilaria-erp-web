import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'organization',
  component: RouterView,
  children: [
    {
      path: '',
      name: 'organization',
      component: () => import('@/views/organization/index.vue')
    }
  ]
}

export default routes
