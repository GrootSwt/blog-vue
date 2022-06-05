import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../components/Layout'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home')
      },
      {
        path: '/:project',
        name: 'project',
        component: () => import('../views/Project')
      }
      // {
      //   path: '/java',
      //   name: 'Java',
      //   component: () => import('../views/Java')
      // },
      // {
      //   path: '/spring',
      //   name: 'Spring',
      //   component: () => import('../views/Spring')
      // },
      // {
      //   path: '/html',
      //   name: 'HTML',
      //   component: () => import('../views/HTML')
      // },
      // {
      //   path: '/css',
      //   name: 'CSS',
      //   component: () => import('../views/CSS')
      // },
      // {
      //   path: '/java-script',
      //   name: 'JavaScript',
      //   component: () => import('../views/JavaScript')
      // },
      // {
      //   path: '/type-script',
      //   name: 'TypeScript',
      //   component: () => import('../views/TypeScript')
      // },
      // {
      //   path: '/vue',
      //   name: 'VUE',
      //   component: () => import('../views/VUE')
      // },
      // {
      //   path: '/react',
      //   name: 'React',
      //   component: () => import('../views/React')
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
