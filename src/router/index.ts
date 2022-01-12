import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/index.vue')
      }
    ]
  }
  // {
  //   path: '/login',
  //   component: () => import('../views/login/index.vue')
  // }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: NotFound,
  //   meta: { requiresAuth: false }
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
