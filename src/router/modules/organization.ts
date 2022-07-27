import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'organization',
  component: RouterView,
  meta: { title: '组织管理' },
  children: [
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/organization/department/index.vue'),
      meta: { title: '部门' }
    }
  ]
}

export default routes
