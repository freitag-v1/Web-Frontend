<template>
  <div class="home">
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
          <b-icon id ="searchIcon" icon="search" scale="1.5" shift-v="1.25" type = "submit" aria-hidden="true"></b-icon>
        </b-nav-form>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#" v-if="loginStatus">Profile</b-dropdown-item>
          <b-dropdown-item-button v-on:click = "logout" v-if="loginStatus">Sign Out</b-dropdown-item-button>
          <b-dropdown-item href="login" v-if="!loginStatus">Sign In</b-dropdown-item>
          <b-dropdown-item href="signup" v-if="!loginStatus">Sign Up</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <div class ="carousel-fade">
    <b-carousel
    style="text-shadow: 0px 0px 2px #000"
    fade
    indicators
    img-width="1024"
    img-height="480"
  >
    <b-carousel-slide
      caption="First slide"
      img-src="https://picsum.photos/1024/480/?image=10"
    ></b-carousel-slide>
    <b-carousel-slide
      caption="Second Slide"
      img-src="https://picsum.photos/1024/480/?image=12"
    ></b-carousel-slide>
    <b-carousel-slide
      caption="Third Slide"
      img-src="https://picsum.photos/1024/480/?image=22"
    ></b-carousel-slide>
  </b-carousel><router-view></router-view>
</div>
<div class = "ranking">
  <Ranking></Ranking>
</div>


 
    
    <!--<Login id = "login" v-if="!loginStatus" @login-event="loginMethod"/> <!-- emit해서 login에서 로그인 상태 던지고 home에서 이거 받아서 할 수 있도록> -->
 
    

</div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import Ranking from '@/components/Ranking.vue'
import SignUp from '@/views/SignUp.vue'
export default {
  name: 'Home',
  components: {
    Ranking
  },
  data() {
    return {
      loginStatus: '',
  }
  },
  async beforeCreate() {
      this.loginStatus = await localStorage.getItem('loginState');
      //console.log("ggggg"+this.loginStatus);
      //alert(this.loginStatus);
  },
   methods : {
     logout: function() {
        this.$store.dispatch('LOGOUT');
        alert("로그아웃 완료");
        setTimeout(()=> {
                location.reload();
                           //alert("hello");
                },2000);   
          }
     //alert(this.$store.getters.getLoginStatus);
  },

}
</script>
<style>
b-navber-nav {
  color: #21a2b7;
  font-size : 30px;
}
.navbar {
  height: 65px;
  width: 70%;
  margin-left : 15%;
}
.bar-font {
  color : red;
}
.overflow-hidden {
  margin-left: 300px;

}
.carousel-fade {
  width: 800px;
  margin-top: 30px;
  margin-left: 150px;
  float:left;
}
.ranking{
  width : 100%;
  vertical-align: middle;
  margin-top: 30px;
  margin-left: 100px;
  float:left;
}
#searchIcon{
  margin:4px;
}





</style>

