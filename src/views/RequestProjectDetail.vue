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
      <b-card-text v-if="project.workType =='collection'">
        작업 데이터 종류: 
        <b-icon icon="image" v-if="project.dataType == 'image'" variant="success"></b-icon>
        <b-icon icon="mic-fill" v-if="project.dataType == 'audio'" variant="primary"></b-icon>
        <b-icon icon="blockquote-left" v-if="project.dataType == 'text'" variant="warning"></b-icon>
        {{" " +project.dataType}}
      </b-card-text>
       <b-card-text v-if="project.workType !='collection'">
        작업 종류: <!--Image Bounding Box를 boundingBox로 나중에 바꿔야 한다.-->
        <b-icon icon="bounding-box" v-if="project.dataType == 'boundingBox'" variant="info"></b-icon>
        <!--<b-icon icon="columns-gap" v-if="project.dataType == 'classification'" variant="warning"></b-icon>-->
        {{" 이미지 바운딩 박스"}}
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>작업 주제 : {{" "+ project.subject}}</b-list-group-item>
      <b-list-group-item>작업 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item><데이터 라벨 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname.className}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">작업 방법</b-card-footer>
    <br>
    <b-card-text class ="content" style = "padding : 7px;">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">작업 조건</b-card-footer>
    <br>
    <b-card-text class="content" style="padding : 7px; ">{{project.conditionContent}}</b-card-text>
    <br>
    <b-card-footer style="font-weight: bolder">작업 진행 상황</b-card-footer>
    <br>
    <progressPieChart style="width: 400px; height: 400px; margin: auto;" :chartData="chartData" :options="chartOptions"></progressPieChart>
    <br>
    <b-card-text class="content" style="padding : 7px; ">{{ "요청 데이터 갯수: " + project.totalData}}</b-card-text>
    <b-card-text class="content" style="padding : 7px; ">{{"진행 중인 데이터 갯수: " + project.progressData}}</b-card-text>
    <br>
    <br>
    
  </b-card>

    </div>
</template>
<script>
import axios from 'axios';
import progressPieChart from '../components/ProgressStatus.vue'

const endpoint = 'kr.object.ncloudstorage.com';
const region = 'kr-standard';
const access_key = '4WhQkGZPLH1sVg6cWLtK';
const secret_key = 'xmKmQXfbYyyPuXyEw1KeDXE7CveACDQdWUPACtzP';

const v4 = require('aws-signature-v4');

var s3Client = axios.create();

s3Client.interceptors.request.use(function (config) {
        var timestamp = Date.now();
        var headers = {};
        headers['host'] = endpoint;
        headers['x-amz-content-sha256'] = 'UNSIGNED-PAYLOAD';
        headers['x-amz-date'] = new Date(timestamp).toISOString().replace(/[:\-]|\.\d{3}/g, "");

        var canonicalRequest = v4.createCanonicalRequest('GET', config.url, {}, headers, 'UNSIGNED-PAYLOAD', true);
        var stringToSign = v4.createStringToSign(timestamp, region, 's3', canonicalRequest);
        var signature = v4.createSignature(secret_key, timestamp, region, 's3', stringToSign);
        var authorization = 'AWS4-HMAC-SHA256 Credential=' + access_key + '/' +
                        v4.createCredentialScope(timestamp, region, 's3') + ', SignedHeaders=' +
                        v4.createSignedHeaders(headers) + ', Signature=' + signature;

	config.url = '/object' + config.url;
        config.headers['x-amz-content-sha256'] = headers['x-amz-content-sha256'];
        config.headers['x-amz-date'] = headers['x-amz-date'];
        config.headers['Authorization'] = authorization;

        return config;
    });
  export default {
    name: 'ProjectDetail',
    components : {
        progressPieChart
    },
    data() {
        return {
            project : '',
            audioUrl: '',
            downloadUrl: '',
            status: null,
            classNameList:[],
            chartOptions: {
                hoverBorderWidth: 20
            },
            chartData: {
                labels: ["진행 중인 데이터(%)", "남아있는 데이터(%)"],
                datasets: [
                {
                    backgroundColor: ["#6E65D3", "#B9B7BF"],
                    data: [],
                }
            ]
      }
        }
    },
    async beforeCreate() {
        var searchproject = await localStorage.getItem('searchProject');//this.$route.params.project;
        console.log(JSON.parse(searchproject));
        
        this.project = JSON.parse(searchproject).projectDto;
        
        this.classNameList = JSON.parse(searchproject).classNameList;//this.$route.params.classList;
        var progressPercent = (this.project.progressData / this.project.totalData)* 100;
        this.chartData.datasets[0].data[0] = 30;
        this.chartData.datasets[0].data[1] = 70;
        console.log(this.chartData);
        //this.exampleDownload();
    },
    methods : {
      // async exampleDownload() {
      //     if(this.project.exampleContent.includes(".txt")){
      //           s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
      //               responseType: 'text',
      //           }).then((res) =>{
      //             var textExample = document.createElement('p');
      //             textExample.innerText = res.data;
      //             document.getElementById("exampleContent").appendChild(textExample);
      //             localStorage.exampleContent = res.data;
      //           }); 
      //       }
      //       else { 
      //             s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
      //               responseType: 'blob',
      //           }).then((res) => {
      //               var exampleFile = new File([res.data], this.project.exampleContent,{ type: res.headers['content-type'], lastModified : Date.now() } );
      //               const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      //               var content = {
      //                     type : res.data.type,
      //                     file : exampleFile,
      //                   }
      //               localStorage.exampleContent = JSON.stringify(content);
      //               if(this.project.exampleContent.includes("image/")){
      //                  this.downloadUrl = url;
      //               }
      //               else {
      //                  this.audioUrl = url;
      //               }
      //           });

      //       }
      // },
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
    width: 400px;
    height: 70px;
    font-size: 20px;
}
</style>
