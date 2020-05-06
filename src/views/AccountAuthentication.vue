<template>
<div class ="account">
    <div class ="beforeAuthentication" v-if="!Authentication">
        <br/>
        <img id="accountLogo" src="../assets/accountLogo.png"/>
        <br/>
        <b-button class="button" variant="outline-primary" style="font-size: 18px; font-weight: bold">계좌 인증</b-button>
        <br/>
        <br/>
        <b-button href='/signup' class="button" variant="outline-primary" style="font-size: 18px;">Prev</b-button>
        <b-button class="button" v-on:click ="signUpComplete" variant="outline-primary" style="font-size: 18px;">complete</b-button>
    </div>
    <div class = "afterAuthentication" v-if="Authentication">
        <SignUpComplete></SignUpComplete>
        <router-view></router-view>
    </div>
</div>
</template>
<script>
import SignUpComplete from '../components/SignUpComplete';

  export default {
    name: 'SignUp',
    components: {
      SignUpComplete,
    },
    data() {
        return {
            Authentication: false,
        }
    },
    methods: {
        signUpComplete() {
            var count = 3;
            this.Authentication = true;
            alert("3초 뒤에 로그인 페이지로 이동합니다.");
            setTimeout(()=> {
                this.$router.push("/login");
                },3000);   
          
        }
    }

  }
</script>
<style>


#accountLogo {
    margin: auto;
    max-width:200px;
    max-height: 70px;
}
.button {
  width: 150px;
  height: 40px;
  text-transform: uppercase;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  font-family:"Verdana";
}
.button:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
</style>