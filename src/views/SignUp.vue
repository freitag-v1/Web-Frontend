<template>

    <div class = "signUpForm" style ="overflow:auto">
     <b-card no-body class="overflow-hidden" >
         <b-row no-gutters>
      <b-col md="6">
        <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img>
      </b-col>
       <b-col md="6">
        <b-card-body title="Sign Up">
    <b-form v-if="show">
      <b-form-group
        id="input-group-1"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
    <b-form  @submit.stop.prevent>
      <label for="feedback-user">Your ID</label>
      <b-input v-model="userId" :state="userIdValidation" id="feedback-user"></b-input>
      <b-form-invalid-feedback :state="userIdValidation">
        Your user ID must be 5-12 characters long.
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="userIdValidation">
        Looks Good.
      </b-form-valid-feedback>
     </b-form>
        
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

      </b-form-group>
      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="userName"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

     <b-form-group id="input-group-3" label="Your Email:" label-for="input-3">
      <b-form-input
          id="input-3"
          v-model="userEmail"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      <b-form-invalid-feedback :state="userEmailValidation">
        Email format must be xxxx@xx.com
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="userEmailValidation">
        Looks Good.
      </b-form-valid-feedback>
      </b-form-group>

      <b-form-group id="input-group-4" label="Your Affiliation:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="userAffiliation"
          required
          placeholder="Enter Affiliation"
        ></b-form-input>
      </b-form-group>
      </b-form-group>
      <p>Your PhoneNumber</p>
      <VuePhoneNumberInput v-model="userPhonenumber" />
      <br/>
       <!--<div>
        <label for="datepicker-placeholder">Date picker with placeholder</label>
        <b-form-datepicker id="datepicker-placeholder" placeholder="Choose a date" local="en"></b-form-datepicker>
      </div>-->
      <b-button class="button" v-on:click = "userData" variant="outline-primary">Next</b-button>
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
      }
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
        NextPage() {
        alert(this.page);
        //location.reload();
        this.page++;
        return 
      },
      PrevPage() {
        alert(this.page);
        //location.reload();
        return this.page--;
      },
      async userData() { //user data 넘기기 
        if(!this.userId || !this.userPassword || !this.userEmail || 
          !this.userAffiliation || !this.userName || !this.userPhonenumber){
            alert("정보를 모두 입력해주세요!");
          }
          else {
            //console.log(typeof(this.userId),typeof(this.userPassword), typeof(this.userEmail),typeof(this.userName), typeof(this.userAffiliation),typeof(this.userPhonenumber));
        const userDataRes = await axios.get("/api/signup",  
        { params: {
            userId : this.userId,
            userPassword: this.userPassword,
            userEmail : this.userEmail,
            userName: this.userName,
            userAffiliation : this.userAffiliation,
            userPhone : this.userPhonenumber,
        }}).then(res => { //여기서 response header 가져와서 
            if(res.headers.update == "success"){
              setTimeout(()=> {
              localStorage.bankState = res.headers.state;
              this.$router.push("/signup/account");
                  console.log(res.headers.state); //state 저장
                  
              },500);
            }
            else {
               alert("아이디가 중복됩니다. 다시 입력해주세요!");
              location.reload();
            }
        })
        .catch(function(error) {
            if(error.response){
                alert("아이디가 중복됩니다. 다시 입력해주세요!");
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
    margin-left: 1000px;
    margin-top:30px;
    max-width: 1200px;
}
.button {
  width: 100px;
  height: 40px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  font-family: "Verdana";
}
.button:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;

}

</style>
