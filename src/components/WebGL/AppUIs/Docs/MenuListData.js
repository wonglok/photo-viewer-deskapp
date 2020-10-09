export const MenuDocsData = [
  // {
  //   type: 'router',
  //   name: '關於樂透了',
  //   path: '/about',
  //   component: () => import('../Landing/LandingPage.vue')
  // },

  // {
  //   type: 'router',
  //   name: 'Quick Start',
  //   path: '/docs/quick-start',
  //   component: () => import('../DocsContent/QuickStart.vue')
  // },
  // {
  //   type: 'router',
  //   name: 'Overview',
  //   path: '/docs/overview',
  //   component: () => import('../DocsContent/Overview.vue')
  // },
  // {
  //   type: 'router',
  //   name: 'Code Walkthrouh',
  //   path: '/docs/code-walkthrough',
  //   component: () => import('../DocsContent/CodeStructure.vue')
  // },
  // {
  //   type: 'router',
  //   name: 'Virtual Room',
  //   path: '/docs/event-space',
  //   component: () => import('../EventSpace/EventSpace.vue')
  // },
  {
    type: 'router',
    name: '虛擬世界',
    path: '/',
    component: () => import('../EventSpaceV2/EventSpaceV2.vue')
  },
  {
    type: 'router',
    name: '找動作',
    path: '/find-actions',
    component: () => import('../EventSpaceV2/MoveChooser.vue')
  }
]

export const MenuListData = [
  ...MenuDocsData
]
