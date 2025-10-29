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
  ],
})

function registerRouter(app) {
  app.use(router)
}

export default registerRouter
