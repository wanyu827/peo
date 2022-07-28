import { asyncRoutes, constantRoutes } from '@/router'
// vuex中的数据才能在组件中使用
const state = {
  routes: []
}
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.children[0].name))
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
