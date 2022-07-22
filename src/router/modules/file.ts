import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'file',
  component: RouterView,
  meta: { title: '文件' },
  children: [
    {
      path: 'apk',
      name: 'apk',
      component: () => import('@/views/file/apk/index.vue'),
      meta: { title: '终端版本' }
    }
  ]
}

export default routes
