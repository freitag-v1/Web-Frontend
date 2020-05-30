<template>
    <div class = "startProject">
    <br>
        <h1>{{'< '+ userId + "님의 작업 시작 >"}}</h1>
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
</style>