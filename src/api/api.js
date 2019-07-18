/**
 * 前台api needLogin = true 需要登录权限才可访问
 */

import {Post, Get} from "./http"
//获取城市列表
export function getCityList (params = {}){
    return Get("/api/getCityList", params);
}
//獲取影院列表
export function getCinemaList (params = {}){
    return Get("/api/getCinemaList", params);
}
//獲取影院排期
export function getIndexFilmList (params = {}){
    return Get("/api/getIndexFilmList", params);
}
//獲取定位學校
export function getLocationCollege (params = {}){
    return Get("/api/getLocationCollege", params);
}
//获取影片座位 
export function getSeat (params = {}){
    return Get("/api/getSeat", {...params,needLogin:true});
}
//下单
export function placeOrder (params = {}){
    return Post("/api/placeOrder", {...params,needLogin:true});
}
//订单详情
export function orderDetail (params = {}){
    return Get("/api/orderDetail", {...params,needLogin:true});
}
//取消订单
export function cancelOrder (params = {}){
    return Post("/api/cancelOrder", {...params,needLogin:true});
}
//支付订单
export function payOrder (params = {}){
    return Post("/api/payOrder", {...params,needLogin:true});
}
//获取订单列表
export function getOrderList (params = {}){
    return Get("/api/getOrderList", {...params,needLogin:true});
}

//新闻
export function getFindNew (params = {}){
    return Get("/api/getFindNew", params);
}
//新闻详情
export function getFindDetail (params = {}){
    return Get("/api/getFindDetail", params);
}
//新闻点赞
export function like (params = {}){
    return Post("/api/like", params);
}
//登录
export function userLogin (params = {}){
    return Post("/api/userLogin", params);
}
//注册
export function userReg (params = {}){
    return Post("/api/userReg", params);
}


