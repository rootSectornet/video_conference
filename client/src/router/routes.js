export default [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/home'),
  },
  {
    path: '/room',
    name: 'room',
    component: () => import('./views/room'),
  },
  
]
