import Vue from "vue";
import Router from "vue-router";
import App from "../App";
import store from "@/store/store"
import { Toast } from 'mint-ui';

import filmList from "@/views/film/index";
import cityList from "@/views/film/city-list/city-list";
import cinemaList from "@/views/film/cinema-list/cinema-list";
import news from "@/views/find/news";
import newsDetail from "@/views/find/news-detail/detail";
import seat from "@/views/seat/seat";
import orderDetail from "@/views/order/detail/order-detail";
import my from "@/views/my/my";
import tickets from "@/views/my/tickets/tickets";
import login from "@/views/login";
import reg from "@/views/reg";

Vue.use(Router);

const router = new Router({
  //mode: "history",
  routes: [
    {
      path: "/index",
      name: "film-list",
      title: "电影",
      component: filmList,
      meta: {
        deepPath: 0
      }
    },
    {
      path: "/city-list",
      title: "学校列表",
      name: "city-list",
      component: cityList,
      meta: {
        deepPath: 2
      }
    },
    {
      path: "/cinema-list",
      title: "影院列表",
      name: "cinema-list",
      component: cinemaList,
      meta: {
        deepPath: 1
      }
    },
    {
      path: "/news",
      title: "发现",
      name: "news",
      component: news,
      meta: {
        deepPath: 0
      }
    },
    {
      path: "/news/detail",
      title: "发现详情",
      name: "detail",
      component: newsDetail,
      meta: {
        deepPath: 1
      }
    },
    {
      path: "/index/seat",
      title: "座位图",
      name: "seat",
      component: seat,
      meta: {
        deepPath: 1,
        needLogin:true
      }
    },
    {
      path: "/order/detail",
      title: "订单详情",
      name: "order-detail",
      component: orderDetail,
      meta: {
        deepPath: 2
      }
    },
    {
      path: "/my",
      title: "我的",
      name: "my",
      component: my,
      meta: {
        deepPath: 0
      }
    },
    {
      path: "/my/tickets",
      title: "我的影票",
      name: "tickets",
      component: tickets,
      meta: {
        deepPath: 1
      }
    },
    {
      path: "/login",
      name: "login",
      title: "登录",
      component: login,
      meta: {
        deepPath: 0
      }
    },
    {
      path: "/reg",
      name: "reg",
      title: "注册",
      component: reg,
      meta: {
        deepPath: 1
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  //需要登录权限页面 并 没有token
  if(to.meta.needLogin && !store.state.piaoToken){
    if (to.path === '/login') { // 如果是登录页面的话，直接next()
      next();
    } else { // 否则 跳转到登录页面
      
      Toast('请先登录');
      setTimeout(() => {
        next({
          path: '/login'
        });
      }, 2000);
    }
    return;
  }
  next();
})

export default router;
