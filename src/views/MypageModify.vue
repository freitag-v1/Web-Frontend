<template>
    <div class = "MypageModify" style ="overflow:auto">
     <b-card no-body class="overflow-hidden" style="height: auto; margin : auto;">
         <b-row no-gutters>
      <b-col md="6">
        <img src="../assets/modify.png" alt="Image" class="rounded-0"></img>
      </b-col>
       <b-col md="6">
        <b-card-body title="개인 정보 수정">
    <b-form v-if="show">
      <b-form-group
        id="input-group-1"
        label-for="input-1"
      >
      </b-form-group>
      <b-form-group id="input-group-2" label="이름:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="userName"
          required
          placeholder="성함을 입력하세요."
        ></b-form-input>
      </b-form-group>

     <b-form-group id="input-group-3" label="이메일:" label-for="input-3">
      <b-form-input
          id="input-3"
          v-model="userEmail"
          type="email"
          required
          placeholder="이메일을 입력하세요."
        ></b-form-input>
      <b-form-invalid-feedback :state="userEmailValidation">
        이메일 형식 :  xxxx@xx.com
      </b-form-invalid-feedback>
      <b-form-valid-feedback :state="userEmailValidation">
        Looks Good.
      </b-form-valid-feedback>
      </b-form-group>
      <b-form-group id="input-group-4" label="소속 기관:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="userAffiliation"
          required
          placeholder="소속 기관을 입력하세요."
        ></b-form-input>
      </b-form-group>
      </b-form-group>
      <p style="font-weight: lighter; font-size : 20px;">휴대전화 번호 </p>
      <VuePhoneNumberInput v-model="userPhonenumber" />
      <br/>
      <b-button id="saveButton" v-on:click = "modify">저장</b-button>
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

var modifySuccess = '';

  export default {
    name: 'MypageModify',
    components: {
      VuePhoneNumberInput,
    },
    data() {
      return {
        user: '',
        show: true,
        userEmail: '',
        userAffiliation: '',
        userName: '',
        userPhonenumber: '',
        isEditing: false,

      }
    },
    async beforeCreate() {
      var state = await localStorage.getItem('bankState');
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      this.user = this.$route.params.user;
    },
    computed: {
      userEmailValidation() { // email에는 @이 필수 요소니까 @ 여부로 validation, 그리고 .com 과 .kr 로 끝나는지를 확인
        return this.userEmail.includes('@') && this.userEmail.includes('.com') || this.userEmail.includes('.kr');
      },
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav);
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) {
        if (this.isEditing && modifySuccess != "success") {
            if (!window.confirm("저장하지 않고 이동하시겠습니까?")) {
                return
            }
        }
        next();
    },
    watch : {
      userEmail : function(data) {
            this.isEditing = true
            
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
    },
    methods: {
        preventNav(event) {
                if (!this.isEditing) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        async modify() {
            //비밀번호 - 이거 지우고 붙이는 역할
            var parseNumber = this.userPhonenumber.split('-');
            var parsePhoneNumber = parseNumber[0].concat(parseNumber[1]);
            parsePhoneNumber = parsePhoneNumber.concat(parseNumber[2]);

            var userNamedata = this.userName != '' ? this.userName : this.user.userName;
            var userEmaildata = this.userEmail != '' ? this.userEmail : this.user.userEmail;
            var userAffiliationdata = this.userAffiliation != '' ? this.userAffiliation : this.user.userAffiliation;
            var userPhonedata = parsePhoneNumber != null ? parsePhoneNumber : this.user.userPhone;
            const modifyRes = await axios.put("/api/mypage/update","",{
              params : {
                userName : userNamedata,
                userEmail : userEmaildata,
                userAffiliation : userAffiliationdata,
                userPhone : userPhonedata,
              }
              }
            )
            .then(res => {
              modifySuccess = res.headers.update;
              if(res.headers.update == "success"){
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
    },
  }
</script>
<style>
#saveButton {
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
#saveButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
</style>