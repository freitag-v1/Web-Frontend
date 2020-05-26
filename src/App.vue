<template>
  <div id="app"> 
      <img id="logo" v-on:click="goHome" src = "./assets/collectorLogo.jpg"/>
          <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">
    방구석 수집가</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-on:click="createProject" style="font-size: 18px;" right>
          <!--<b-dropdown-item href="project" style="font-size: 18px;" >Project List</b-dropdown-item>-->
        작업 의뢰</b-nav-item>
        <b-nav-item v-on:click="startProject" link-classes="bar-font" style="font-size: 18px;">작업 시작</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <!--<b-icon id ="searchIcon" icon="search" scale="1.5" shift-v="1.25" type = "submit" aria-hidden="true"></b-icon>-->
           
        </b-nav-form>
         
        <b-nav-item id = "userIcon" v-if="loginStatus"><b-icon  icon="person" variant="primary"></b-icon> {{userId + "님"}}</b-nav-item>
        <b-nav-item-dropdown  v-if="loginStatus" text="작업 기록" right>
          <b-dropdown-item href="/project/request">의뢰 작업 목록</b-dropdown-item>
          <b-dropdown-item href="/project/complete">완료 작업 목록</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="/mypage" v-if="loginStatus" >Profile </b-nav-item> 
        <b-nav-item v-on:click = "logout" v-if="loginStatus">Sign Out</b-nav-item>
        <b-nav-item href="/login" v-if="!loginStatus">Sign In | </b-nav-item>
        <b-nav-item href="/signup"  v-if="!loginStatus">Sign Up</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <br>
      <router-view :key="$route.fullPath"/>
  </div>
</template>
<script>
  export default {
  name: 'App',
  data() {
    return {
      loginStatus: '',
      userId: '',
    }
  },
  async beforeCreate() {
      this.loginStatus = await localStorage.getItem('loginState');
      this.userId = await localStorage.getItem('userId');
      
  },
  methods : {
    goHome() {
      this.$router.push("/");
    },
    createProject() {
        this.$router.push("/newProject");
    },
    logout: function() {
        this.$store.dispatch('LOGOUT');
        alert("로그아웃 완료");
        setTimeout(()=> {
                location.reload();
                           //alert("hello");
                },2000);   
      },
      startProject() {
        this.$router.push("/startProject");
      },
      //파라미터를 router params로 보내면 페이지를 벗어난 경우 데이터가 유지가 안되기 때문에 localstorage에 파라미터를 담아서 진행을 한ㄷ.
      
        // boundingBoxProject: function() {
        //   var params = {'projectType': 'Labelling','workType' : "boundingBox",
        //         'difficulty': -1,'subject': ""};
        //   localStorage.projectList = JSON.stringify(params);
        //   this.$router.push({name : "Project"});
        // },
        // classificationProject: function() {
        //   var params = {'projectType': 'Labelling','workType' : "classification",
        //         'difficulty': -1,'subject': ""};
        //   localStorage.projectList = JSON.stringify(params);
        //   this.$router.push({name : "Project"});
        // }
  }
}
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

#app {
  font-family:'Jeju Gothic', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#logo {
  width: 700px;
  height: 200px;

}



</style>
