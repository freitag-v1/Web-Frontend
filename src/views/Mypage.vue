<template>
    <div class = "mypage">
    <img id = "myPagelogo" src="../assets/mypageLogo.jpg"/>
    <b-button id = "firstToggle" v-b-toggle.collapse-1 variant="outline-info">개인정보 수정</b-button>
    <div class = "information">
    <b-card
    no-body
    style="width: 700px;"
    class = "userInfo"
  >
    <b-card-body id="userInfoBody">
      <b-card-title id="userName">{{user.userName + "'s Profile"}}</b-card-title>
      <b-avatar id ="profilePicture" src="https://placekitten.com/300/300" size="6rem" style="margin-top: 20px;"></b-avatar>
      <div class = "userDetail">
      <br>
      <b-card-text style="text-align: right;">
        {{"Email: " + user.userEmail}}
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
      {{"포인트 :"+ userPoint}}</b-list-group-item>
    </b-list-group>
    <b-card-body>
      <button class="card-link" id ="pointExchange" v-on:click ="moveExchangePage">포인트 환전</button>
    </b-card-body>
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
        userPoint: '',
      }
  },
  async beforeCreate() {
    axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      
    const userInfo = await axios.get("/api/mypage");
    this.user = userInfo.data;
    this.userPoint = userInfo.headers.point;
    console.log(userInfo.data);
    //출석 보상 기능을 할 때 userInfo.headers.uservisit에 접근해서 30 이하인 경우 출석 보상 받을 수 있다고 알려주기(iteration 5)
    //if() // 계좌인증을 했는지 안했는지 여부를 state 랑 openbanking token 이거 여부를 알아야 가능한디 이거를 마이페이지
      // 가져올 때 서버에서 넘겨줄지를 알려줘야 
      // if(state != user.user_openbanking_access_token) 
      // 참이면 다르면 계좌인증한 사람
      // 거짓이면 계좌인증 안한 사람이니까 계좌 인증하라는 알림창 
    // v-for해서 프로젝트 리스트 변수 생성하고 여기서 받아온 리스트 넣기  
    // const projectList = await axios.get("/api/projectList", {
    //   params: {
    //     userId : userId,
    //   }
    // });
    // 이런식으로 나중에는 workList도 가져와야한다!

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
          this.$router.push({name: "MypageModify", 
          params : {
            user: this.user,
          }});
      },
      moveExchangePage() {
        this.$router.push({name: "PointExchange", 
          params : {
            point : this.userPoint,
            userName : this.user.userName,
            userPassword : this.user.password,
          }});
      }

  }
  

}
</script>
<style>
.information{
}
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
#modifybutton {
    margin : 10px;
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

.passwordCheck{
  width : 350px;
}
#pointExchange {
  width : 150px;
}

</style>
