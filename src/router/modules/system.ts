import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'system',
  component: RouterView,
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/user.vue')
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role.vue')
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/system/menu.vue')
    },
    {
      path: 'permission',
      name: 'permission',
      component: () => import('@/views/system/permission.vue')
    }
  ]
}

export default routes
