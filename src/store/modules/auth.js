
import firebase from 'firebase'

const auth = {
  state: {
    user: undefined,
    usersRef: {},
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data
    },
    GET_USER(state, data) {
      state.user = data
    },
    SET_USERS_REFERENCE(state, data) {
      state.usersRef = data
    },
  },
  actions: {
    setUser({ dispatch, commit }, data) {
      commit('SET_USER', data)
    },
    getUser({ dispatch, commit }, data) {
      let user = firebase.auth().currentUser;
      let name, email, photoUrl, uid

      if (user != null) {
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        uid = user.uid
      }
      commit('GET_USER', data)
    },
    setUsersReference({ dispatch, commit }, data) {
      commit('SET_USERS_REFERENCE', data)
    },
  },
  getters: {
    user: state => state.user,
    usersRef: state => state.usersRef,
  }
}

export default auth
