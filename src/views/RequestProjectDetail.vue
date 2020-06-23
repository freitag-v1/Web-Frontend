<template>
  <div class="projectDetail">
    <img
      src="../assets/projectDetail.png"
      style="width: 300px; height: 70px;"
    />
    <b-card class="detailCard" no-body>
      <template v-slot:header>
        <h4 class="mb-0">작업 상세 페이지</h4>
      </template>

      <b-card-body>
        <b-card-title>{{ project.projectName }}</b-card-title>
        <b-card-text v-if="project.workType == 'collection'">
          작업 데이터 종류:
          <b-icon
            icon="image"
            v-if="project.dataType == 'image'"
            variant="success"
          ></b-icon>
          <b-icon
            icon="mic-fill"
            v-if="project.dataType == 'audio'"
            variant="primary"
          ></b-icon>
          <b-icon
            icon="blockquote-left"
            v-if="project.dataType == 'text'"
            variant="warning"
          ></b-icon>
          {{ " " + project.dataType }}
        </b-card-text>
        <b-card-text v-if="project.workType != 'collection'">
          작업 종류:
          <!--Image Bounding Box를 boundingBox로 나중에 바꿔야 한다.-->
          <b-icon
            icon="bounding-box"
            v-if="project.dataType == 'boundingBox'"
            variant="info"
          ></b-icon>
          {{ " 이미지 바운딩 박스" }}
        </b-card-text>
      </b-card-body>

      <b-list-group flush>
        <b-list-group-item
          >작업 주제 : {{ " " + project.subject }}</b-list-group-item
        >
        <b-list-group-item
          >작업 의뢰자 : {{ " " + project.userId }}</b-list-group-item
        >
        <b-list-group-item
          ><데이터 라벨 목록>
          <div v-for="(classname, index) in classNameList">
            <br />
            {{ index + 1 + ". " + classname.className }}
          </div>
        </b-list-group-item>
      </b-list-group>
      <b-card-footer style="font-weight: bolder">작업 방법</b-card-footer>
      <br />
      <b-card-text class="content" style="padding : 7px;">{{
        project.wayContent
      }}</b-card-text>
      <b-card-footer style="font-weight: bolder">작업 조건</b-card-footer>
      <br />
      <b-card-text class="content" style="padding : 7px; ">{{
        project.conditionContent
      }}</b-card-text>
      <br />
      <b-card-footer style="font-weight: bolder">작업 진행 상황</b-card-footer>
      <br />
      <p id="projectStatus">{{ project.status }}</p>
      <progressPieChart
        style="width: 400px; height: 400px; margin: auto;"
        :chartData="chartData"
        :options="chartOptions"
      ></progressPieChart>
      <br />
      <b-card-text class="content" style="padding : 7px; ">{{
        "요청 데이터 갯수: " + project.totalData
      }}</b-card-text>
      <b-card-text class="content" style="padding : 7px; ">{{
        "진행 중인 데이터 갯수: " + project.progressData
      }}</b-card-text>
      <br />
        <b-button id="validationComplete" v-b-toggle.collapse-1 v-on:click="getValidationCompleteProblems">
          <b-icon icon="info-circle"></b-icon> 검증 완료된 문제 상세보기
        </b-button>
        <br>
        <b-collapse id="collapse-1" class="mt-2">
          <b-table id = "validationCompleteTable" striped hover 
          :items="validationCompleteItems"
          :per-page="validationPerPage"
          :current-page="validationCurrentPage"
          :fields = "validationFields"
          small
          >
          <template v-slot:cell(show_details)="row">
            <b-button
              id="showProblemDetail"
              v-if="project.dataType != 'boundingBox'"
              class="mr-2"
              v-on:click="showData(row.item)"
            >
            상세 정보 보기
            </b-button>
            <b-button
              v-b-modal.modal-1
              id="showProblemDetail"
              v-if="project.dataType == 'boundingBox'"
              class="mr-2"
              v-on:click="showData(row.item)"
            >
            상세 정보 보기
            </b-button>
          </template>
        </b-table>
        <b-modal id ="modal-1" ref="boundingModal" title = "데이터 상세 보기">
          <p style="text-align : center">{{ "문제 번호 : " + boundingProblemId}}</p>
          <canvas id="boundingCanvas" width ="460" height = "400"/>
        </b-modal>
          <br>
          <b-pagination
            v-model="validationCurrentPage"
            :total-rows="validationRows"
            :per-page="validationPerPage"
            aria-controls="validationCompleteTable"
            align="center"
            first-text="처음"
            prev-text="이전"
            next-text="다음"
            last-text="마지막"
      ></b-pagination>
        </b-collapse>
      <br />
      <br />
      <b-button
              id="projectTerminate"
              v-if="project.status != '수령전'"
              v-on:click="projectTerminate"
            >
            프로젝트 종료
      </b-button>
      <b-button
              id="projectDownload"
              v-if="project.status == '수령전'"
              v-on:click="downloadResult"
            >
            <b-icon icon="download"></b-icon>
            결과물 다운로드
      </b-button>
      <br>
      <br>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";
import progressPieChart from "../components/ProgressStatus.vue";
import VueAudio from "vue-audio";


var FileSaver = require('file-saver');
const endpoint = "kr.object.ncloudstorage.com";
const region = "kr-standard";
const access_key = "4WhQkGZPLH1sVg6cWLtK";
const secret_key = "xmKmQXfbYyyPuXyEw1KeDXE7CveACDQdWUPACtzP";

const v4 = require("aws-signature-v4");

var s3Client = axios.create();

s3Client.interceptors.request.use(function(config) {
  var timestamp = Date.now();
  var headers = {};
  headers["host"] = endpoint;
  headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
  headers["x-amz-date"] = new Date(timestamp)
    .toISOString()
    .replace(/[:\-]|\.\d{3}/g, "");

  var canonicalRequest = v4.createCanonicalRequest(
    "GET",
    config.url,
    {},
    headers,
    "UNSIGNED-PAYLOAD",
    true
  );
  var stringToSign = v4.createStringToSign(
    timestamp,
    region,
    "s3",
    canonicalRequest
  );
  var signature = v4.createSignature(
    secret_key,
    timestamp,
    region,
    "s3",
    stringToSign
  );
  var authorization =
    "AWS4-HMAC-SHA256 Credential=" +
    access_key +
    "/" +
    v4.createCredentialScope(timestamp, region, "s3") +
    ", SignedHeaders=" +
    v4.createSignedHeaders(headers) +
    ", Signature=" +
    signature;

  config.url = "/object" + config.url;
  config.headers["x-amz-content-sha256"] = headers["x-amz-content-sha256"];
  config.headers["x-amz-date"] = headers["x-amz-date"];
  config.headers["Authorization"] = authorization;

  return config;
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var globalCtx;
function workedBoxDraw(x, y, width, height, className){
    globalCtx.beginPath();
    globalCtx.rect(x, y, width, height);
    //선택된 class에 맞는 색을 찾음.
    //var currentColor = colorByLabel.find(color => color.className == className);
    //색으로 그림을 그리고 어떤 class에 해당하는지 글로 보여주고
    //ctx.strokeStyle = currentColor.strokeColor;
    globalCtx.strokeStyle = getRandomColor();
    globalCtx.lineWidth = 5;
    globalCtx.stroke();
    globalCtx.font = "18px Verdana";
    //ctx.fillStyle = currentColor.strokeColor;
    globalCtx.fillStyle = getRandomColor();
    globalCtx.fillText(className, x + 5, y - 5);
}



export default {
  name: "ProjectDetail",
  components: {
    progressPieChart,
    VueAudio,
  },
  data() {
    return {
      project: "",
      imageUrl: "",
      status: null,
      classNameList: [],
      chartOptions: {
        hoverBorderWidth: 20,
      },
      chartData: {
        labels: ["진행 중인 데이터", "검증 완료된 데이터", "진행 전 데이터"],
        datasets: [
          {
            backgroundColor: ["#009688", "#00BCD4", "#4D2F40"],
            data: [],
          },
        ],
      },
      validationPerPage: 10,
      validationCurrentPage : 1,
      validationFields : [{key : "problemId", label : "문제 번호"},
        {key : "show_details", label: "상세 정보"}],
      validationCompleteItems : [{problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"},
      {problemId : 0, objectID : "hello"}], //검증 완료된 문제 상세보기 버튼을 누르면 서버에 api 전송해서 데이터를 가져와야한다. ,
      problemContentList : new Map(),
      boundingProblemId : '',

    };
  },
  computed: {
    validationRows() {
      return this.validationCompleteItems.length;
    }
  },
  mounted() {
      this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
        if(this.project.dataType == "boundingBox"){
          this.drawBounding();
        }
      
    });
    
  },
  async beforeCreate() {
    var searchproject = await localStorage.getItem("searchProject"); //this.$route.params.project;
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
    this.project = JSON.parse(searchproject).projectDto;
    this.classNameList = JSON.parse(searchproject).classNameList; //this.$route.params.classList;
    this.chartData.datasets[0].data[0] = this.project.progressData;
    this.chartData.datasets[0].data[1] = this.project.validatedData;
    this.chartData.datasets[0].data[2] =
      this.project.totalData - this.project.progressData;
    if (this.chartData.datasets[0].data[2] <= 0) {
      this.chartData.datasets[0].data[2] = 0;
    }
  },
  methods: {
    async getProblemData(problem) {
      if(this.project.dataType=="text"){
        await s3Client.get("/"+this.project.bucketName+"/"+problem.objectName, {
          responseType: 'text'
        }).then(problemDataRes =>  {
          const data = problemDataRes.data;
          if(data.includes(this.project.projectName +"workTextWrite.txt")){
              var textConversation = "질문 : " + data.question + "\n" + "답변 : " + data.answer;
              this.problemContentList.set(problem.problemId, textConversation);
          }
          else {
            this.problemContentList.set(problem.problemId, data);
          }
        
        });
      }
      else {
        await s3Client.get("/"+this.project.bucketName+"/"+problem.objectName, {
          responseType: 'blob'
        }).then(problemDataRes =>  {
        const url = URL.createObjectURL(new Blob([problemDataRes.data], { type: problemDataRes.headers['content-type'] }));
        this.problemContentList.set(problem.problemId, url);
      });
      }
      
    },
    showData(problem){
      if(this.problemContentList.get(problem.problemId) != undefined){
        this.getProblemData(problem);
      }

       const h = this.$createElement;
        // Using HTML string
        const titleVNode = h('div',{ domProps: { innerHTML: '검증 완료된 데이터' } });
        // More complex structure
        var messageVNode;
        switch(this.project.dataType) {
          case "text" :
            var textData = this.problemContentList.get(problem.problemId);
              messageVNode = h('div', { class: ['foobar'] }, [
                h('p', { class: ['text-center'] }, [
                  "문제 번호 " + problem.problemId
                ]),
                h('pre', [
                  textData
                ] )
              ])
              break;
          case "image" : 
              //var imageUrl = this.problemContentList.get(problem.problemId);
              messageVNode = h('div', { class: ['foobar'] }, [
                h('p', { class: ['text-center'] }, [
                  "문제 번호 " + problem.problemId
                ]),
                h('b-img', {
                  props: {
                    src: this.imageUrl,
                    center: true,
                    fluid: true,
                  }
                })
              ])
              break;
          case "audio" :
            //var audioUrl = this.problemContentList.get(problem.problemId);
            messageVNode = h('div', { class: ['foobar'] }, [
                h('p', { class: ['text-center'] }, [
                  "문제 번호 " + problem.problemId
                ]),
                h('VueAudio', {
                  props: {
                    file : this.imageUrl,
                  }
                })
              ])
              break;
          case "classification" :
              var classUrl = this.problemContentList.get(problem.problemId);
              messageVNode = h('div', { class: ['foobar'] }, [
                h('p', { class: ['text-center'] }, [
                  "문제 번호 " + problem.problemId
                ]),
                h('b-img', {
                  props: {
                    src: classUrl,
                    center: true,
                    fluid: true,
                  }
                })
              ])
              break;
          case "boundingBox" :   
            this.boundingProblemId = problem.problemId;
            //workedBoxDraw()
            // 이거를 이용해서 className이랑 색깔 여기서 만들어줘야한다.
            // 그리고 색을 class name에 맞춰서 넣으면 된다. 
            break;
        }
        
        // We must pass the generated VNodes as arrays
        if(this.project.dataType != "boundingBox"){
          this.$bvModal.msgBoxOk([messageVNode], {
          title: [titleVNode],
          centered: true,
        });
        }
        
        //
        
    },
    onChangeFile(e) {
      const file = e.target.files[0];
      this.imageUrl = URL.createObjectURL(file);    
        
    },
    drawBounding() {
      var canvas = document.getElementById("boundingCanvas");
      //console.log(document.getElementById("modal-1"));
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width, canvas.height);
            var boundingImage = new Image();
            boundingImage.src = this.imageUrl;
            boundingImage.onload = function() {
                var scale = Math.min(canvas.width / boundingImage.width, canvas.height / boundingImage.height);
                  var x = (canvas.width / 2) - (boundingImage.width / 2) * scale;
                  var y = (canvas.height / 2) - (boundingImage.height / 2) * scale;
                ctx.drawImage(boundingImage, x, y, boundingImage.width * scale, boundingImage.height * scale);
                globalCtx = ctx;
                //여기서 데이터로 넘어온 좌표에 460 400을 넣어줘야한다
                workedBoxDraw(0, 0, 100, 100, "안녕");
            }
           
    },
    async projectTerminate() {
      await axios.get("/api/project/terminate", {
        params : {
          projectId : this.project.projectId,
        }
      }).then(terminateRes => {
        if(terminateRes.headers.project == "success") {
          var finalCost = Number(terminateRes.headers.finalcost);
          this.$router.push({name : "FinalCostPayment", params : {
            finalCost : 1000,
            projectName : this.project.projectName,
            projectId : this.project.projectId,
          }});
        }
        else {
          alert("프로젝트 종료를 실패하였습니다.");
        }
      }).catch(function(error){
        if (error.response) {
              alert("프로젝트 종료를 실패하였습니다. 다시 시도해주세요!");
          }
      });
    },
    async downloadResult() {
      await axios({
          url: "/api/project/download",
          params: { projectId : this.project.projectId },
          responseType: "blob"
      }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.project.projectName+".zip");
          document.body.appendChild(link);
          link.click();
      }).catch(function(error){
        if (error.response) {
            alert("결과물 다운로드를 실패하였습니다!");
          }
      });

    },
    async getValidationCompleteProblems() {
        //여기서 api보내서 데이터를 가져와야 한다.
        // this.valid~Items = res.data;
    },
  },
};
</script>
<style>
font-size: 20px;

.detailCard {
  max-width: 1000px;
  margin: auto;
  font-size: 20px;
}
.content {
  font-size: 20px;
  font-weight: lighter;
}
#projectStatus {
  font-size: 30px;
  background-color: #ffebcd;
  width: 300px;
  margin: auto;
  font-weight: lighter;
}
#validationComplete {
  width: 300px;
  margin : auto;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#validationComplete:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#projectTerminate {
  width: 300px;
  margin: auto;
  background-color: #fa8072;
  border: none;
  font-size: 19px;
  color: black;
}
#projectTerminate:hover {
  background-color: #fa8072;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#validationCompleteTable {
  width : 800px;
  margin: auto;
}
#showProblemDetail {
  background-color: #ffffff;
  color : black;
  border : none;
}
#showProblemDetail:hover {
   color : black;
}
.foobar {
  font-family: "Jeju Gothic", sans-serif;
}
#projectDownload {
  width: 300px;
  margin: auto;
  background-color: #F4A460;
  border: none;
  font-size: 19px;
  color: black;
}
#projectDownload:hover {
  background-color: #F4A460;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}


</style>
