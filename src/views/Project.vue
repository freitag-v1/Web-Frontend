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
      if(this.$route.params.workType == "image bounding box" || this.$route.params.workType == "classification") {
            alert("라벨링");
            const projectListRes = await axios.get("/api/project/labelling", {
            params: {
                workType : this.$route.params.workType,
                dataType: "",
            }});
        this.projectList = projectListRes.data;
        
      }
      //수집 프로젝트 리스트 
      else if (this.$route.params.workType == "collection"){
        alert("수집");
        const projectListRes = await axios.get("/api/project/collection", {
            params: {
                workType : this.$route.params.workType,
                dataType: this.$route.params.dataType,
            }
        });
        this.projectList = projectListRes.data;
         
      } //검색한게 없다면 전체
      else {
           alert("전체");
          const projectListRes = await axios.get("/api/project");
          this.projectList = projectListRes.data;
          
      }

  },
}
</script>
<style>
</style>