<template>
    <div class = "startProject">
    <br>
        <h2>{{'< '+ userId + "님의 작업 시작 페이지 >"}}</h2>
        <h3>*이 페이지는 작업자가 방구석수집가에서 제공되는 작업을 진행하는 공간입니다.</h3>
        <img id="collection" style = "height : 280px; width : 500px;" v-on:click=" collectionProject" src = "../assets/collectionProject.png"/>
        <img id="labelling" style = "margin-top: 60px;height: 300px; width : 500px;" v-on:click="labellingProject" src = "../assets/labellingProject.png"/>
        <!--<img id="collection_labelling"  src = "../assets/collectionandlabelling.png"/>-->
    </div>

</template>
<script>
import axios from 'axios';
export default {
  name: 'StartProject',
    data() {
        return {
            userId : '',
        }
    },
    async created(){
        this.userId = await localStorage.getItem('userId');
    },
    methods: {
        collectionProject: function() {
          var params = {'projectType': 'Collection','dataType' : "",
                'difficulty': -1,'subject': ""};
          localStorage.projectList = JSON.stringify(params);
          this.$router.push({name : "Project"});
        },
        labellingProject: function() {
            var params = {'projectType': 'Labelling','workType' : "",
                 'difficulty': -1,'subject': ""};
            localStorage.projectList = JSON.stringify(params);
            this.$router.push({name : "StartLabelling"});
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
</script>
<style>
#collection:hover {
    background-color: #28adfc;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
    border-radius: 8px;
}
#labelling:hover {
    background-color: #28adfc;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
    border-radius: 8px;
}
</style>