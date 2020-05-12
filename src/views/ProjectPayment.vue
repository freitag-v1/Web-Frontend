<template>
    <div id="projectPayment"> 
    <br>
    <h1 id="projectCost">{{projectName+" 프로젝트의 기본 비용은 "+point+"원 입니다."}}</h1>
      <img id="point" v-on:click="createCollection" src = "../assets/pointPayment.png"/>
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
        }
    },
    async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
      this.point = this.$route.params.point;
      this.projectName = this.$route.params.projectName;
    },
    methods: {
        createCollection() {
            this.$router.push("/project/collection");
        },
        accountPay() {  
            //window.open();
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
</style>