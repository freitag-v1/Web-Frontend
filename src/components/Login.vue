<template>
  <div class="login">
        <form class="form-signin">
            <h2 class="form-signin-heading">로그인</h2>
            <input id ="email" v-model ="userId" type="text" class="form-control" name="username" placeholder="아이디를 입력해주세요." required="" autofocus=""/>
            <br>
            <input id ="pwd" v-model="password" type="password" class="form-control" name="password" placeholder="비밀번호를 입력해주세요." required=""/> 
            <br>
            <br>
    <div class = "signButton">
      <b-button pill v-on:click = "login" id="login" variant="outline-primary">로그인</b-button>

      <b-button pill id ="signupbutton" href="signup" variant="outline-primary">회원가입</b-button>
      </div>
    </form>
  </div>
  </div>

</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
var loginStatus = false;
var userToken = '';
export default {
  name: 'login',
  data() {
    return {
      userId:'',
      password:''
    }
  },
  methods: {
    async login() { //비밀번호 hidden 으로 가능한지 
       if(this.userId == "" || this.password == "")
        {
          alert("Please enter your ID or Password!");
        }
        //else해서 axios.post("/api/login", {id:userId, pwd: this.password}) 이렇게 보내기
        else {
          console.log("/api/user/login?userId="+this.userId+"&userPassword="+this.password);
          var userId = this.userId;
          var password = this.password;
          this.$store.dispatch('LOGIN',{userId,password});
          
         
        }
    },
  }
}

</script>



<style>
.signButton {
  height: 100%;
  display: flex;
  align-items: right;
  justify-content: center;
}
button {
  width: 100px;
  height: 40px;
  font-family: 'Arial', sans-serif;
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

  
}
button:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;

}


.form-signin {
  max-width: 500px;
  padding: 15px 35px 45px;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.1);  

  .form-signin-heading,
	.checkbox {
	  margin-bottom: 30px;
	}

	.checkbox {
	  font-weight: normal;
	}

	.form-con0trol {
	  position: relative;
	  font-size: 16px;
	  height: 300px;
	  padding: 10px;
		@include box-sizing(border-box);

		&:focus {
		  z-index: 2;
		}
	}
}
#email{
	padding: 10px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
#pwd{
    padding: 10px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}
#signupbutton {
  font-size: 18px;
}


</style>