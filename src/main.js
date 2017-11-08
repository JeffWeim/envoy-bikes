import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import VueFire from 'vuefire'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  ...App
})

Vue.use(VueFire)
