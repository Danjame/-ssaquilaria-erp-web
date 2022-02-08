import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/index.vue'
import sysRoutes from './modules/system'
import orgRoutes from './modules/organization'
import invRoutes from './modules/inventory'
import { Menu } from '@/api/system/types/menu'
import store from '@/store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/about/index.vue')
      },
      sysRoutes,
      orgRoutes,
      invRoutes
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  // 登录页
  if (to.name === 'login') {
    if (store.state.user) {
      return {
        path: '/',
      }
    }
  } else {
    // 路由与菜单匹配
    if(!isMenuMatched(store.state.menus, to.name as string)) return false

    // 非登录页
    if (to.meta.requiresAuth && !store.state.user) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      }
    }
  }
})

const isMenuMatched = (menus: Menu[], route: string): boolean => {
  return menus.some(menu => menu.children && menu.children.length ? isMenuMatched(menu.children, route) : menu.name === route)
}

export default router
