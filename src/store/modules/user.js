import Cookies from 'js-cookie'
const state = {
  mpp_name: Cookies.get('mpp_name'),
  mpp_token: Cookies.get('mpp_token'),
  permission: [] // 权限
}
// computed
const getters = {

}
// methods
const mutations = {
  SET_TOKEN (state, token) {
    state.mpp_token = token
  },
  SET_NAME (state, username) {
    state.mpp_name = username
  },
  SET_PERMISSION (state) {

  }
}
// 调用
const actions = {
  login ({commit}, userInfo) {
    let { token, username } = userInfo
    // 问题？直接浏览器清cookie 不会跳出
    commit('SET_TOKEN', token)
    commit('SET_NAME', username)
    Cookies.set('mpp_token', token, { expires: 1 })
    Cookies.set('mpp_name', username, { expires: 1 })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
