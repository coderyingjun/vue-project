import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state: {
        token: "",
        isLogin: false,
        tabIndex: 1
    },
    mutations: {
        setToken(state,token){
            state.token=token
            localStorage.setItem("adminToken",token)
        },
        setLogin(state,isLogin){
            state.isLogin=isLogin
            localStorage.setItem("adminLogin",isLogin)
        },
        setTabIndex(state,index){
            state.tabIndex=index
        }
    }

})

export default store