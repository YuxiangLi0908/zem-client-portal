import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'
import SliderPage from '../components/Slider.vue'
import SearchPage from '@/components/SearchItem/Search.vue'
import UserDashboard from '../views/UserDashboard.vue'

const routes = [
  
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/slider', name: 'Slider', component: SliderPage },
  { path: '/search', name: 'Search', component: SearchPage },
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