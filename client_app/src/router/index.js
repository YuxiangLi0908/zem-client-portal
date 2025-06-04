import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'
import UserDashboard from '../views/UserDashboard.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['Login']
  const authRequired = !publicPages.includes(to.name)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next({ name: 'Login' })
  }

  next()
})

export default router