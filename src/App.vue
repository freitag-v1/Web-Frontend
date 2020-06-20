<template>
  <div id="app">
    <img id="logo" v-on:click="goHome" src="./assets/collectorLogo.jpg" />
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="#">방구석 수집가</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-on:click="createProject" style="font-size: 20px;" right
            >작업 의뢰</b-nav-item
          >
          <b-nav-item
            v-on:click="startProject"
            link-classes="bar-font"
            style="font-size: 20px;"
            >작업 시작</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form></b-nav-form>

          <b-nav-item id="userIcon" v-if="loginStatus">
            <b-icon id="userEmoji" icon="person"></b-icon>
            {{ userId + "님" }}
          </b-nav-item>
          <b-nav-item-dropdown v-if="loginStatus" text="작업 기록" right>
            <b-dropdown-item href="/project/request"
              >의뢰한 작업 목록</b-dropdown-item
            >
            <b-dropdown-item href="/project/complete"
              >완료한 작업 목록</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item href="/mypage" v-if="loginStatus"
            >사용자 정보 조회</b-nav-item
          >
          <b-nav-item v-on:click="logout" v-if="loginStatus"
            >로그아웃</b-nav-item
          >
          <b-nav-item href="/login" v-if="!loginStatus">로그인 |</b-nav-item>
          <b-nav-item href="/signup" v-if="!loginStatus">회원가입</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <br />
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script>
const options = {
  transformAssetUrls: {
    video: ["src", "poster"],
    source: "src",
    img: "src",
    image: "xlink:href",
  },
};
export default {
  name: "App",

  data() {
    return {
      loginStatus: "",
      userId: "",
    };
  },
  async beforeCreate() {
    this.loginStatus = await localStorage.getItem("loginState");
    this.userId = await localStorage.getItem("userId");
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    createProject() {
      this.$router.push("/newProject");
    },
    logout() {
      this.$store.dispatch("LOGOUT");
      alert("로그아웃 완료");
      setTimeout(() => {
        location.reload();
      }, 2000);
    },
    startProject() {
      this.$router.push("/startProject");
    },
  },
};
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

#app {
  font-family: "Jeju Gothic", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
}
#logo {
  width: 700px;
  height: 200px;
}
#userEmoji {
  color: #4682b4;
}
</style>
