<template>
  <div class="account">
    <div class="beforeAuthentication" v-if="!Authentication">
      <br />
      <img id="accountLogo" src="../assets/accountLogo.png" />
      <br />
      <p class="alert" v-if="status == 'signup'">
        프로젝트 의뢰 및 작업 포인트를 환전하기 위해 계좌 인증이 필요합니다.
      </p>
      <p class="alert" v-if="status == 'accountPay'">
        프로젝트 의뢰를 위해 계좌 인증이 필요합니다.
      </p>
      <p class="alert" style="color : tomato">
        ※ 계좌인증을 하지 않으면 방구석 수집가를 이용하는데 제한이 있을 수
        있습니다.
      </p>
      <br />
      <br />
      <br />
      <b-button
        id="authenticationButton"
        v-if="!isRegistered"
        v-on:click="accountAuthenticate"
        >계좌 인증</b-button
      >
      <b-button
        id="completeButton"
        v-if="isRegistered"
        v-on:click="signUpComplete"
        >완료</b-button
      >
       <b-button id ="goSignIn" v-if = "status == 'signup'" v-on:click="goLogin">로그인 이동</b-button>
    </div>
   
    <div
      class="afterAuthentication"
      v-if="Authentication && status == 'signup'"
    >
      <SignUpComplete></SignUpComplete>
      <router-view></router-view>
    </div>

  </div>
</template>
<script>
import SignUpComplete from "../components/SignUpComplete";
import axios from "axios";

var state = null;
var userId = null;

export default {
  name: "SignUp",
  components: {
    SignUpComplete,
  },
  data() {
    return {
      Authentication: false,
      status: "",
      isComplete: false,
      isRegistered: false,
      state: '',
    };
  },
  async created() {
    this.state = this.$route.params.state;
    this.status = this.$route.params.status;
    if(this.status == "signup"){
      alert("회원가입이 성공하였습니다. 미리 계좌인증을 하고싶으면 하시고 아니면 로그인 화면으로 이동합니다.");
    }
    if(this.status == null){
      alert("잘못된 접근입니다.");
      this.$router.push("/");
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
    window.addEventListener("message", this.registerComplete);
  },
  beforeRouteLeave(to, from, next) {
    if ((!this.isComplete && this.status == "accountPay") || (!this.isComplete && this.status == "exchangePoint") )  {
      if (!window.confirm("페이지를 벗어나면 계좌 인증이 실패합니다.")) {
        return;
      }
    }
    next();
  },
  methods: {
    preventNav(event) {
      if ((this.isComplete && this.status == "accountPay") || (this.isComplete && this.status == "exchangePoint")
      || this.status == "signup") return;
      event.preventDefault();
      event.returnValue = "";
    },
    async registerComplete(e) {
      if (e.data.registerOpenBanking === "complete") {
        this.isRegistered = true;
      }
    },
    async signUpComplete() {
      this.Authentication = true;
      if (this.status == "signup") {
        alert("3초 뒤에 로그인 페이지로 이동합니다.");
        this.isComplete = true;
        setTimeout(() => {
          this.$router.push("");
        }, 3000);
      }
      if (this.status == "accountPay") {
        alert("계좌 인증이 완료되었습니다. 프로젝트 결제 페이지로 이동합니다.");
        var projectId = this.$route.params.projectId;
        var point = this.$route.params.point;
        var projectName = this.$route.params.projectName;
        this.isComplete = true;
        this.$router.push({
          name: "ProjectPayment",
          params: {
            projectId: projectId,
            point: point,
            projectName: projectName,
          },
        });
      }
      else if(this.status == "exchangePoint"){
        var userName = this.$route.params.name;
        var pwd = this.$route.params.pwd;
        var point = this.$route.params.point;
        this.isComplete = true;
        this.$router.push({
          name: "PointExchange",
          params: {
            userName : userName,
            userPassword : pwd,
            point: point,
          },
        });
      }
      else {
        alert("계좌 인증이 완료되었습니다. 포인트 환전 페이지로 이동합니다.");
      }
    },
    async accountAuthenticate() {
      window.open(
        "https://testapi.openbanking.or.kr/oauth/2.0/authorize?auth_type=0&scope=login+transfer+inquiry&response_type=code&redirect_uri=http%3a%2f%2f101.101.208.224%3a8080%2fexternalapi%2fopenbanking%2foauth%2ftoken&lang=kor&state=" +
          this.state +
          "&client_id=R9zNr3OIJNyJfj8pbMnBATU9OF6RtGb7Ih63xAdq"
      );
    },
    goLogin() {
      this.$router.push("/login");
    }
  },
};
</script>
<style>
#accountLogo {
  margin: auto;
  max-width: 200px;
  max-height: 70px;
}
#authenticationButton {
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#authenticationButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
#completeButton {
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#completeButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
.alert {
  font-size: 20px;
}
#goSignIn {
  width: 200px;
  border-radius : 4px;
  margin : 5px;
  height : 41px;
  background-color: #FFA500;
  border: none;
  font-size: 19px;
  color: black;
}
#goSignIn:hover {
  background-color: #FFA500;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}

</style>
