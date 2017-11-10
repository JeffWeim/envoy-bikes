import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

Vue.use(Router)

const router = new Router({
  hashbang: false,
  linkActiveClass: 'active',
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/envoy-bikes',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/envoy-bikes/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '*',
      redirect: '/envoy-bikes'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched[0].meta.requiresAuth) {
    if (localStorage.getItem('token') === null) {
      next({
        path: '/envoy-bikes/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
