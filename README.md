# vue 移动端在线选座购票

此项目为自行瞎搞，功能效果并不完善，主体实现了选座购票流程；有注册环节随意输入，支付环节为假象，可随意下单，后续会继续完善。

## 效果演示  

<img src="https://ich0317.github.io/vue-tickets/screenshot/wangzhi.png" width="200" height="200">  

## 项目运行

``` git bash  

git clone https://github.com/ich0317/vue-tickets.git  

cd vue-tickets  

npm / cnpm install  

npm run dev  

```  

## 项目结构  
```  
├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── dist                                        // 打包后文件
├── screenshot                                  // 项目截图
├── src                                         // 代码
│   ├── api                                      
│   │   ├── api.js                              // 接口
│   │   ├── http.js                             // axios配置
│   ├── components                              // 组件
│   │   ├── fixedFooter                         // 公共底部组件
│   │   ├── langType                            // 全局电影类型组件  
│   │   ├── loading                             // 全局loading组件
│   │   ├── noData                              // 全局暂无数据组件  
│   │   ├── swiper                              // 全局轮播图组件
│   │   └── topBar                              // 公共头部组件
│   ├── images                                  // 公共图片  
│   ├── router
│   │   └── router.js                           // 路由配置  
│   ├── store                                   // vuex
│   │   ├── index.js                            // store出口
│   │   ├── modules                             // store模块
│   │       └── user.js                         // 用户状态管理  
│   └── style
│   |   ├── common.scss                         // 公共样式文件
│   |   ├── mixin.scss                          // 样式配置文件
│   |   └── font-icons                          // 字体图标  
│   └── utils                                   // 常用js工具
│   |   ├── index.js                            // 工具
│   |   ├── rem.js                              // rem适配  
│   └── vendor                                  // js插件
│   |   ├── geolocation.min.js                  // 腾讯定位服务
│   |   ├── hammer.min.js                       // touch
│   ├── views
│   │   ├── film
│   │   │   ├── index.vue                       // 首页  
│   │   │   └── cinema-list                     
│   │   │       └── cinema-list.vue             // 影院列表和城市列表
│   │   ├── find
│   │   │   ├── news.vue                        // 新闻发现
│   │   │   └── news-detail
│   │   │       ├── detail.vue                  // 新闻详情  
│   │   ├── my
│   │   │   ├── tickets
│   │   │   │   ├── tickets.vue                 // 我的影票
│   │   │   └── my.vue                          // 我的
│   │   ├── order
│   │   │   ├── detail
│   │   │   │   ├── order-detail.vue            // 订单详情
│   │   ├── seat
│   │   │   ├── seat.vue                        // 选座
│   │   │   ├── seat_map.js                     // 选座js
│   │   ├── 404.vue                             // 404
│   │   ├── login.vue                           // 登录
│   │   ├── reg.vue                             // 注册
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
├── favicon.ico                                 // 图标
├── index.html                                  // 入口html文件

```
