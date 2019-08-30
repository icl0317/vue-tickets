import Vue from 'vue'
import axios from 'axios'
import store from '@/store/index'
import { Toast } from 'mint-ui'
import Cookies from 'js-cookie'

const http = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000 // 请求超时时间
})

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 全局发送token
    let getPiaoToken = store.state.user.mpp_token
    if (getPiaoToken) {
      config.headers['X-Token'] = getPiaoToken
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 全局验证token错误
    if (response.data.code === 20003) {
      Toast(response.data.msg)
      Cookies.remove('mpp_token', { path: '' })
      store.state.user.mpp_token = ''
    }
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
Vue.prototype.$axios = axios // 暴露给全局
export const Post = (url, params) => http.post(url, params)
export const Get = (url, params) => http.get(url, { params })
