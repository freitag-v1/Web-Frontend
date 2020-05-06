<template>
  <div id="app"> 
      <img id="logo" v-on:click="goHome" src = "./assets/collectorLogo.jpg"/>
      <router-view/>
  </div>
</template>
<script>
  export default {
  name: 'App',
  methods : {
    goHome() {
      this.$router.push("/");
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
