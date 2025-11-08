import { createWebHashHistory, createRouter } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/button',
    },
    {
      path: '/button',
      name: 'button',
      component: () => import('../pages/button/index.vue'),
    },
    {
      path: '/descriptions',
      name: 'descriptions',
      component: () => import('../pages/descriptions/index.vue'),
    },
    {
      path: '/markdown-preview',
      name: 'markdown-preview',
      component: () => import('../pages/markdown-preview/index.vue'),
    },
    {
      path: '/dialog',
      name: 'dialog',
      component: () => import('../pages/dialog/index.vue'),
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../pages/loading/index.vue'),
    },
    {
      path: '/drawer',
      name: 'drawer',
      component: () => import('../pages/drawer/index.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('../pages/form/index.vue'),
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../pages/menu/index.vue'),
    },
    {
      path: '/modal',
      name: 'modal',
      component: () => import('../pages/modal/index.vue'),
    },
  ],
})

function registerRouter(app) {
  app.use(router)
}

export default registerRouter
