import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/index.vue'
import sysRoutes from './modules/system'
import orgRoutes from './modules/organization'
import invRoutes from './modules/inventory'
import frstRoutes from './modules/forest'
import commRoutes from './modules/commerce'
import fileRoutes from './modules/file'
import nursRoutes from './modules/nursery'
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
        component: () => import('../views/about/index.vue'),
        meta: { title: '关于' }
      },
      sysRoutes,
      orgRoutes,
      invRoutes,
      frstRoutes,
      fileRoutes,
      commRoutes,
      nursRoutes
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async to => {
  document.title = to.meta.title + ' - ' + import.meta.env.VITE_APP_TITLE
  if (to.name === 'login') {
    // 登录页
    if (store.state.user && store.state.user.status) {
      return {
        path: '/'
      }
    }
  } else {
    // 非登录页
    // 路由与菜单匹配
    const menus = await store.dispatch('loadMenus')
    if (!isMenuMatched(menus, to.name as string)) return false

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
