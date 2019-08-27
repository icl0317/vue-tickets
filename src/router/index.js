import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import { Toast } from 'mint-ui'

import filmList from '@/views/film/index'
import cityList from '@/views/film/city-list/city-list'
import cinemaList from '@/views/film/cinema-list/cinema-list'
import news from '@/views/find/news'
import newsDetail from '@/views/find/news-detail/detail'
import seat from '@/views/seat/seat'
import orderDetail from '@/views/order/detail/order-detail'
import my from '@/views/my/my'
import tickets from '@/views/my/tickets/tickets'
import login from '@/views/login'
import reg from '@/views/reg'
import p404 from '@/views/404'

Vue.use(Router)

const router = new Router({
  // mode: "history",
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'film-list',
      component: filmList,
      meta: {
        title: '电影',
        deepPath: 0
      }
    },
    {
      path: '/city-list',
      name: 'city-list',
      component: cityList,
      meta: {
        title: '城市列表',
        deepPath: 2
      }
    },
    {
      path: '/cinema-list',
      name: 'cinema-list',
      component: cinemaList,
      meta: {
        title: '影院',
        deepPath: 1
      }
    },
    {
      path: '/news',
      name: 'news',
      component: news,
      meta: {
        title: '发现',
        deepPath: 0
      }
    },
    {
      path: '/news/detail',
      name: 'detail',
      component: newsDetail,
      meta: {
        title: '发现详情',
        deepPath: 1
      }
    },
    {
      path: '/index/seat',
      name: 'seat',
      component: seat,
      meta: {
        title: '选择座位',
        deepPath: 1,
        needLogin: true
      }
    },
    {
      path: '/order/detail',
      name: 'order-detail',
      component: orderDetail,
      meta: {
        title: '电影票详情',
        deepPath: 2,
        needLogin: true
      }
    },
    {
      path: '/my',
      name: 'my',
      component: my,
      meta: {
        title: '我的',
        deepPath: 0
      }
    },
    {
      path: '/my/tickets',
      name: 'tickets',
      component: tickets,
      meta: {
        deepPath: 1,
        title: '电影票',
        needLogin: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '登录',
        deepPath: 0
      }
    },
    {
      path: '/reg',
      name: 'reg',
      component: reg,
      meta: {
        title: '注册',
        deepPath: 1
      }
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      name: '404',
      title: '404',
      component: p404,
      meta: {
        title: '404',
        deepPath: 0
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return 0
  }
})

router.beforeEach((to, from, next) => {
  // 需要登录权限页面 并 没有token
  if (to.meta.needLogin && !store.state.user.mpp_token) {
    if (to.path === '/login') { // 如果是登录页面的话，直接next()
      next()
    } else { // 否则 跳转到登录页面
      Toast('请先登录')
      setTimeout(() => {
        next({
          path: '/login'
        })
      }, 2000)
    }
    return
  }
  next()
})

export default router
