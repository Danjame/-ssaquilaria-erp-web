import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { CurrentUser } from '@/api/system/types/user'

const store = createStore({
  plugins: [createPersistedState()],
  state: {
    isCollapse: false,
    user: null as CurrentUser | null
  },
  getters: {},
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {},
  modules: {}
})

export default store
