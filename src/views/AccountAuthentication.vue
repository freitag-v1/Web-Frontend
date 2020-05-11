<template>
<div class ="account">
    <div class ="beforeAuthentication" v-if="!Authentication">
        <br/>
        <img id="accountLogo" src="../assets/accountLogo.png"/>
        <br/>
        <b-button class="button" v-on:click="accountAuthenticate"variant="outline-primary" style="font-size: 18px; font-weight: bold">계좌 인증</b-button>
        <br/>
        <br/>
        <b-button href='/signup' class="button" variant="outline-primary" style="font-size: 18px;">Prev</b-button>
        <b-button class="button" v-on:click ="signUpComplete" variant="outline-primary" style="font-size: 18px;">complete</b-button>
        <!--signup complete 이 부분 계좌인증 안받으면 보이지 않도록 v-if해서 설정해야-->
    </div>
    <div class = "afterAuthentication" v-if="Authentication">
        <SignUpComplete></SignUpComplete>
        <router-view></router-view>
    </div>
</div>
</template>
<script>
import SignUpComplete from '../components/SignUpComplete';
import axios from 'axios';
  var state = null;
  var userId = null;
  export default {
    name: 'SignUp',
    components: {
      SignUpComplete,
    },
    data() {
        return {
            Authentication: false,
        }
    },
    async beforeCreate () {
      state = await localStorage.bankState;
      alert(state);
      //axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      //userId = await localStorage.getItem('userId');
    },
    methods: {
        async signUpComplete() {
            this.Authentication = true;
                alert("3초 뒤에 로그인 페이지로 이동합니다.");
              setTimeout(()=> {
                  this.$router.push("/login");
                  },3000);   

        },
        async accountAuthenticate() {
            window.open("https://testapi.openbanking.or.kr/oauth/2.0/authorize?auth_type=0&scope=login+transfer+inquiry&response_type=code&redirect_uri=http%3a%2f%2fwodnd999999.iptime.org%3a8080%2fexternalapi%2fopenbanking%2foauth%2ftoken&lang=kor&state="+state+"&client_id=XXyvh2Ij7l9rss0HAVObS880qY3penX57JXkib9q");
            
        },
    },

  }
</script>
<style>


#accountLogo {
    margin: auto;
    max-width:200px;
    max-height: 70px;
}
.button {
  width: 150px;
  height: 40px;
  text-transform: uppercase;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  font-family:"Verdana";
}
.button:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
</style>