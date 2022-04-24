import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { CurrentUser } from '@/api/system/types/user'
import { Menu } from '@/api/system/types/menu'
import { getUserInfo } from '@/api/system/user'

const store = createStore({
  plugins: [createPersistedState({
    reducer (state) {
      return {
        isCollapse: state.isCollapse,
        user: state.user
      }
    }
  })],
  state: {
    isCollapse: false,
    user: null as CurrentUser | null,
    menus: [] as Menu[],
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
    setMenus (state, payload) {
      state.menus = payload
    },
    setLoading (state, payload) {
      state.isLoading = payload
    }
  },
  actions: {
    loadMenus ({ commit }) {
      return new Promise(resolve => {
        getUserInfo().then(({ menuTrees }) => {
          commit('setMenus', menuTrees)
          resolve(menuTrees)
        })
      })
    }
  },
  modules: {}
})

export default store
