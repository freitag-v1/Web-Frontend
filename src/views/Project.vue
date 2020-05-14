<template>
    <div class ="projectList">
        <img id="projectLogo" src ="../assets/projectList.png"/>
        <b-button  href="/newProject" style="margin-top: 10px; ">
            Create
        </b-button>
        <hr class = "bar">
        <!--<b-list-group-item id ="projectNav" variant="info" class="d-flex justify-content-between align-items-center">
                Project Name
                <b-badge variant="outline-primary"> 의뢰자 </b-badge>
            </b-list-group-item>
        <b-list-group class="list-group" v-for="project in projectList">
            <b-list-group-item class="d-flex justify-content-between align-items-center">
                {{ project.name }}
                <b-badge variant="outline-primary"> {{ project.userId }}</b-badge>
            </b-list-group-item>

        </b-list-group>-->
        <div class="overflow-auto">
            <b-table
            id="my-table"
            :items="projectList"
            :per-page="perPage"
            :current-page="currentPage"
            :fields="fields"
            @row-dbclicked="moveProject"
            small
            >
            <template v-slot:cell(show_details)="row">
                <b-button size="sm" v-on:click="moveProject(row.item)" class="mr-2">
                    {{ row.item.name }}
                </b-button>
            </template>
            </b-table>
            <br>
            <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            align="center"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            ></b-pagination>

            <p class="mt-3">Current Page: {{ currentPage }}</p>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'Project',
  data() {
      return {
          projectList: [
              {name : 'test1', userId : 'nahyun', workType : 'collection'},
              {name : 'test2', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test3', userId : 'nahyun', workType : 'collection'},
              {name : 'test4', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test5', userId : 'nahyun', workType : 'collection'},
              {name : 'test6', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test7', userId : 'nahyun', workType : 'classification'},
              {name : 'test8', userId : 'nahyun', workType : 'collection'},
              {name : 'test9', userId : 'nahyun', workType : 'classification'},
              {name : 'test10', userId : 'nahyun', workType : 'collection'},
              {name : 'test11', userId : 'nahyun', workType : 'classification'},
              {name : 'test12', userId : 'nahyun', workType : 'collection'},
              {name : 'test13', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test14', userId : 'nahyun', workType : 'classification'},
              {name : 'test15', userId : 'nahyun', workType : 'collection'},
              {name : 'test16', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test17', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test18', userId : 'nahyun', workType : 'collection'},
              {name : 'test19', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test20', userId : 'nahyun', workType : 'collection'},
              {name : 'test1', userId : 'nahyun', workType : 'collection'},
              {name : 'test2', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test3', userId : 'nahyun', workType : 'collection'},
              {name : 'test4', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test5', userId : 'nahyun', workType : 'collection'},
              {name : 'test6', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test7', userId : 'nahyun', workType : 'classification'},
              {name : 'test8', userId : 'nahyun', workType : 'collection'},
              {name : 'test9', userId : 'nahyun', workType : 'classification'},
              {name : 'test10', userId : 'nahyun', workType : 'collection'},
              {name : 'test11', userId : 'nahyun', workType : 'classification'},
              {name : 'test12', userId : 'nahyun', workType : 'collection'},
              {name : 'test13', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test14', userId : 'nahyun', workType : 'classification'},
              {name : 'test15', userId : 'nahyun', workType : 'collection'},
              {name : 'test16', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test17', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test18', userId : 'nahyun', workType : 'collection'},
              {name : 'test19', userId : 'nahyun', workType : 'Image Bounding Box'},
              {name : 'test20', userId : 'nahyun', workType : 'collection'},
          ],
          fields: [{key : 'name', label: '프로젝트 이름'},{key : 'userId', label: '의뢰자'}, 'workType', 'show_details'],
          workType:'',
          dataType:'',
          perPage : 10,
          currentPage : 1,
      }
  },
  async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
        //라벨링 작업 프로젝트 
      if(this.$route.params.projectType == "Labelling") {
          //console.log(this.$route.params.difficulty, this.$route.params.workType, this.$route.params.subject);
         
          const projectListRes = await axios.get("/api/project/list/labelling", {
              params : {
                  dataType : this.$route.params.workType,
                  difficulty : this.$route.params.difficulty[0],
                  subject : this.$route.params.subject,
              }
          });
            if(projectListRes.headers.search == "success"){
                this.projectList = projectListRes.data;
            }
            else {
                alert("검색한 프로젝트가 존재하지 않습니다.");
            }
          
            // if(this.$route.params.workType != null) {// 작업 종류 검색한 경우 
            //     //alert("라벨링 - 작업 종류");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : this.$route.params.workType,
            //     }});
            //     this.projectList = projectListRes.data;
            // }
            // else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
            //     //alert("라벨링 - 데이터 종류");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'labelling',
            //         dataType : this.$route.params.dataType,
            //     }});
            //     this.projectList = projectListRes.data;
            
            // }
            // else if(this.$route.params.difficulty != null){ //난이도를 선택한 경우 
            //     //alert("라벨링 - 난이도");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'labelling',
            //         difficulty : this.$route.params.difficulty,
            //     }});
            //     this.projectList = projectListRes.data;
            // }
            // //라벨링 프로젝트 목록 전체 
            // else {
            //     //alert("라벨링");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'labelling',
            //     }});
            //     this.projectList = projectListRes.data;
            // }
        
      }
      //수집 프로젝트 리스트 
        if(this.$route.params.projectType == "Collection") {
            console.log(this.$route.params.difficulty, this.$route.params.dataType, this.$route.params.subject);
             const projectListRes = await axios.get("/api/project/list/collection", {
              params : {
                  dataType : this.$route.params.dataType,
                  difficulty : this.$route.params.difficulty,
                  subject : this.$route.params.subject,
              }
            });
            if(projectListRes.headers.search == "success"){
                this.projectList = projectListRes.data;
            }
            else {
                alert("검색한 프로젝트가 존재하지 않습니다.");
            }

            // if(this.$route.params.subject != null) {// 주제 검색한 경우 
            //     //alert("수집 - 주제 검색");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'collection',
            //         subject : this.$route.params.subject,
            //     }});
            //     this.projectList = projectListRes.data;
            // }
            // else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
            //     //alert("수집 - 데이터 종류");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'collection',
            //         dataType : this.$route.params.dataType,
            //     }});
            //     this.projectList = projectListRes.data;
            
            // }
            // else if(this.$route.params.difficulty != null) { //난이도를 선택한 경우 
            //     //alert("수집 - 난이도");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'collection',
            //         difficulty : this.$route.params.difficulty,
            //     }});
            //     this.projectList = projectListRes.data;
            // }
            // else { //수집 프로젝트 검색
            // //alert("수집");
            //     const projectListRes = await axios.get("/api/project", {
            //     params: {
            //         workType : 'collection',
            //     }});
            //     this.projectList = projectListRes.data;
            // }
        }

  },
  computed: {
      rows() {
        return this.projectList.length;
      }
    },
    methods : {
        moveProject(detailItem){
            alert(detailItem); // 자세히 보고싶은 프로젝트를 보여줄 수 있도록 
        }
    }


}
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/hanna.css);
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

#projectLogo {
    width: 250px;
}
.list-group {
    max-width: 1200px;
    margin: auto;
    font-family: 'Jeju Gothic', sans-serif;
    font-size: 18px;
}
.bar {
    border: none;
    border: 2px dashed tomato;
}
#projectNav{
    max-width: 1200px;
    margin: auto;
    font-size: 30px;
    font-family: 'Hanna', sans-serif;
}

</style>