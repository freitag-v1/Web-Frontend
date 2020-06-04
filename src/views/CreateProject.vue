<template>
    <div id="createProject"> 
    <br>
     
    <h2>{{'< '+ userId + "님의 작업 의뢰 페이지 >"}}</h2>
    <h3>*이 페이지는 의뢰자가 방구석수집가에게 의뢰하고자 하는 작업을 생성하는 공간입니다.</h3>
      <img id="collection" v-on:click="createCollection" src = "../assets/collectionProject.png"/>
      <img id="labelling" v-on:click="createLabelling" src = "../assets/labellingProject.png"/>
      <!--<img id="collection_labelling"  src = "../assets/collectionandlabelling.png"/>-->
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
    width: 500px;
    height: 280px;
    float : left;
    margin-left: 400px;
    margin-right: 160px;
    margin-top : 75px;
}
#labelling {
    width: 500px;
    height: 300px;
    float : left;
    margin-top : 60px;
}
#collection_labelling{
    width: 490px;
    height: 300px;
    float : left;
    margin-top : 80px;
}


</style>