<template>
    <div class ="projectList">
        <img id="projectLogo" src ="../assets/projectList.png"/>
        <b-button  href="/newProject" style="margin-top: 10px; ">
            Create
        </b-button>
        <hr class = "bar">
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
                <b-button style="width: 230px; "v-on:click="moveProject(row.item)" class="mr-2">
                    {{ row.item.projectName }}
                </b-button>
            </template>
            <template v-slot:cell(dataType)="data">
                <p class = "data" v-if="data.value == 'image'"><b-icon icon="image" variant="success"></b-icon> 이미지</p>
                <p class = "data" v-else-if="data.value == 'audio'"><b-icon icon="mic-fill" variant="primary"></b-icon> 음성</p>
                <p class = "data" v-else-if="data.value == 'text'"><b-icon icon="blockquote-left" variant="warning"></b-icon> 텍스트</p>
                <p class = "data" v-else><b-icon icon="tag" color="#e83e8c"></b-icon> 라벨링</p>
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
          projectList: '',
          fields: [{key : 'projectName', label: '프로젝트 이름'},{key : 'userId', label: '의뢰자'}, 'workType','dataType', 'show_details'],
          workType:'',
          dataType:'',
          perPage : 10,
          currentPage : 1,
      }
  },
  async beforeCreate() {
      
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
        //라벨링 작업 프로젝트 
      if(this.$route.params.projectType == "Labelling") {
          console.log(this.$route.params.difficulty, this.$route.params.workType, this.$route.params.subject)
          await axios.get("/api/project/list", {
              params : {
                  workType : 'labelling',
                  dataType : this.$route.params.workType,
                  difficulty : 0,//this.$route.params.difficulty,
                  subject : this.$route.params.subject,
              }
            })
            .then(projectListRes => {
                if(projectListRes.headers.search == "success"){
                this.projectList = projectListRes.data;
                console.log(projectListRes.data);
                }
                else {
                    alert("검색한 프로젝트가 존재하지 않습니다.");
                }
            })
            .catch(function(error) {
                        if(error.response){
                            alert("검색 정보가 없습니다!");
                        }
                });
            
      }
      //수집 프로젝트 리스트 
        if(this.$route.params.projectType == "Collection") {
            console.log(this.$route.params.difficulty, this.$route.params.dataType, this.$route.params.subject);
             const projectListRes = await axios.get("/api/project/list", {
              params : {
                  workType : 'collection',
                  dataType : this.$route.params.dataType,
                  difficulty : this.$route.params.difficulty,
                  subject : this.$route.params.subject,
              }
            })
            .then(projectListRes => {
                if(projectListRes.headers.search == "success"){
                this.projectList = projectListRes.data;
                console.log(projectListRes.data);
                }
                else {
                    alert("검색한 프로젝트가 존재하지 않습니다.");
                }
            })
            .catch(function(error) {
                        if(error.response){
                            alert("검색 정보가 없습니다!");
                        }
                });
            }
            

  },
  computed: {
      rows() {
        return this.projectList.length;
      }
    },
    methods : {
        moveProject(detailItem){
            console.log(detailItem); // 자세히 보고싶은 프로젝트를 보여줄 수 있도록 
            this.$router.push({name: 'ProjectDetail', params: {
                idx: detailItem.projectName,
                project : detailItem,
            }})
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
.data {
    font-size: 15px;
    font-weight: lighter;
}

</style>