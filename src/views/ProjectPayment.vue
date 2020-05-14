<template>
    <div id="projectPayment"> 
    <br>
    <h1 id="projectCost">{{projectName+" 프로젝트의 기본 비용은 "+point+"원 입니다."}}</h1>
    <p id = "progressMSG" v-if="pointPay">결제 진행 중입니다.</p>
     <b-progress id ="paymentProgress" v-if="pointPay" :value="value" :max="max" show-progress animated></b-progress>
    <p id = "paymentMSG" v-if="!pointPaySuccess">포인트가 부족하여 결제를 실패하였습니다. 계좌이체로 결제를 진행해주세요! </p>
      <img id="point" v-on:click="pointPayment" src = "../assets/pointPayment.png"/>
      <img id="account" v-on:click="accountPay" src = "../assets/account.png"/>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'ProjectPayment',
    data() {
        return {
            point : 0,
            projectName: null,
            max : 100,
            value: 0,
            pointPay: false,
            pointPaySuccess : true,
        }
    },
    async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
      this.point = this.$route.params.point;
      this.projectName = this.$route.params.projectName;
    },
    methods: {
        pointPayment() {
            this.pointPay = true;
            var startProgess = setInterval(() => {
                if(this.value >= 100){
                    this.pointPay = false;
                    clearInterval(startProgess);
                }
                this.value += 20;
            }, 1000);
            setTimeout(()=> {
                const pointPayRes = axios.get("/api/project/point/payment")
                .then(res => {
                    if(res.headers.payment == 'success'){
                        alert("결제가 완료되었습니다!");
                        this.$router.push("/");
                    }
                    else {
                        this.pointPaySuccess = false;
                    
                    }
                });
                           //alert("hello");
                },6000);   
        },
        accountPay() {  
            
        }

    }
}
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/hanna.css);
h1 {
    font-family: 'Hanna', sans-serif;
}

#point {
    width: 400px;
    height: 310px;
    float : left;
    margin-left: 400px;
    margin-top : 100px;
}
#account {
    width: 400px;
    height: 310px;
    float : left;
    margin-left: 300px;
    margin-top : 110px;
}
#paymentProgress {
    max-width : 700px;
    margin : auto;
}
#progressMSG{
    font-family: 'Hanna', sans-serif;
    font-size: 25px;
}
#paymentMSG{
    font-family: 'Hanna', sans-serif;
    font-size: 25px;
    color : tomato;
}

</style>