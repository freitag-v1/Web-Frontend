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
      <b-card-title id="projectName" style="font-size: 30px;">{{projectName + "'s Cost"}}</b-card-title>
      <div class = "userDetail">
      <b-card-text style="font-size: 20px; text-align:center;">
            <b-icon icon="credit-card" aria-hidden="true"></b-icon>
            {{"비용 :"+ projectCost}}</b-list-group-item>
      </b-card-text>
      </div>
      <br>
        <br>
        <b-button id = "firstToggle" v-on:click="accountPayment" variant="outline-info">계좌이체</b-button>
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
      }
  },
  async beforeCreate() { //페이지 간 라우터로 데이터를 주고받을지 아님 다시 mypage에 접근해서 가져올지 고민
    //var userId = await localStorage.getItem('userId');
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    
  },
  created() {
    this.fetchData();
  },
  watch : {
    '$route' : 'fetchData' //라우터 객체를 감시하고 있다가 fetchData 함수를 호출한다. 
  },
  methods : {
    //계좌이체를 해서 payment header 성공이면 성공이니까 홈화면으로 가고,
    //계좌이체를 해서 payment header 실패라면 계좌이체가 불가능하다고 알려주고 프로젝트 결제 페이지로 이동하자(대신 cost를 파라미터로 보내야한다.)
    //계좌이체를 해서 payment header 실패이면서 state가 오면 계좌 등록이 되지 않았으므로 계좌 인증 페이지로 이동
      async accountPayment() {
        const paymentRes = await axios.get('/api/project/account/payment');
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
#accountInput {
  max-width: 300px;
  margin: auto;
  margin-top: 30px;
}
</style>