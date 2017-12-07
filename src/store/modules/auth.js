
import firebase from 'firebase'

const auth = {
  state: {
    user: undefined,
    signedIn: false,
    usersRef: {},
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data
    },
    SET_SIGNED_IN(state, data) {
      state.signedIn = data
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
    setSignedIn({ dispatch, commit }, data) {
      commit('SET_SIGNED_IN', data)
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
    signedIn: state => state.signedIn,
  }
}

export default auth
