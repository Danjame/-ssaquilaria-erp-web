import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'subscription',
  component: RouterView,
  meta: { title: '认购' },
  children: [
    {
      path: 'contract',
      name: 'contract',
      component: () => import('@/views/subscription/contract/index.vue'),
      meta: { title: '协议' }
    }
  ]
}

export default routes
