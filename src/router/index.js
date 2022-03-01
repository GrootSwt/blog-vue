import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../components/Layout'),
    redirect: 'Home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home')
      },
      {
        path: '/java',
        name: 'Java',
        component: () => import('../views/Java')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
