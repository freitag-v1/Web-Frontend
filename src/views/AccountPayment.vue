<template>
    <div class = "accountPayment">
    <img id="accountTransferLogo"  src = "../assets/accountTransfer.png"/>
    <br>
        <b-card
    no-body
    style="max-width: 500px;"
    class = "point"
  >
    <b-card-body id="userInfoBody">
      <b-card-title id="projectName" style="font-size: 30px;">{{projectName + "의 비용"}}</b-card-title>
      <div class = "userDetail">
      <b-card-text style="font-size: 20px; text-align:center;">
            <b-icon icon="credit-card" aria-hidden="true"></b-icon>
            {{"비용 :"+ projectCost}}
            </b-list-group-item>
      </b-card-text>
      </div>
      <br>
        <br>
        <b-button id = "accountPayButton" v-on:click="accountPayment" variant="outline-info">계좌이체</b-button>
    </b-card-body> 
  </b-card>
    
    </div>
</template>
<script>
import axios from 'axios';

var userBcryptPwd = '';
export default {
  name: 'PointExchange',
  data() {
      return {
        projectCost: '',
        projectName: '',
        projectId: '',
        accountPayState : false,
      }
  },
  async beforeCreate() { //페이지 간 라우터로 데이터를 주고받을지 아님 다시 mypage에 접근해서 가져올지 고민
    //var userId = await localStorage.getItem('userId');
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    
  },
  created() {
    this.fetchData();
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.accountPayState == false) {
      if (
        !window.confirm(
          "결제 페이지를 벗어나는 경우 프로젝트이 생성되지 않습니다. 그래도 이동하시겠습니까?"
        )
      ) {
        return;
      }
    }
    next();
  },
  methods : {
      preventNav () {
        if (this.accountPayState == true) return;
            event.preventDefault();
            event.returnValue = "";
      },
      async accountPayment() {
        const paymentRes = await axios.get('/api/project/account/payment', {
          params: {
            projectId : this.projectId,
          }
        });
        this.accountPayState = true;
        if(paymentRes.headers.payment == "success"){
           alert("계좌이체 성공하였습니다.");
           this.$router.push("/");
        }
        else if(paymentRes.headers.payment == "fail" && paymentRes.headers.state == null){ //null이거나 undefined겠지
          alert("계좌이체를 실패하였습니다. 프로젝트 결제 페이지로 이동합니다.");
          this.$router.push({name: "ProjectPayment", 
              params : {
                projectId : this.projectId,
                point: this.projectCost,
                projectName : this.projectName,
              }});
        }
        else {
          //계좌 인증할 때 로컬스토리지에서 가져와서 헤더로 받은 state저장
          alert("계좌가 등록되지 않았습니다. 계좌 인증 페이지로 이동합니다.")
          localStorage.bankState = paymentRes.headers.state;
          this.$router.push({name : "Account", 
              params : {
                status : "accountPay",
                projectId : this.projectId,
                point: this.projectCost,
                projectName : this.projectName,
              }});
        }

      },
      async fetchData() {
          this.projectCost = this.$route.params.cost; //스토리지에서 가져오고 
          this.projectId = this.$route.params.projectId;
          this.projectName = this.$route.params.name;

      }
    
    
  }
       
}
</script>
<style>
#accountPayButton {
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#accountPayButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
</style>