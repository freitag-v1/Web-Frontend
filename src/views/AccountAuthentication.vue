<template>
<div class ="account">
    <div class ="beforeAuthentication" v-if="!Authentication">
        <br/>
        <img id="accountLogo" src="../assets/accountLogo.png"/>
        <br/>
        <p v-if="status == 'signup'">프로젝트 의뢰 및 작업 포인트를 환전하기 위해 계좌 인증이 필요합니다.</p>
        <p v-if="status == 'accountPay'">프로젝트 의뢰를 위해 계좌 인증이 필요합니다.</p>
        <br>   
        <br/>
        <br/>
        <b-button class="button" v-if="!isRegistered" v-on:click="accountAuthenticate"variant="outline-primary" style="font-size: 18px; font-weight: bold">계좌 인증</b-button>
        <b-button class="button" v-if="isRegistered" v-on:click ="signUpComplete" variant="outline-primary" style="font-size: 18px;">완료</b-button>
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
        status : '',
        isComplete: false,
        isRegistered: false
      }
    },
    async created () {
      state = await localStorage.bankState;
      status = this.$route.params.status;
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav);
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
            });
            window.addEventListener('message', this.registerComplete);
    },
    beforeRouteLeave(to, from, next) {
        if(!this.isComplete){ //버튼을 눌러서 완성이 되면 이 기능을 무시하도록 
            if (!window.confirm("페이지를 벗어나면 회원가입이 실패합니다.")) {
                return;
            }
        }
        next();
        
    },
    methods: {
        preventNav(event) {
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        async registerComplete(e) {
              if(e.data.registerOpenBanking === 'complete') {
                this.isRegistered = true;
              }
        },
        async signUpComplete() { //로그인을 해야 jwt 토큰을 받아서 나의 정보를 알아올 수 없음 그래서 계좌인증 여부를 여기서 알기 힘드니까 마이페이지에서 ! 
            this.Authentication = true;
            if(this.status == "signup"){
                alert("3초 뒤에 로그인 페이지로 이동합니다.");
                this.isComplete = true;
                setTimeout(()=> {
                  this.$router.push("/login");
                  },3000);   
            }
            if(this.status == "accountPay"){
                alert("계좌 인증이 완료되었습니다. 프로젝트 결제 페이지로 이동합니다.");
                var projectId = this.$route.params.projectId;
                var point = this.$route.params.point;
                var projectName = this.$route.params.projectName;
                this.$router.push({name : "ProjectPayment", params : {
                    projectId : projectId,
                    point: point,
                    projectName : projectName,
                }})
            }



        },
        async accountAuthenticate() {
            window.open("https://testapi.openbanking.or.kr/oauth/2.0/authorize?auth_type=0&scope=login+transfer+inquiry&response_type=code&redirect_uri=http%3a%2f%2f101.101.208.224%3a8080%2fexternalapi%2fopenbanking%2foauth%2ftoken&lang=kor&state="+state+"&client_id=R9zNr3OIJNyJfj8pbMnBATU9OF6RtGb7Ih63xAdq");
            
        },
        backbuttonFunc () {
          alert("뒤로가지마");
        }
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
