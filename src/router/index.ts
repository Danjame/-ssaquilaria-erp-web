import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/index.vue'
import sysRoutes from './modules/system'
import orgRoutes from './modules/organization'
import invRoutes from './modules/inventory'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
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
    component: () => import('../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
