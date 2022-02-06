import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { CurrentUser } from '@/api/system/types/user'

const store = createStore({
  plugins: [createPersistedState()],
  state: {
    isCollapse: false,
    user: null as CurrentUser | null,
    isLoading: false
  },
  getters: {},
  mutations: {
    setCollapse (state, payload) {
      state.isCollapse = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.isLoading = payload
    }
  },
  actions: {},
  modules: {}
})

export default store
