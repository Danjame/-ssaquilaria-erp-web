import { createStore } from 'vuex'

const store = createStore({
  state: {
    isCollapse: false,
    accessToken: localStorage.getItem('accessToken') || '',
    user: null
  },
  getters: {},
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
    },
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
