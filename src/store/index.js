import { createStore } from 'vuex'
import { getRouteTree } from '@/api/blogRoute'

export default createStore({
  state: {
    routeTree: []
  },
  mutations: {
    setRouteTree (state, routeTree) {
      state.routeTree = routeTree
    }
  },
  actions: {
    async getRouteTree ({ commit }) {
      const res = await getRouteTree()
      if (res.status === 'success') {
        commit('setRouteTree', res.data)
      } else {
        throw new Error(res.message)
      }
    }
  },
  modules: {
  }
})
