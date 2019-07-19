import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        piaoToken:Cookies.get('piao_token'),
        piaoUserName:Cookies.get('piao_username'),
        currentCinemaId:sessionStorage.cinema_id
    }
})

export default store