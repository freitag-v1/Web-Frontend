<template>

    <div class = "signUpForm" style ="overflow:auto">
     <b-card no-body class="overflow-hidden" >
         <b-row no-gutters>
      <b-col md="6">
        <img id="signupImage" src="../assets/signup.png"/>
      </b-col>
       <b-col md="6">
        <b-card-body title="회원가입">
    <b-form v-if="show">
      <b-form-group
        id="input-group-1"
        label-for="input-1"
      >
      <b-form  @submit.stop.prevent>
        <label for="feedback-user">아이디</label>
        <b-input v-model="userId" :state="userIdValidation" id="feedback-user"></b-input>
        <b-form-invalid-feedback :state="userIdValidation" style="font-size: 15px;">
          아이디는 반드시 5자 이상 12자 이하로 해주세요.
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="userIdValidation">
        </b-form-valid-feedback>
      </b-form>
        
      <b-form @submit.stop.prevent>
        <label for="text-password">비밀번호 </label> <!--password validation 여기서 해줌  -->
        <b-input v-model= "userPassword" type="password" id="text-password"></b-input>
        <b-form-invalid-feedback :state="userPasswordValidation" style="font-size: 15px;">
          비밀번호는 8자에서 12자 사이로 설정해주세요. 특수문자가 반드시 포함이 되어야합니다. 
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="userPasswordValidation">
        </b-form-valid-feedback>
      </b-form>
      </b-form-group>

      <b-form-group id="input-group-2" label="이름:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="userName"
            required
            placeholder="이름을 입력해주세요."
          ></b-form-input>
      </b-form-group>

     <b-form-group id="input-group-3" label="이메일:" label-for="input-3">
      <b-form-input
          id="input-3"
          v-model="userEmail"
          type="email"
          required
          placeholder="이메일을 입력해주세요."
        ></b-form-input>
        <b-form-invalid-feedback :state="userEmailValidation">
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="userEmailValidation">
        </b-form-valid-feedback>
      </b-form-group>

      <b-form-group id="input-group-4" label="소속기관:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="userAffiliation"
          required
          placeholder="소속기관을 입력해주세요."
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-5" label="휴대폰 번호" label-for="input-5">
        <VuePhoneNumberInput v-model="userPhonenumber" />
      </b-form-group>
    </b-form-group>
    <br/>
    <b-button id="nextButton" v-on:click = "userData">다음</b-button>
    <br/>
    </b-form>
     </b-card-body>
    </b-col>
    </b-row>
    
  </b-card>
   
  </div>
</template>
<script>
  import VuePhoneNumberInput from 'vue-phone-number-input';
  import axios from 'axios';
  var signUpSuccess = '';
  export default {
    name: 'SignUp',
    components: {
      VuePhoneNumberInput,
    },
    data() {
      return {
        show: true,
        userId: '',
        userPassword:'',
        userEmail: '',
        userAffiliation: '',
        userName: '',
        userPhonenumber: '',
        isEditing: false,
      }
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav);
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) {
        if (this.isEditing && signUpSuccess != "success") {
            if (!window.confirm("저장하지 않고 이동하시겠습니까?")) {
                return;
            }
        }
        next();
    },
    watch : {
      userEmail : function(data) {
            this.isEditing = true;
            
        },
      userAffiliation : function(data) {
            this.isEditing = true;
            
      },
      userName : function(data) {
            this.isEditing = true;
            
      },
      userPhonenumber : function(data) {
            this.isEditing = true;
            
      },
      userId : function(data) {
            this.isEditing = true;
            
      },
      userPassword : function(data) {
            this.isEditing = true;
            
      },
    },
    computed: {
      userIdValidation() { //user id validation
        return this.userId.length > 4 && this.userId.length < 13
      },
      userEmailValidation() { // email에는 @이 필수 요소니까 @ 여부로 validation
        return this.userEmail.includes('@') && this.userEmail.includes('.com') || this.userEmail.includes('.kr');
      },
      userPasswordValidation() {
        var pattern1 = /[0-9]/;
        var pattern2 = /[a-zA-Z]/;
        var pattern3 = /[~!@\#$%<>^&*]/;     // 원하는 특수문자 추가 제거
       if(!pattern1.test(this.userPassword)||!pattern2.test(this.userPassword)||!pattern3.test(this.userPassword)){
          return false; //숫자, 영문, 특수문자가 포함되었는지 
       }
        return this.userPassword.length > 7 && this.userPassword.length < 21; // 8~ 20자인지 길이 검증 
      }
    },
    methods: {
      preventNav(event) {
        if (!this.isEditing || signUpSuccess == "success") return;
        event.preventDefault();
        event.returnValue = "";
      },
      async userData() { //user data 넘기기 
        if(!this.userId || !this.userPassword || !this.userEmail || 
          !this.userAffiliation || !this.userName || !this.userPhonenumber){
            alert("정보를 모두 입력해주세요!");
          }
          else {
            const userDataRes = await axios.post("/api/signup", "",
            { 
              params: {
                userId : this.userId,
                userPassword: this.userPassword,
                userEmail : this.userEmail,
                userName: this.userName,
                userAffiliation : this.userAffiliation,
                userPhone : this.userPhonenumber,
              }
            }).then(res => { //여기서 response header 가져와서 
                signUpSuccess = res.headers.signup;
                if(res.headers.signup == "success"){
                  setTimeout(()=> {
                  localStorage.bankState = res.headers.state;
                  this.$router.push({name : "Account", 
                      params : {
                        status : "signup",
                      }});  
                  },500);
                }
                else {
                  alert("아이디가 중복됩니다. 다시 입력해주세요!");
                  this.isEditing = false;
                  location.reload();
                }
            })
            .catch(function(error) {
                if(error.response){
                    alert("아이디가 중복됩니다. 다시 입력해주세요!");
                    this.isEditing = false;
                    location.reload();
                }
            });
            }
      },

    }
  }
</script>
<style>
.overflow-hidden {
    margin-left: 700px;
    margin-top: 30px;
    max-width: 1200px;
}

#nextButton {
  width: 130px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #fff;
  background-color: #4682B4;
  border: 2px solid #4682B4;
  border-radius: 5px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}
#nextButton:hover {
  background-color: #4682B4;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);

}

</style>
