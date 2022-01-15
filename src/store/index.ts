import { createStore } from 'vuex'

const store = createStore({
  state: {
    accessToken: localStorage.getItem('accessToken') || '',
    user: null
  },
  getters: {},
  mutations: {
    setAccessToken (state, payload) {
      state.accessToken = payload
      localStorage.setItem('accessToken', payload)
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {},
  modules: {}
})

export default store
