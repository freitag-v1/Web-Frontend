<template>
</template>
<script>
import axios from 'axios';
export default {
  name: 'Project',
  data() {
      return {
          projectList:'',
          workType:'',
          dataType:'',
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
      if(this.$route.params.projectType == "Labelling") {
            if(this.$route.params.workType != null) {// 작업 종류 검색한 경우 
                alert("라벨링 - 작업 종류");
                const projectListRes = await axios.get("/api/project/labelling", {
                params: {
                    workType : this.$route.params.workType,
                }});
                this.projectList = projectListRes.data;
            }
            else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
                alert("라벨링 - 데이터 종류");
                const projectListRes = await axios.get("/api/project/labelling", {
                params: {
                    dataType : this.$route.params.dataType,
                }});
                this.projectList = projectListRes.data;
            
            }
            else { //난이도를 선택한 경우 
                alert("라벨링 - 난이도");
                const projectListRes = await axios.get("/api/project/labelling", {
                params: {
                    difficulty : this.$route.params.difficulty,
                }});
                this.projectList = projectListRes.data;
            }
        
      }
      //수집 프로젝트 리스트 
        else if (this.$route.params.projectType == "Collection"){
            if(this.$route.params.subject != null) {// 주제 검색한 경우 
                alert("수집 - 주제 검색");
                const projectListRes = await axios.get("/api/project/collection", {
                params: {
                    subject : this.$route.params.subject,
                }});
                this.projectList = projectListRes.data;
            }
            else if(this.$route.params.dataType != null) { //데이터 종류 검색한 경우
                alert("수집 - 데이터 종류");
                const projectListRes = await axios.get("/api/project/collection", {
                params: {
                    dataType : this.$route.params.dataType,
                }});
                this.projectList = projectListRes.data;
            
            }
            else { //난이도를 선택한 경우 
                alert("수집 - 난이도");
                const projectListRes = await axios.get("/api/project/collection", {
                params: {
                    difficulty : this.$route.params.difficulty,
                }});
                this.projectList = projectListRes.data;
            }
        }
        else { //검색한게 없다면 전체
           alert("전체");
          const projectListRes = await axios.get("/api/project");
          this.projectList = projectListRes.data;
          
      }

  },
}
</script>
<style>
</style>