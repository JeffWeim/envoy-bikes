
const home = {
  state: {
    dayData: [],
    key: '',
    daysRef: {}
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
  },
  getters: {
    dayData: state => state.dayData,
    key: state => state.key,
    daysRef: state => state.daysRef,
  }
}

export default home;
