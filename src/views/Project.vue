<template>
    <div class ="projectList">
        <img id="projectLogo" src ="../assets/projectList.png"/>
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
            small
            ></b-table>
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
          fields: [{key : 'name', label: '프로젝트 이름'},{key : 'userId', label: '의뢰자'}, 'workType'],
          workType:'',
          dataType:'',
          perPage : 10,
          currentPage : 1,
      }
  },
  async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
       console.log(this.$route.params);
      //라벨링 작업 프로젝트 리스트
      //라벨링의 경우 workType이 boundingBox나 분류로 나누어져있는데 라벨링 프로젝트 목록을 보여줘야 하는경우 
      // 정하기 쉽지않으므로 workType : 'labelling' 으로 일단은 보낸단
      if(this.$route.params.projectType == "Labelling") {
            if(this.$route.params.workType != null) {// 작업 종류 검색한 경우 
                //alert("라벨링 - 작업 종류");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : this.$route.params.workType,
                }});
                this.projectList = projectListRes.data;
            }
            else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
                //alert("라벨링 - 데이터 종류");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'labelling',
                    dataType : this.$route.params.dataType,
                }});
                this.projectList = projectListRes.data;
            
            }
            else if(this.$route.params.difficulty != null){ //난이도를 선택한 경우 
                //alert("라벨링 - 난이도");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'labelling',
                    difficulty : this.$route.params.difficulty,
                }});
                this.projectList = projectListRes.data;
            }
            //라벨링 프로젝트 목록 전체 
            else {
                //alert("라벨링");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'labelling',
                }});
                this.projectList = projectListRes.data;
            }
        
      }
      //수집 프로젝트 리스트 
        else if (this.$route.params.projectType == "Collection"){
            if(this.$route.params.subject != null) {// 주제 검색한 경우 
                //alert("수집 - 주제 검색");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'collection',
                    subject : this.$route.params.subject,
                }});
                this.projectList = projectListRes.data;
            }
            else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
                //alert("수집 - 데이터 종류");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'collection',
                    dataType : this.$route.params.dataType,
                }});
                this.projectList = projectListRes.data;
            
            }
            else if(this.$route.params.difficulty != null) { //난이도를 선택한 경우 
                //alert("수집 - 난이도");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'collection',
                    difficulty : this.$route.params.difficulty,
                }});
                this.projectList = projectListRes.data;
            }
            else { //수집 프로젝트 검색
            //alert("수집");
                const projectListRes = await axios.get("/api/projectList", {
                params: {
                    workType : 'collection',
                }});
                this.projectList = projectListRes.data;
            }
        }
        else { //검색한게 없다면 전체
           //alert("전체");
          const projectListRes = await axios.get("/api/projectList");
          this.projectList = projectListRes.data;
          
      }

  },
  computed: {
      rows() {
        return this.projectList.length
      }
    },

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