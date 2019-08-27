import Vue from 'vue'
import App from './App'
import router from './router'
import './utils/rem'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store/index'

Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
