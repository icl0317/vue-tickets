import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        piaoToken:Cookies.get('piao_token')
    }
})

export default store