import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'system',
  component: RouterView,
  meta: { title: '系统' },
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/user/index.vue'),
      meta: { title: '用户' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role/index.vue'),
      meta: { title: '角色' }
    },
    {
      path: 'permission',
      name: 'permission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: { title: '权限' }
    }
  ]
}

export default routes
