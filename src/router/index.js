import Vue from "vue";
import Router from "vue-router";
import App from "../App";
import store from "@/store/store"
import filmList from "@/views/film/index";
import cityList from "@/views/film/city-list/city-list";
import cinemaList from "@/views/film/cinema-list/cinema-list";
import news from "@/views/find/news";
import newsDetail from "@/views/find/news-detail/detail";
import seat from "@/views/seat/seat";
import orderDetail from "@/views/order/detail/order-detail";
import my from "@/views/my/my";
import login from "@/views/login";

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
      path: "/order/detail/:id",
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
      path: "/login",
      name: "login",
      title: "登录",
      component: login,
      meta: {
        deepPath: 0
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(!store.state.piaoToken){
    if (to.path === '/login') { // 如果是登录页面的话，直接next()
      next();
    } else { // 否则 跳转到登录页面
      next({
        path: '/login'
      });
    }
  }
  next();
})

export default router;
