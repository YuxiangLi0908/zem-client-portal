import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'
import SliderPage from '../components/Slider.vue'
import SearchPage from '../components/searchItem/Search.vue'
import UserDashboard from '../views/UserDashboard.vue'
import AllContainers from '../views/AllContainers.vue'
import ContactPage from '../views/Contact.vue'

const routes = [
  
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/slider', name: 'Slider', component: SliderPage },
  { path: '/search', name: 'Search', component: SearchPage },
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard},
  { path: '/all-containers', name: 'AllContainers', component: AllContainers},
  { path: '/contact', name: 'Contact', component: ContactPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const publicPages = ['Login', 'Home', 'Contact']
  const authRequired = !publicPages.includes(to.name)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next({ name: 'Login' })
  }

  next()
})

export default router