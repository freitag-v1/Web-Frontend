import Vue from 'vue';
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

//const resourceHost = 'http://localhost:9000'

export default new Vuex.Store({
    state: {
        token: null,
        isAuth: null,
        loginState: false,
    },
    getters : {
        getLoginState: function(state) {
            return state.loginState;
        },
        getisAuth: function(state) {
            return state.isAuth;
        }
    },
    mutations: {
        LOGIN(state, {token, isAuth, userId}) {
            state.token = token,
            state.isAuth = isAuth,
            state.loginState = true,
            state.userId = userId,
            localStorage.token = token,
            localStorage.isAuth = isAuth,
            localStorage.loginState = true,
            localStorage.userId = userId
        },
        LOGOUT(state) {
            state.token = null,
            state.loginState = false,
            state.isAuth = null,
            delete localStorage.token,
            delete localStorage.isAuth,
            delete localStorage.loginState,
            delete localStorage.userId
        }
    },
    actions: {
        async LOGIN({commit},{userId, password}){
                axios.post("/api/login?userId="+userId+"&userPassword="+password)
                .then(res => {
                    //console.log(res.headers.authorization);
                    var token = res.headers.authorization;
                    var authorities = res.data.authorities;
                    commit('LOGIN',{token, authorities,userId}) //로그인 성공시 session id랑 authorities이거 넘겨주는
                    alert("로그인 완료!");
                    setTimeout(()=> {
                        window.location.reload();
                        router.go(-1);
                    },2000);  
                })
                .catch(function(error) {
                    if(error.response){
                        alert("로그인이 실패하였습니다!");
                        location.reload();
                    }
                });
                
        },
        async LOGOUT({commit}) {
            commit('LOGOUT');
        },
                
    }
})