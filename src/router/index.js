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
      },
      {
        path: '/java-script',
        name: 'JavaScript',
        component: () => import('../views/JavaScript')
      },
      {
        path: '/spring',
        name: 'Spring',
        component: () => import('../views/Spring')
      },
      {
        path: '/html',
        name: 'HTML',
        component: () => import('../views/HTML')
      },
      {
        path: '/css',
        name: 'CSS',
        component: () => import('../views/CSS')
      },
      {
        path: '/vue',
        name: 'VUE',
        component: () => import('../views/VUE')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
