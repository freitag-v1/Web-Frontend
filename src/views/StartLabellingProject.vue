<template>
    <div class = "startLabelling">
        <h1>{{'< '+ userId + "님의 라벨링 작업 시작 >"}}</h1>
        <img id = "classification" v-on:click="classificationProject" src = "../assets/classificationLogo.png"/>
        <img id = "bounding" v-on:click="boundingBoxProject" src = "../assets/imageBoundingBoxLogo.png"/>
    </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'StartLabelling',
    data() {
        return {
            userId : '',
        }
    },
    async created(){
        this.userId = await localStorage.getItem('userId');
    },
    methods: {
        classificationProject: function() { //분류 같은 경우는 프로젝트에 상관없이 진행이 되기 때문에 이렇게 진행을 한다. 
        //   var params = {'projectType': 'Collection','dataType' : "",
        //         'difficulty': -1,'subject': ""};
        //   localStorage.projectList = JSON.stringify(params);
          alert("3초 뒤에 분류 작업이 시작이 됩니다.");
          setTimeout(()=> {       
              this.$router.push({name : "Classification"});
            },3000);  
          
        },
        boundingBoxProject: function() {
            var params = {'projectType': 'Labelling','workType' : "boundingBox",
                 'difficulty': -1,'subject': ""};
            localStorage.projectList = JSON.stringify(params);
            this.$router.push({name : "Project"});
        },
        // boundingBoxProject: function() {
        //   var params = {'projectType': 'Labelling','workType' : "boundingBox",
        //         'difficulty': -1,'subject': ""};
        //   localStorage.projectList = JSON.stringify(params);
        //   this.$router.push({name : "Project"});
        // },

    }
}
</script>
<style>
#classification{
    width: 550px;
    height : 340px;
}
#bounding{
    margin-left : 100px;
    width : 550px;
    height : 370px;
    margin-top : 30px;
}
</style>
