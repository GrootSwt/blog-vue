import { createStore, Store, useStore } from 'vuex'
import { getRouteTree, IBlogRoute } from '../api/blogRoute'

export interface IState {
  routeTree: Array<IBlogRoute>;
}

export default createStore<IState>({
  state: {
    routeTree: []
  },
  mutations: {
    setRouteTree(state, routeTree) {
      state.routeTree = routeTree
    }
  },
  actions: {
    async getRouteTree({ commit }) {
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

export function useAppStore(): Store<IState> {
  return useStore()
}