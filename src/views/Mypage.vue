<template>
    <div class = "mypage">
    <img id = "myPagelogo" src="../assets/mypageLogo.jpg"/>
    <b-button id = "firstToggle" v-b-toggle.collapse-1 variant="outline-info">개인정보 수정</b-button>
    <div class = "information">
    <b-card
    no-body
    style="max-width: 500px;"
    class = "userInfo"
  >
    <b-card-body id="userInfoBody">
      <b-card-title id="userName">{{user.username + "'s Profile"}}</b-card-title>
      <b-avatar id ="profilePicture" src="https://placekitten.com/300/300" size="6rem" style="margin-top: 20px;"></b-avatar>
      <div class = "userDetail">
      <br>
      <b-card-text style="text-align: right;">
        {{"Email: " + user.userEmail}}
        <br>
        <br>
        {{"Account: " + user.userAccount}}
        <br>
        <br>
        {{    "Bank: " + user.userBank}}
        <br>
        <br>
        {{"Phone Number: " + user.userPhone}}
        <br>
        <br>
        {{"Affiliation: " + user.userAffiliation}}
      </b-card-text>
      
      </div>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item >Your Level:
      <p id="userLevel">Starter</p>
      </b-list-group-item>
      <b-list-group-item id="userPoint">
      <img id = "pointLogo" src ="../assets/point.jpg">
      {{"포인트"}}</b-list-group-item>
    </b-list-group>
    <b-card-body>
      <a href="#" class="card-link" id ="pointExchange">포인트 환전</a>
    </b-card-body>
  </b-card>
  </div>

   <div id = "projectList"> <!-- 각각의 list는 v-for를 이용해서 할 예정 그리고 href는 /project/{projectId} 이런 식으로 요청하면 된다-->
    <b-card id="requestProjectList" no-body header="의뢰한 프로젝트 목록" style="font-weight: bolder;">
    <b-list-group flush>
      <b-list-group-item href="#">Cras justo odio</b-list-group-item>
      <b-list-group-item href="#">Dapibus ac facilisis in</b-list-group-item>
      <b-list-group-item href="#">Vestibulum at eros</b-list-group-item>
      <b-list-group-item href="#">Vestibulum at eros</b-list-group-item>
    </b-list-group>
  </b-card>
      <b-card id="completeWorkList" no-body header="완료한 작업 목록" style="font-weight: bolder;">
    <b-list-group flush>
      <b-list-group-item href="#">Cras justo odio</b-list-group-item>
      <b-list-group-item href="#">Dapibus ac facilisis in</b-list-group-item>
      <b-list-group-item href="#">Vestibulum at eros</b-list-group-item>
      <b-list-group-item href="#">Vestibulum at eros</b-list-group-item>
    </b-list-group>
  </b-card>
  </div>
</b-card-group>
       
        <b-collapse id="collapse-1" class="check">
            <b-card class = "passwordCheck">
            <b-form @submit.stop.prevent>
                <label for="text-password">Your Password: </label> <!--password validation 여기서 해줌  -->
                <b-input v-model= "userPassword" type="password" id="first-text-password"></b-input>
              <b-form-invalid-feedback :state="userPasswordValidation">
              개인정보 수정을 위해서 비밀번호 확인이 필요합니다. 
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="userPasswordValidation">
              확인이 완료되었습니다. 수정이 가능합니다.
              </b-form-valid-feedback>
                </b-form>
                <b-button id="modifybutton" v-if="userPasswordValidation" v-on:click ="modifyInfo" variant="outline-info">Modify</b-button><!--v-if해서 비밀번호 맞으면 보여주도록-->
            </b-card>
        </b-collapse>
        
    </div>
</template>
<script>
import axios from 'axios';
import bcrypt from 'bcrypt-nodejs';

export default {
  name: 'Mypage',
  data() {
      return {
        user: '',
        userPassword: '',
      }
  },
  async beforeCreate() {
    var loginStatus = await localStorage.getItem('loginState');
    var userId = await localStorage.getItem('userId');
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/"); 
      }
    const userInfo = await axios.get("/api/mypage", {
        params: {
            userId : userId,
        }
    });
    this.user = userInfo.data;
    console.log(userInfo.data);
    //this.userName = userInfo.data.userName; 이런식으로 가져와서 넣으면 된다. 포인트도 포함
  },
  computed: {
    userPasswordValidation() {
         var checkPassword = bcrypt.compareSync(this.userPassword, this.user.password, function(err,res) {
          //console.log("1" + res);
          return res;
        });
        return checkPassword;
    }
  },
  methods : {
      modifyInfo() {
          this.$router.push("/mypage/modify");
      },

  }
  

}
</script>
<style>
#myPagelogo {
    margin: auto;
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
#modifybutton {
     margin : 10px;
}
.userInfo {
    margin-left: 430px;
    float: left;
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
#userName{
  font-family: fantasy;
}
#requestProjectList{
  max-width: 500px; 
}
#projectList{
  float: left;
  width: 500px;
}
.passwordCheck{
  width : 350px;
}


</style>
