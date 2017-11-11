
const home = {
  state: {
    dayData: [],
    key: '',
    daysRef: {},
    today: '',
    previous: '',
  },
  mutations: {
    SET_DAY_DATA(state, data) {
      state.dayData = data
    },
    SET_KEY(state, data) {
      state.key = data
    },
    SET_DAYS_REFERENCE(state, data) {
      state.daysRef = data
    },
    SET_TODAY(state, data) {
      state.today = data
    },
    SET_PREVIOUS(state, data) {
      state.previous = data
    },
  },
  actions: {
    setDayData({ dispatch, commit }, data) {
      commit('SET_DAY_DATA', data)
    },
    setKey({ dispatch, commit }, data) {
      commit('SET_KEY', data)
    },
    setDaysReference({ dispatch, commit }, data) {
      commit('SET_DAYS_REFERENCE', data)
    },
    setToday({ dispatch, commit }, data) {
      commit('SET_TODAY', data)
    },
    setPrevious({ dispatch, commit }, data) {
      commit('SET_PREVIOUS', data)
    },
  },
  getters: {
    dayData: state => state.dayData,
    key: state => state.key,
    daysRef: state => state.daysRef,
    today: state => state.today,
    previous: state => state.previous,
  }
}

export default home;
