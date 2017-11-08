import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  hashbang: false,
  linkActiveClass: 'active',
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/views/Home.vue'], resolve),
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
