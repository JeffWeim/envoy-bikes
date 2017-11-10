import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import home from './modules/home'
import auth from './modules/auth'

const store = new Vuex.Store({
  modules: {
    home,
    auth
  },
  // strict: process.env.NODE_ENV !== 'production'
})

export default store
