
const auth = {
  state: {
    user: {},
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data
    },
  },
  actions: {
    setUser({ dispatch, commit }, data) {
      commit('SET_USER', data)
    },
  },
  getters: {
    user: state => state.user,
  }
}

export default auth
