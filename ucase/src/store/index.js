import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store=new Vuex.Store({
    state: {
        token: "",
        isLogin: false,
        fields:[],
        kinds:[],
        collection:[]
    },
    mutations: {
        setToken(state,token){
            state.token=token
            localStorage.setItem("uToken",token)
        },
        setLogin(state,isLogin){
            state.isLogin=isLogin
            localStorage.setItem("uLogin",isLogin)
        },
        setFields(state,fields){
            state.fields=fields
        },
        setKinds(state,kinds){
            state.kinds=kinds
        },
        setCollection(state,collection){
            state.collection=collection
        },
        addCollect(state,id){
            state.collection.push(id)
        },
        delCollect(state,id){
            for(let i in state.collection){
                if(state.collection[i]===id){
                    state.collection.splice(i,1)
                }
            }
        },
        clearCollect(state){
            state.collection=[]
        }
    }

})

export default store