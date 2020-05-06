<template>
  <div class="login">
    <div class ="wrapper">
        <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">
    Collector In Room</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#" link-classes="bar-font">Project</b-nav-item>
        <b-nav-item href="#" link-classes="bar-font">Colletion</b-nav-item>
        <b-nav-item-dropdown text="Labelling" right>
          <b-dropdown-item href="#">Image Bounding Box</b-dropdown-item>
          <b-dropdown-item href="#">Classification</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-icon icon="search" scale="1.5" shift-v="1.25" type = "submit" aria-hidden="true"></b-icon>
        </b-nav-form>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
        <form class="form-signin">
            <h2 class="form-signin-heading">Please login</h2>
            <input id ="email" v-model ="userId" type="text" class="form-control" name="username" placeholder="Email Address" required="" autofocus=""/>
            <br>
            <input id ="pwd" v-model="password" type="password" class="form-control" name="password" placeholder="Password" required=""/> 
            <br>
            <label class="checkbox">
            <br>
            <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe"> Remember me</label>
            <br>
            <br>
    <div class = "signButton">
      <b-button pill v-on:click = "login" id="login" variant="outline-primary">Login</b-button>

      <b-button pill id ="signupbutton" href="signup" variant="outline-primary">Register</b-button>
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
          console.log("/api/login?userId="+this.userId+"&userPassword="+this.password);
          var userId = this.userId;
          var password = this.password;
          this.$store.dispatch('LOGIN',{userId,password});
          console.log(this.$store.getters.getLoginState);
          if(this.$store.getters.getLoginState != null) {
              setTimeout(()=> {
                            this.$router.push("/");
                           //alert("hello");
                        },2000);   
          }
          
         
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