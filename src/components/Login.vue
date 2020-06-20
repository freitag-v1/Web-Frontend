<template>
  <div class="login">
        <form class="form-signin">
            <h3 class="form-signin-heading">로그인</h3>
            <input id ="id" v-model ="userId" type="text" class="form-control" name="username" placeholder="아이디를 입력해주세요." required="" autofocus="" v-on:keyup.enter="login"/>
            <br>
            <input id ="pwd" v-model="password" type="password" class="form-control" name="password" placeholder="비밀번호를 입력해주세요." required="" v-on:keyup.enter="login"/> 
            <br>
            <br>
    <div class = "signButton">
      <b-button pill id = "loginButton" v-on:click = "login">로그인</b-button>
      <b-button pill id ="signupButton" href="signup">회원가입</b-button>
      </div>
    </form>
  </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      userId:'',
      password:''
    }
  },
  methods: {
    async login() { 
       if(this.userId == "" || this.password == "")
        {
          alert("아이디와 비밀번호를 모두 입력해주세요!");
        }
        //비밀번호를 그대로 전송하기 때문에 노출될 가능성이 높아서 여기서도 암호화를 하는 것이 어떨까
        else {
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
#signupButton {
  width: 130px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: white;
  background-color: #FA8072;
  border: 2px solid #FA8072;
  border-radius: 5px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

#loginButton {
  width: 130px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: white;
  background-color: #4682B4;
  border: 2px solid #4682B4;
  border-radius: 5px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}
#signupButton:hover {
  background-color: #FA8072;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#loginButton:hover {
  background-color: #4682B4;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}


.form-signin {
  max-width: 700px;
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
	  font-size: 18px;
	  height: 500px;
	  padding: 10px;
		@include box-sizing(border-box);

		&:focus {
		  z-index: 2;
		}
	}
}
#id{
	padding: 10px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
#pwd{
  padding: 10px;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}


</style>