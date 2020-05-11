<template>

    <div class = "signUpForm" style ="overflow:auto">
     <b-card no-body class="overflow-hidden" >
         <b-row no-gutters>
      <b-col md="6">
        <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img>
      </b-col>
       <b-col md="6">
        <b-card-body title="Modify Information">
    <b-form v-if="show">
      <b-form-group
        id="input-group-1"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >

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
      <b-button class="button" v-on:click = "accountAuthentication" variant="outline-primary">계좌 변경</b-button>
      <b-button class="button" v-on:click = "modify" variant="outline-primary">Save</b-button>
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


var user = null;

  export default {
    name: 'MypageModify',
    components: {
      VuePhoneNumberInput,
    },
    data() {
      return {
        show: true,
        userEmail: '',
        userAffiliation: '',
        userName: '',
        userPhonenumber: '',

      }
    },
    async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
      user = this.$route.params.user;
    },
    computed: {
      userEmailValidation() { // email에는 @이 필수 요소니까 @ 여부로 validation, 그리고 .com 과 .kr 로 끝나는지를 확인
        return this.userEmail.includes('@') && this.userEmail.includes('.com') && this.userEmail.includes('.kr');
      },
    },
    methods: {
        async modify() {
            console.log(user.userName, user.userEmail, user.userAffiliation, user.userPhone);
            var userNamedata = this.userName != '' ? this.userName : user.userName;
            var userEmaildata = this.userEmail != '' ? this.userEmail : user.userEmail;
            var userAffiliationdata = this.userAffiliation != '' ? this.userAffiliation : user.userAffiliation;
            var userPhonedata = this.userPhonenumber != null ? this.userPhonenumber : user.userPhone;
            console.log(userNamedata,userEmaildata,userAffiliationdata,userPhonedata);
            const modifyRes = await axios.put("/api/mypage/update?userName="+userNamedata+"&userEmail="+userEmaildata+"&userAffiliation="+userAffiliationdata+"&userPhone="+userPhonedata
              // params : {
              //   userId: userId,
              //   userName : userNamedata,
              //   userEmail : userEmaildata,
              //   userAffiliation : userAffiliationdata,
              //   userPhone : userPhonedata,
              // }
            )
            .then(res => {
              console.log(res.data);
              if(res.data == "수정 완료"){
                
                  alert("수정이 완료되었습니다.");
                  setTimeout(()=> {
                    this.$router.push("/");
                    },2000);  
              }
              else {
                alert("수정을 실패하였습니다.");
              }
            })


        },
        async accountAuthentication() {
            var state = await localStorage.getItem('bankState');
            window.open("https://testapi.openbanking.or.kr/oauth/2.0/authorize?auth_type=0&scope=login+transfer+inquiry&response_type=code&redirect_uri=http%3a%2f%2fwodnd999999.iptime.org%3a8080%2fexternalapi%2fopenbanking%2foauth%2ftoken&lang=kor&state="+state+"&client_id=XXyvh2Ij7l9rss0HAVObS880qY3penX57JXkib9q");

        }
    },
  }
</script>