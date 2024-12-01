import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home/index.vue'
import NotFound from '@/views/404/index.vue'
import subRoutes from './modules'

let routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: Home,
        meta: { title: '首页' }
      }, {
        path: 'agent',
        component: () => import('@/views/agent/index.vue'),
        meta: { title: '代理' }
      }, {
        path: 'chat',
        component: () => import('@/views/chat/index.vue'),
        meta: { title: '聊天' }
      }, {
        path: 'info',
        component: () => import('@/views/info/index.vue'),
        meta: { title: '信息' }
      },
      ...subRoutes
    ]
  }, {
    path: '/404',
    component: NotFound,
    meta: { title: '404' }
  }, {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0, behavior: 'instant' }),
})

import { siteTitle } from '@/config'

router.beforeEach((to) => {
  if (to.meta.title) document.title = to.meta.title + ' | ' + siteTitle
})

export default router