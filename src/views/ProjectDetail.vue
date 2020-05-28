<template>
    <div class = "projectDetail">
    <img src = "../assets/projectDetail.png">
      <b-card
        class = "detailCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">프로젝트 상세 페이지</h4>
    </template>

    <b-card-body>
      <b-card-title>{{ project.projectName }}</b-card-title>
      <b-card-text v-if="project.workType =='collection'">
        프로젝트 데이터 종류: 
        <b-icon icon="image" v-if="project.dataType == 'image'" variant="success"></b-icon>
        <b-icon icon="mic-fill" v-if="project.dataType == 'audio'" variant="primary"></b-icon>
        <b-icon icon="blockquote-left" v-if="project.dataType == 'text'" variant="warning"></b-icon>
        {{" " +project.dataType}}
      </b-card-text>
       <b-card-text v-if="project.workType !='collection'">
        프로젝트 작업 종류: <!--Image Bounding Box를 boundingBox로 나중에 바꿔야 한다.-->
        <b-icon icon="bounding-box" v-if="project.workType == 'Image Bounding Box'" variant="info"></b-icon>
        <b-icon icon="columns-gap" v-if="project.workType == 'classification'" variant="warning"></b-icon>
        {{" " +project.workType}}
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>프로젝트 주제 : {{" "+ project.subject}}</b-list-group-item>
      <b-list-group-item>프로젝트 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item v-if="project.workType =='collection'"><프로젝트 수집 데이터 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname.className}}
        </div>
        </b-list-group-item>
        <b-list-group-item v-if="project.workType!='collection'"><프로젝트 라벨링 데이터 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+ classname.className}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">프로젝트 진행 방법</b-card-footer>
    <br>
    <b-card-text class ="content">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">프로젝트 조건</b-card-footer>
    <br>
    <b-card-text class ="content">{{project.conditionContent}}</b-card-text>
    <!-- 프로젝트 생성 시 업로드한 예시 데이터를 -->
    <br>
    <b-card-footer style="font-weight: bolder">작업 정보 수집 동의</b-card-footer>
    <br>
    <br>
    <b-card class="agreement">
        <b-card-title>정보 수집 이용 동의</b-card-title>
        <p>프로젝트 진행 시 작업자가 제공하는 음성, 텍스트, 이미지 등 작업 정보를 수집 및 처리합니다.</p>
        <br>
        <b-table striped hover :items="agreements" :fields="fields"></b-table>
        <br>
        <p>※ 위와 같이 작업 정보를 수집 및 처리하는데 동의를 거부할 권리가 있습니다.
        <br>
            그러나 동의를 거부할 경우 일부 작업 서비스 제공이 제한될 수 있습니다.</p>
        <br>
        <p>위와 같이 작업 정보를 수집 및 처리하는데 동의하십니까?</p>
         <b-form-checkbox
        id="checkbox-1"
        v-model="status"
        value="동의"
        unchecked-value="비동의"
    >
      동의
    </b-form-checkbox>

    <div>동의 여부: <strong>{{ status }}</strong></div>
    <p>{{date}}</p>

    </b-card>
    <br>
    <br>
    <b-button id ="startButton" variant="outline-primary" v-on:click="startProject">{{ project.projectName }} 
    <br>작업 시작</b-button>
    <br>
  </b-card>

    </div>
</template>
<script>
import axios from 'axios';
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;  // 월
let todayDate = today.getDate();  // 날짜
let day = today.getDay();  // 요일
  export default {
    name: 'ProjectDetail',
    data() {
        return {
            project : '',
            status: null,
            classNameList:[],
            agreements: [{content : '작업 정보', purpose: '프로젝트 진행 & 포인트 지급', period: '1년'}],
            fields: [{key : 'content', label: '항목'},{key : 'purpose', label: '수집 목적'}, {key: 'period', label:'보유 기간'}],
            date: year + "년 "+month+"월 "+todayDate+"일 ",
        }
    },
    async created() {
        var searchproject = await localStorage.getItem('searchProject');//this.$route.params.project;
        console.log(JSON.parse(searchproject));

        this.project = JSON.parse(searchproject).projectDto;
        this.classNameList = JSON.parse(searchproject).classNameList;//this.$route.params.classList;
        console.log("======================="+this.classNameList[0]);
    },
    methods : {
        async startProject() {
            if(this.status ==  "비동의" || this.status == null){
                alert("동의하지 않은 경우 프로젝트를 진행할 수 없습니다!");
            }
            else {
              switch(this.project.workType){
                  case "collection" : 
                    if(this.project.dataType == 'image') {
                        this.$router.push({name: 'ImageCollection', params : {
                          idx : this.project.projectId,
                        }});
                      break;
                    }
                    else if (this.project.dataType == 'audio'){
                        this.$router.push({name: 'AudioCollection'});
                    }
                    else {
                      this.$router.push({name: 'TextCollection'});
                    }
                    break;
                  case "labelling" :
                    if(this.project.dataType == "boundingBox"){
                      const boundingBoxProblemRes = await axios.get("/api/work/labelling", {
                        params : {
                          projectId : this.project.projectId,
                        }
                      });
                      if(boundingBoxProblemRes.headers.problems == "success"){
                          var boundingBoxProblem = boundingBoxProblemRes.data;
                          console.log(boundingBoxProblem);
                          localStorage.problemList = JSON.stringify(boundingBoxProblem);
                          this.$router.push({name: 'ImageBoundingBox', params : {
                            idx: 0,
                          }});
                      }
                      //this.$router.push({name: 'ImageBoundingBox'});
                      break;
                    }
                    else {
                      this.$router.push({name: 'Classification'});
                      break;
                    }
                
              }
            }
            
        }
    }
  }
</script>
<style>
.detailCard {
    max-width: 1000px;
    margin: auto;
    font-size : 20px;
}
.content{
    font-size: 20px; 
    font-weight: lighter;
}
.agreement {
    width: 800px;
    margin: auto;
    border-style : dashed;
}
#startButton {
    margin :auto;
    width: 250px;
    height: 70px;
    font-size: 20px;
}
</style>
