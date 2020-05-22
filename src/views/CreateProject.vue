<template>
    <div id="createProject"> 
      <img id="collection" v-on:click="createCollection" src = "../assets/collectionProject.png"/>
      <img id="labelling" v-on:click="createLabelling" src = "../assets/labellingProject.png"/>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'CreateProject',
    
    methods: {
        createCollection() {
            this.$router.push("/project/collection");
        },
        createLabelling() {
            this.$router.push("/project/labelling");
        }

    }
}
</script>
<style>

#collection {
    width: 500px;
    height: 310px;
    float : left;
    margin-left: 300px;
    margin-top : 100px;
}
#labelling {
    width: 500px;
    height: 300px;
    float : left;
    margin-left: 300px;
    margin-top : 110px;
}
</style>