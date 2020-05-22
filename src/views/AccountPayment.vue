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
      async accountPayment() {
        const paymentRes = await axios.get('/api/project/account/payment');  
      },
      async fetchData() {
          this.projectCost = await localStorage.getItem('projectCost'); //스토리지에서 가져오고 
          delete localStorage.projectCost; //얻었으니까 지운다 
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