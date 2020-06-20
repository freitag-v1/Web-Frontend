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
      <div class="buttons">
        <b-button id="downloadButton" v-on:click="download">
          <b-icon icon="download"></b-icon> 결과물 다운로드
        </b-button>
        <b-button id="endButton" v-on:click="endProject">
          <b-icon icon="box-arrow-right"></b-icon> 프로젝트 종료
        </b-button>
      </div>
      <br />
      <br />
    </b-card>
  </div>
</template>
<script>
import axios from "axios";
import progressPieChart from "../components/ProgressStatus.vue";

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
export default {
  name: "ProjectDetail",
  components: {
    progressPieChart,
  },
  data() {
    return {
      project: "",
      audioUrl: "",
      downloadUrl: "",
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
    };
  },
  async beforeCreate() {
    var searchproject = await localStorage.getItem("searchProject"); //this.$route.params.project;
    this.project = JSON.parse(searchproject).projectDto;
    this.classNameList = JSON.parse(searchproject).classNameList; //this.$route.params.classList;
    this.chartData.datasets[0].data[0] = this.project.progressData;
    this.chartData.datasets[0].data[1] = this.project.validatedData;
    this.chartData.datasets[0].data[2] =
      this.project.totalData - this.project.progressData;
    if (this.chartData.datasets[0].data[2] <= 0) {
      this.chartData.datasets[0].data[2] = 0;
    }

    console.log(this.chartData);
  },
  methods: {
    download() {},
    endProject() {},
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
#downloadButton {
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#downloadButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#endButton {
  width: 200px;
  background-color: #fa8072;
  border: none;
  font-size: 19px;
  color: black;
}
#endButton:hover {
  background-color: #fa8072;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
</style>
