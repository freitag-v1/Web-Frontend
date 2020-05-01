<template>
  <div class="home">
    <div class="img">
        <div class="content"> 
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

        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#" v-if="loginStatus">Profile</b-dropdown-item>
          <b-dropdown-item href="#" v-if="loginStatus">Sign Out</b-dropdown-item>
          <b-dropdown-item href="login" v-if="!loginStatus">Sign In</b-dropdown-item>
          <b-dropdown-item href="#" v-if="!loginStatus">Sign Up</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
    <Login id = "login" v-if="!loginStatus"/>
    <router-view v-if="!loginStatus"></router-view>  
</div>
</div>
    
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Login from '@/components/Login.vue'
export default {
  name: 'Home',
  components: {
    Login,
  },
  data() {
    return {
      loginStatus: false,
  }
  }
}
</script>
<style>
.img { 
  position: fixed; 
  top: -50%; 
  left: 0; 
  bottom : 100px;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  /* Preserve aspet ratio */
  min-width: 100%;
  min-height: 100%;
}
.content{
  position: relative;
  top: 50%;
  left:50%;
  transform: translate(-50%, -50%);                                                                   
  font-size: 10px;
  color: #404040;
  z-index: 2;
}
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



</style>

