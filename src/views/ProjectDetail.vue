<template>
    <div class = "projectDetail">
    <img src = "../assets/projectDetail.png" style="width: 300px; height: 70px;">
      <b-card
        class = "detailCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">작업 상세 페이지</h4>
    </template>

    <b-card-body>
      <b-card-title>{{ project.projectName }}</b-card-title>
      <b-card-text v-if="project.workType =='collection' && project.dataType == 'image'">
        작업 데이터 종류: 
        <b-icon icon="image" v-if="project.dataType == 'image'" variant="success"></b-icon> 이미지
      </b-card-text>
      <b-card-text v-if="project.workType =='collection' && project.dataType == 'audio'">
        작업 데이터 종류: 
        <b-icon icon="mic-fill" v-if="project.dataType == 'audio'" variant="primary"></b-icon> 음성
      </b-card-text>
      <b-card-text v-if="project.workType =='collection' && project.dataType == 'text'">
        작업 데이터 종류: 
        <b-icon icon="blockquote-left" v-if="project.dataType == 'text'" variant="warning"></b-icon> 텍스트
      </b-card-text>
        
      </b-card-text>
       <b-card-text v-if="project.workType !='collection'">
        작업 종류: 
        <b-icon icon="bounding-box" v-if="project.dataType == 'boundingBox'" variant="info"></b-icon>
        {{" 이미지 바운딩 박스"}}
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>작업 주제 : {{" "+ project.subject}}</b-list-group-item>
      <b-list-group-item>작업 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item> <데이터 라벨 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname.className}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">작업 방법</b-card-footer>
    <br>
    <p class ="linecontent">{{project.wayContent}}</p>
    <br>
    <b-card-footer style="font-weight: bolder">작업 조건</b-card-footer>
    <br>
    <p class ="linecontent" style="font-size: 18px;">{{project.conditionContent}} </p>
    <br>
    <b-card-footer style="font-weight: bolder">작업 정보 수집 동의</b-card-footer>
    <br>
    <br>
    <b-card class="agreement">
        <b-card-title>정보 수집 이용 동의</b-card-title>
        <p>작업 진행 시 작업자가 제공하는 음성, 텍스트, 이미지 등 작업 정보를 수집 및 처리합니다.</p>
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
        unchecked-value="비동의"> 동의
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
        var searchproject = await localStorage.getItem('searchProject');
        this.project = JSON.parse(searchproject).projectDto;
        this.classNameList = JSON.parse(searchproject).classNameList;
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
                    if(this.project.dataType == "boundingBox") {
                      this.$router.push({name: 'ImageBoundingBox', params : {
                            idx: this.project.projectId,
                        }});
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

@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

.detailCard {
    max-width: 1000px;
    margin: auto;
    font-size : 20px;
}
.agreement {
    width: 800px;
    margin: auto;
    border-style : dashed;
}
#startButton{
      height      : auto;
      line-height : auto;
      text-align  : center;
      width       : auto;
      border      : 2px solid #4682B4;
      padding-left:10px;
      padding-right:10px;
      min-width:100px;
      font-size : 20px;
      color : #fff;
      background-color: #4682B4;

}
#startButton:hover {
  background-color: #4682B4;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
.linecontent {
  font-family:'Jeju Gothic', sans-serif;
  white-space : pre-line;
  font-weight: lighter;
  font-size: 18px;
}

</style>
