import Vue from 'vue';
import Vuex from 'vuex'
import axios from 'axios'

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
        LOGIN(state, {token, isAuth}) {
            state.token = token,
            state.isAuth = isAuth,
            state.loginState = true,
            localStorage.token = token,
            localStorage.isAuth = isAuth,
            localStorage.loginState = true
        },
        LOGOUT(state) {
            state.token = null,
            state.loginState = false,
            state.isAuth = null,
            delete localStorage.token,
            delete localStorage.isAuth,
            delete localStorage.loginState
        }

    },
    actions: {
        LOGIN({commit},{userId, password}){
            try
            { 
                axios.get("/api/login?userId="+userId+"&userPassword="+password)
                .then(res => {
                
                if(res.data != null) {
                    alert(res.data.token);
                    commit('LOGIN',res.data.token, res.data.authorities) //로그인 성공시 session id랑 authorities이거 넘겨주는
                    //alert(this.state.loginState);
                } 
            });
            } catch(err) {
                console.error(err);
                alert("아이디 혹은 패스워드가 잘못되었습니다.");
            }
        },
        async LOGOUT({commit}) {
            const result = await axios.get("/api/logout");
            //alert(result.data);
            if(result.data == "success"){
                commit('LOGOUT')
            }
        },
                
    }
})