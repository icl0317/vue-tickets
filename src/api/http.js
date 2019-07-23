import Vue from 'vue'
import axios from "axios";
import store from "@/store/store"
import { Toast } from 'mint-ui'
import Cookies from 'js-cookie'

const http = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000 // 请求超时时间
});

// 添加请求拦截器
http.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    let getPiaoToken = store.state.piaoToken;
    if (getPiaoToken){
      config.headers['X-Token'] = getPiaoToken;
    }
    
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    if(response.data.code == 20003){
      Toast(response.data.msg);
      Cookies.remove('piao_token', { path: '' });
      store.state.piaoToken = '';
    }
    return response.data;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
Vue.prototype.$axios = axios;
export const Post = (url, params) => http.post(url, params);
export const Get = (url, params) => http.get(url, { params });
