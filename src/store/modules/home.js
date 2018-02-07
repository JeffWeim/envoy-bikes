import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyBjWk3yrbx8H0vKuRm_lbMseFp8ZwqKsjo',
  authDomain: 'envoy-bikes.firebaseapp.com',
  databaseURL: 'https://envoy-bikes.firebaseio.com',
  projectId: 'envoy-bikes',
  storageBucket: 'envoy-bikes.appspot.com',
  messagingSenderId: '411868926692'
}

let app = firebase.initializeApp(config)
let db = app.database()
let daysRef = db.ref('days')

const home = {
  state: {
    dayData: [],
    key: '',
    daysRef: daysRef,
    today: '',
    todayString: '',
    navMenu: false
  },
  mutations: {
    SET_DAY_DATA(state, data) {
      state.dayData = data
    },
    SET_KEY(state, data) {
      state.key = data
    },
    SET_TODAY(state, data) {
      state.today = data
    },
    SET_TODAY_STRING(state, data) {
      state.todayString = data
    },
    SET_NAV_MENU(state, data) {
      state.navMenu = data
    }
  },
  actions: {
    setDayData({ dispatch, commit }, data) {
      commit('SET_DAY_DATA', data)
    },
    setKey({ dispatch, commit }, data) {
      commit('SET_KEY', data)
    },
    setToday({ dispatch, commit }, data) {
      commit('SET_TODAY', data)
    },
    setTodayString({ dispatch, commit }, data) {
      commit('SET_TODAY_STRING', data)
    },
    setNavMenu({ dispatch, commit }, data) {
      commit('SET_NAV_MENU', data)
    }
  },
  getters: {
    dayData: state => state.dayData,
    key: state => state.key,
    daysRef: state => state.daysRef,
    today: state => state.today,
    todayString: state => state.todayString,
    navMenu: state => state.navMenu
  }
}

export default home
