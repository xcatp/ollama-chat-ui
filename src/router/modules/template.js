export default [
  {
    path: 'templates/prompt',
    component: () => import('@/views/template/prompt.vue'),
    meta: { title: 'prompt' }
  },
  {
    path: 'templates/persona',
    component: () => import('@/views/template/persona.vue'),
    meta: { title: 'persona' }
  }
]