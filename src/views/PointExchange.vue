<template>
    <div class = "pointExchange">
    <img id="exchangeLogo" style="width: 400px; height: 120px;" src = "../assets/pointExchange.png"/>
    <br>
        <b-card
    no-body
    style="max-width: 500px;"
    class = "point"
  >
    <b-card-body id="userInfoBody">
      <b-card-title id="userName" style="font-size: 30px;">{{userName + "님의 보유 포인트"}}</b-card-title>
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
        <b-button id ="exchangeButton" v-if= "pointValidation" v-b-toggle.collapse-1 variant="outline-info">포인트 환전</b-button>
    </b-card-body>
      <b-collapse id="collapse-1" class="check" v-if= "pointValidation">
            <b-card class = "passwordCheck">
            <b-form @submit.stop.prevent>
                <label for="text-password">비밀번호: </label>
                <b-input v-model= "userPassword" type="password" id="first-text-password"></b-input>
              <b-form-invalid-feedback :state="userPasswordValidation">
              포인트 환전을 위해서 비밀번호 확인이 필요합니다. 
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="userPasswordValidation">
              확인이 완료되었습니다. 환전이 가능합니다.
              </b-form-valid-feedback>
                </b-form>
                <br>
                <b-button id="confirmPassword" v-if="!userPasswordValidation" v-on:click ="validatePassword" v-on:keyup.enter="validatePassword">비밀번호 확인</b-button>
                <b-button id="realExchangeButton" v-if="userPasswordValidation" v-on:click ="exchangePoint">환전</b-button>
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
import { sha256, sha224 } from 'js-sha256';


export default {
  name: 'PointExchange',
  data() {
      return {
        userPassword: '',
        userPoint: '',
        userName: '',
        wantPoint: 0,
        userPasswordValidation: false,
        userBcryptPwd : '',
      }
  },
  async beforeCreate() { 
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      this.userPoint = this.$route.params.point;
      this.userName = this.$route.params.userName;
      this.userBcryptPwd = this.$route.params.userPassword;
      // if(this.userPoint == undefined || this.userName == undefined || this.userBcryptPwd == undefined){
      //   alert("잘못된 접근입니다.");
      //   this.$router.push("/");
      // }
  },
  computed: {
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

      },
      validatePassword() {
        this.userPasswordValidation = false;
        var hashPassword = sha256.hex(this.userPassword);
        var checkPassword = bcrypt.compareSync(hashPassword, this.userBcryptPwd, function(err,res) {
            this.userPasswordValidation = res;
          });
          this.userPasswordValidation = checkPassword;
        if(this.userPasswordValidation == false){
          alert("비밀번호가 일치하지 않습니다.");
          this.userPassword = "";
        }
      },
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
#exchangeButton {
  width: 150px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  color: #fff;
  background-color: #4682b4;
  border: 2px solid #4682b4;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}
#exchangeButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
#realExchangeButton {
  width: 150px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  color: #fff;
  background-color: #4682b4;
  border: 2px solid #4682b4;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}
#realExchangeButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
#confirmPassword {
  width: 200px;
  background-color: tomato;
  border: none;
  font-size: 19px;
  color: black;
}
#confirmPassword:hover {
    background-color: tomato;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
}
</style>
