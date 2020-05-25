<template>
    <div id="createProject"> 
    <br>
     
    <h1>{{'< '+ userId + "님의 작업 의뢰 >"}}</h1>
      <img id="collection" v-on:click="createCollection" src = "../assets/collectionProject.png"/>
      <img id="labelling" v-on:click="createLabelling" src = "../assets/labellingProject.png"/>
      <img id="collection_labelling"  src = "../assets/collectionandlabelling.png"/>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'CreateProject',
    data() {
        return {
            userId : '',
        }
    },
    async created(){
        this.userId = await localStorage.getItem('userId');
    },
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

#createProjectLogo {
    width: 250px;
    height : 100px;
}
#collection {
    width: 450px;
    height: 310px;
    float : left;
    margin-left: 100px;
    margin-right: 160px;
    margin-top : 75px;
}
#labelling {
    width: 430px;
    height: 280px;
    float : left;
    margin-right: 180px;
    margin-top : 100px;
}
#collection_labelling{
    width: 490px;
    height: 300px;
    float : left;
    margin-top : 80px;
}


</style>