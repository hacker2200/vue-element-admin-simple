import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
const _import = require('@/router/_import_compoent')

export function filterAsyncRouters(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        router.component = _import(router.component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouters(router.children)
    }
    return true
  })
  return accessedRouters
}

const state = {
  routes: [],
  buttons: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRoutes({ commit }, { routers, buttons }) {
    return new Promise(resolve => {
      const accessedRouters = filterAsyncRouters(routers).concat(errorRoutes)
      commit('SET_ROUTERS', accessedRouters)
      commit('SET_BUTTONS', buttons)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
