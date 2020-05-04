<template>
  <div id="app"> 
      <img id="logo" src = "./assets/collectorLogo.jpg"/>
      <router-view/>
  </div>
</template>

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
