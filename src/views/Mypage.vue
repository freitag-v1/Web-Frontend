<template>
    <div class = "mypage">
         <b-button id = "firstToggle"v-b-toggle.collapse-1 variant="outline-info">Modify</b-button>
        <b-collapse id="collapse-1" class="mt-2">
            <b-card class = "passwordCheck">
            <b-form @submit.stop.prevent>
                <label for="text-password">Your Password: </label> <!--password validation 여기서 해줌  -->
                <b-input v-model= "userPassword" type="password" id="text-password"></b-input>
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
                    <b-input v-model= "userPassword" type="password" id="text-password"></b-input>
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
          projectList:'',
          workType:'',
          dataType:'',
      }
  },
  async beforeCreate() {
    var loginStatus = await localStorage.getItem('loginState');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/"); 
      }
    const userInfo = await axios.get("/api/mypage");
    //this.userName = userInfo.data.userName; 이런식으로 가져와서 넣으면 된다. 포인트도 포함
  },
  methods : {
      modifyInfo() {
          this.$router.push("/mypage/modify");
      }
  }
  

}
</script>
<style>
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
</style>
