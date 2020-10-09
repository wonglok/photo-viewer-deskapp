import VueRouter from 'vue-router'
import { MenuDocsData } from './components/WebGL/AppUIs/Docs/MenuListData'

export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
  },
  {
    path: '/app',
    component: () => import('./components/WebGL/AppUIs/EventSpaceV2/EventSpaceV2.vue')
  },
  {
    path: '/dev',
    component: () => import('./components/WebGL/AppUIs/Docs/DocsLayout.vue'),
    // component: () => import('./components/WebGL/AppUIs/Docs/DocsLayout.vue'),
    children: [
      // {
      //   path: '',
      //   component: () => import('./components/WebGL/AppUIs/Landing/LandingPage.vue')
      // },
      // {
      //   path: 'quick-start',
      //   component: () => import('./components/WebGL/AppUIs/DocsContent/QuickStart.vue'),
      // },
      ...MenuDocsData
    ]
  },
  {
    path: '*',
    component: () => import('./components/WebGL/AppUIs/Shared/E404.vue')
  }
]

export const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior (to, from, savedPos) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPos) {
          resolve(savedPos)
        } else {
          resolve({ x: 0, y: 0 })
        }
      }, 1)
    })
  }
})
