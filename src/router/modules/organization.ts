import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'organization',
  component: RouterView,
  children: [
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/organization/department.vue')
    }
  ]
}

export default routes
