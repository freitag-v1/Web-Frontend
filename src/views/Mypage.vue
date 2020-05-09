<template>
    <div class = "mypage">
    <img id = "myPagelogo" src="../assets/mypageLogo.jpg"/>
    <div class = "information">
    <b-card
    no-body
    style="max-width: 500px;"
    class = "userInfo"
  >
    <b-card-body id="userInfoBody">
      <b-card-title>{{user.username + "'s Profile"}}</b-card-title>
      <b-avatar id ="profilePicture" src="https://placekitten.com/300/300" size="6rem"></b-avatar>
      <div class = "userDetail">
      <br>
      <b-card-text style="margin: auto">
        {{"Email: " + user.userEmail}}
      </b-card-text>
      <b-card-text style="margin: auto">
        {{"Account: " + user.userAccount}}
      </b-card-text>
      <b-card-text style="margin: auto">
        {{"Bank: " + user.userBank}}
      </b-card-text>
      
      </div>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item id="userLevel">{{"Starter"}}</b-list-group-item>
      <b-list-group-item id="userPoint">
      <img id = "pointLogo" src ="../assets/point.jpg">
      {{"포인트"}}</b-list-group-item>
    </b-list-group>

    <b-card-body>
      <a href="#" class="card-link" id ="pointExchange">포인트 환전</a>
    </b-card-body>
  </b-card>

        </div>
         <b-button id = "firstToggle"v-b-toggle.collapse-1 variant="outline-info">개인정보 수정</b-button>
        <b-collapse id="collapse-1" class="mt-2">
            <b-card class = "passwordCheck">
            <b-form @submit.stop.prevent>
                <label for="text-password">Your Password: </label> <!--password validation 여기서 해줌  -->
                <b-input v-model= "userPassword" type="password" id="first-text-password"></b-input>
                <b-form-invalid-feedback :state="userPasswordValidation">
                Your password must be 8-20 characters long, contain letters and numbers, special characters and must not
                contain spaces, or emoji.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="userPasswordValidation">
                Looks Good.
                </b-form-valid-feedback>
                </b-form>
            <b-button id = "secondeToggle" v-b-toggle.collapse-1-inner size="sm" variant="outline-info">Confirm Your Password</b-button>
            <b-collapse id="collapse-1-inner" class="mt-2">
                <b-card>Your Password Check</b-card>
                <b-form @submit.stop.prevent>
                    <b-input v-model= "userPassword" type="password" id="second-text-password"></b-input>
                    <b-form-invalid-feedback :state="userPasswordValidation">
                    Your password must be 8-20 characters long, contain letters and numbers, special characters and must not
                    contain spaces, or emoji.
                    </b-form-invalid-feedback>
                    <b-form-valid-feedback :state="userPasswordValidation">
                    Looks Good.
                    </b-form-valid-feedback>
                    </b-form>
                <b-button id="modifybutton" v-on:click ="modifyInfo" variant="outline-info">Modify</b-button><!--v-if해서 비밀번호 맞으면 보여주도록-->
            </b-collapse>
            </b-card>
        </b-collapse>
        
    </div>
</template>
<script>
import axios from 'axios';
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
        var pattern1 = /[0-9]/;
        var pattern2 = /[a-zA-Z]/;
        var pattern3 = /[~!@\#$%<>^&*]/;     // 원하는 특수문자 추가 제거
       if(!pattern1.test(this.userPassword)||!pattern2.test(this.userPassword)||!pattern3.test(this.userPassword)){
          return false; //숫자, 영문, 특수문자가 포함되었는지 
       }
        return this.userPassword.length > 7 && this.userPassword.length < 21; // 8~ 20자인지 길이 검증 
      },
  },
  methods : {
      modifyInfo() {
          this.$router.push("/mypage/modify");
      }
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
    margin: auto;
}
#profilePicture {
    float : left;
}
#pointLogo{
    width: 23px;
    height: 23px;
}
</style>
