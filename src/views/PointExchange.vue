<template>
    <div class = "pointExchange">
    <img id="exchangeLogo"  src = "../assets/pointExchange.png"/>
    <br>
        <b-card
    no-body
    style="max-width: 500px;"
    class = "point"
  >
    <b-card-body id="userInfoBody">
      <b-card-title id="userName" style="font-size: 30px;">{{userName + "'s Point"}}</b-card-title>
      <div class = "userDetail">
      <b-card-text style="font-size: 20px; text-align:center;">
            <img id = "pointLogo" src ="../assets/point.jpg">
            {{"포인트 :"+ userPoint}}</b-list-group-item>
      </b-card-text>
      </div>
      <b-form  @submit.stop.prevent>
        <br>
      <p>환전하기를 원하는 포인트를 입력하세요.</p>
      <b-form-input
          id="wantPoint"
          v-model="wantPoint"
          required
          placeholder="포인트 입력"
        ></b-form-input>
        <b-form-invalid-feedback  :state="pointValidation">
              환전 가능한 포인트를 초과하였습니다.
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="pointValidation">
              </b-form-valid-feedback>
        </b-form>
        <br>
        <b-button id = "firstToggle" v-if= "pointValidation" v-b-toggle.collapse-1 variant="outline-info">포인트 환전</b-button>
    </b-card-body>
        <b-collapse id="collapse-1" class="check" v-if= "pointValidation">
            <b-card class = "passwordCheck">
            <b-form @submit.stop.prevent>
                <label for="text-password">Your Password: </label> <!--password validation 여기서 해줌  -->
                <b-input v-model= "userPassword" type="password" id="first-text-password"></b-input>
              <b-form-invalid-feedback :state="userPasswordValidation">
              포인트 환전을 위해서 비밀번호 확인이 필요합니다. 
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="userPasswordValidation">
              확인이 완료되었습니다. 환전이 가능합니다.
              </b-form-valid-feedback>
                </b-form>
                <b-button id="modifybutton" v-if="userPasswordValidation" v-on:click ="exchangePoint" variant="outline-info">환전</b-button><!--v-if해서 비밀번호 맞으면 보여주도록-->
                <br>
                <br>
            </b-card>
        </b-collapse>
        <br>
        <br>
  </b-card>
    
    </div>
</template>
<script>
import axios from 'axios';
import bcrypt from 'bcrypt-nodejs';

var userBcryptPwd = '';
export default {
  name: 'PointExchange',
  data() {
      return {
        userPassword: '',
        userPoint: '',
        userName: '',
        wantPoint: 0,
      }
  },
  async beforeCreate() { //페이지 간 라우터로 데이터를 주고받을지 아님 다시 mypage에 접근해서 가져올지 고민
   
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      this.userPoint = this.$route.params.point;
      this.userName = this.$route.params.userName;
      userBcryptPwd = this.$route.params.userPassword;
  },
  computed: {
    userPasswordValidation() {
         var checkPassword = bcrypt.compareSync(this.userPassword, userBcryptPwd, function(err,res) {
          //console.log("1" + res);
          return res;
        });
        return checkPassword;
    },
    pointValidation() {
        if(Number(this.wantPoint) > Number(this.userPoint)) {
            return false;
        }
        else return true;
    }
  },
  methods : {
      exchangePoint() {
          if(this.wantPoint == 0){
              alert("환전하고 싶은 포인트를 입력해주세요!!");
          }
          else {
            const exchangeResult = axios.put("/api/mypage/exchange","", {
                params : {
                    point : this.wantPoint,
                }
            });
          }

      }
  }
       
}
</script>
<style>
#wantPoint {
    max-width: 300px;
    margin: auto;
    margin-top: 30px;
    
}
.point{
    margin: auto;
}
#accountInput {
  max-width: 300px;
  margin: auto;
  margin-top: 30px;
}
</style>
