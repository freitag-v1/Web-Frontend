<template>
    <div class = "Mypage">
    <img id = "myPagelogo" src="../assets/mypageLogo.jpg"/>
    <b-button id = "modifyInfoButton" v-b-modal.modal-1>개인정보 수정</b-button>
    <div class = "information">
    <b-card
    no-body
    style="width: 1300px; height: 500px; margin: auto;"
    class = "userInfo"
    :img-src="require('../assets/userLogo.jpg')"
    img-alt="Card image" 
    img-left
  > 
    <b-card-body id="userInfoBody">
    <b-card-title id="userName">{{user.userName + "님의 마이페이지"}}</b-card-title>
      <b-list-group flush>
        <b-list-group-item >작업자 정확도:
        <p id="userLevel">{{userAccuracy * 100 + "%"}}</p>
        </b-list-group-item>
        <b-list-group-item id="userPoint">
        <img id = "pointLogo" src ="../assets/point.jpg">
        {{"포인트 :"+ user.userPoint}}</b-list-group-item>
      </b-list-group>
      <div class = "userDetail">
      <br>
      <b-card-text style="text-align: center;">
        {{"이메일: " + user.userEmail}}
        <br>
        <br>
        {{"휴대전화: " + user.userPhone}}
        <br>
        <br>
        {{"소속 기관: " + user.userAffiliation}}
      </b-card-text>
      <br>
      <button class="card-link" id ="pointExchangeButton" v-on:click ="moveExchangePage">포인트 환전</button>
      </div>
    </b-card-body>
    
  </b-card>
  </div>
  </b-card-group>       
  <b-modal id="modal-1" class="check" title="비밀번호 확인" hide-footer>
    <b-form @submit.stop.prevent>
    <label for="text-password">비밀번호 입력: </label>
    <b-input v-model= "userPassword" type="password" id="first-text-password" v-on:keyup.enter="validatePassword"></b-input>
    <b-form-invalid-feedback :state="userPasswordValidation">
        개인정보 수정을 위해서 비밀번호 확인이 필요합니다. 
    </b-form-invalid-feedback>
    <b-form-valid-feedback :state="userPasswordValidation">
      확인이 완료되었습니다. 수정이 가능합니다.
    </b-form-valid-feedback>
    </b-form>
    <b-button id="confirmPassword" v-if="!userPasswordValidation" v-on:click ="validatePassword" v-on:keyup.enter="validatePassword">비밀번호 확인</b-button>
    <b-button id="modifyButton" v-if="userPasswordValidation" v-on:click ="modifyInfo">수정하러 가기</b-button>
  </b-modal>
  </div>
</template>
<script>
import axios from 'axios';
import bcrypt from 'bcrypt-nodejs';
import { sha256, sha224 } from 'js-sha256';

export default {
  name: 'Mypage',
  data() {
      return {
        user: '',
        userPassword: '',
        userAccuracy: '',
        userPasswordValidation: false,
      }
  },
  async beforeCreate() {
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    const userInfo = await axios.get("/api/mypage");
    this.user = userInfo.data;
    console.log(this.user);
    this.userAccuracy = this.user.userAccuracy.toFixed(3);
  },
  methods : {
      modifyInfo() {
          this.$router.push({name: "MypageModify", 
          params : {
            user: this.user,
          }});
      },
      moveExchangePage() {
        this.$router.push({name: "PointExchange", 
          params : {
            point : this.user.userPoint,
            userName : this.user.userName,
            userPassword : this.user.password,
          }});
      },
      validatePassword() {
        this.userPasswordValidation = false;
        var hashPassword = sha256.hex(this.userPassword);
        var checkPassword = bcrypt.compareSync(hashPassword, this.user.password, function(err,res) {
            this.userPasswordValidation = res;
          });
          this.userPasswordValidation = checkPassword;
        if(this.userPasswordValidation == false){
          alert("비밀번호가 일치하지 않습니다.");
          this.userPassword = "";
        }
      }

  }
  

}
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

#myPagelogo {
    margin-left: 150px;
    max-width: 250px;
    max-height: 100px;
}
#firstToggle {
    margin : 6px;
    width : 170px;
}
#secondeToggle{
    margin : 10px;
    width : 350px;
}
.passwordCheck {
    max-width : 800px;
    margin : auto;
}
#modifyButton{
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;

}
#modifyButton:hover {
    background-color: #4682B4;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
}
#modifyInfoButton{
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;

}
#modifyInfoButton:hover {
    background-color: #4682B4;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
}
#pointExchangeButton{
width: 200px;
  background-color: #FA8072;
  border: none;
  font-size: 19px;
  height : 40px;
  color: black;
  border-radius : 5px;

}
#pointExchangeButton:hover { 
    background-color: #FA8072;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
}
.userInfo {
    margin: auto;
    width: 500px;
}
#profilePicture {
    float : left;
}
#pointLogo{
    width: 23px;
    height: 23px;
}
#userLevel {
  color : #28adfc;
  font-family: fantasy;
  font-size: 20px;
  font-weight: bold;
}
#modal-1 {
  font-family: "Jeju Gothic", sans-serif;
}

</style>
