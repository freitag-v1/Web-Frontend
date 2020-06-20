<template>
  <div class="audioCollection">
    <img id="audioCollectionLogo" src="../assets/audioCollection.png" />
    <b-card class="workCard" no-body>
      <template v-slot:header>
        <h4 class="mb-0">음성 수집 작업</h4>
        <h5>
          *음성 수집 작업은 주어진 수집 데이터 라벨에 해당하는 음성을 업로드하는
          작업입니다
        </h5>
      </template>
      <b-list-group flush>
        <b-list-group-item class="workContent"
          >작업 이름 : {{ " " + project.projectName }}</b-list-group-item
        >
        <b-list-group-item class="workContent"
          >작업 의뢰자 : {{ " " + project.userId }}</b-list-group-item
        >
        <b-list-group-item class="workContent">
          <데이터 라벨 목록>
          <div v-for="(classname, index) in classNameList">
            <br />
            {{ index + 1 + ". " + classname.className }}
          </div>
        </b-list-group-item>
      </b-list-group>
      <b-card-footer style="font-weight: bolder; padding: 10px;"
        >작업 방법</b-card-footer
      >
      <br />
      <b-card-text class="content">{{ project.wayContent }}</b-card-text>
      <br />
      <b-card-footer style="font-weight: bolder; padding: 10px;"
        >작업 조건</b-card-footer
      >
      <br />
      <b-card-text class="content">{{ project.conditionContent }}</b-card-text>
      <br />
      <b-card-footer style="font-weight: bolder; padding: 10px;"
        >예시 데이터</b-card-footer
      >
      <br />
      <b-card-text class="content">
        <audio-upload
          id="exampleAudio"
          v-if="audioUrl != ''"
          :value="audioUrl"
        />
        <router-view />
      </b-card-text>
      <br />
      <b-card-footer style="font-weight: bolder">음성 업로드</b-card-footer>
      <br />
      <h5>
        *음성 등록 버튼을 눌러야 작업이 완료가 됩니다! 꼭 버튼을 눌러주세요!
      </h5>
      <div>
        <b-form-radio-group
          v-model="selected"
          :options="options"
          class="option"
          value-field="item"
          text-field="name"
        ></b-form-radio-group>
        <div class="mt-3">
          선택된 라벨:
          <strong>{{ selected }}</strong>
        </div>
      </div>
      <div class="registeredImage" v-for="name in audioContentList">
        <br />
        <h4 v-if="name.class == selected">< 이전에 등록된 음성 ></h4>
        <div v-if="name.class == selected" v-for="(index, value) in name.name">
          <p>{{ value + 1 + ". " + index }}</p>
        </div>
        <div
          v-if="name.class == selected"
          v-for="(index, url) in name.audioUrl"
        >
          <p id="registeredAudio">
            {{ url + 1 + "번째 등록된 음성" }}
            <VueAudio v-if="index != ''" :file="index" />
          </p>
        </div>
      </div>
      <br />
      <b-form-file
        multiple
        v-model="audioContent"
        :state="Boolean(audioContent)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        hidden
        @change="onChangeAudios"
        accept="audio/*"
      ></b-form-file>
      <br />
      <p v-if="audioPreUrl != ''">
        {{ "업로드 데이터 " + audioContent[0].name + "의 preview" }}
      </p>
      <br />
      <VueAudio v-if="audioPreUrl != ''" :file="audioPreUrl" />
      <br />
      <b-card-footer style="font-weight: bolder">음성 녹음</b-card-footer>
      <br />
      <audio-recorder
        class="audioRecorder"
        :time="10"
        :before-recording="callback"
        :pause-recording="callback"
        :after-recording="callback"
        :select-record="callback"
        :before-upload="callback"
        :successful-upload="callback"
        :failed-upload="callback"
        :removeIndex="callback"
      />

      <br />
      <div class="buttons">
        <b-button id="registerButton" v-on:click="upload">
          <b-icon icon="download"></b-icon> 음성 등록
        </b-button>
        <b-button id="endWorkButton" v-on:click="endWork">
          <b-icon icon="upload"></b-icon> 작업 완료
        </b-button>
      </div>
      <br />
    </b-card>
    <br />
    <br />
  </div>
</template>
<script>
import axios from "axios";
import AudioUpload from "../components/AudioUpload.vue";
import VueAudioRecorder from "vue-audio-recorder";
import VueAudio from "vue-audio";

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
  name: "AudioCollection",
  components: {
    AudioUpload,
    VueAudioRecorder,
    VueAudio,
  },
  data() {
    return {
      project: "",
      classNameList: [],
      createCollection: false,
      audioContent: "",
      audioRecordList: [],
      audioUrl: "",
      options: [],
      selected: "",
      audioPreUrl: "",
      audioContentList: [],
    };
  },
  async beforeCreate() {
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
  },
  async created() {
    this.fetchData();
  },
  watch: {
    selected: function(val) {
      this.audioContent = "";
      this.audioPreUrl = "";
    },
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
  },
  beforeRouteLeave(to, from, next) {
    //작업하고나서 나가려고 하면 이루어지는거

    if (this.audioContentList != null && !this.createCollection) {
      if (
        !window.confirm(
          "페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?"
        )
      ) {
        return;
      }
    }
    delete localStorage.exampleContent;
    next();
  },
  methods: {
    async fetchData() {
      var searchproject = await localStorage.getItem("searchProject"); //this.$route.params.project;

      this.project = JSON.parse(searchproject).projectDto;
      this.classNameList = JSON.parse(searchproject).classNameList; //this.$route.params.classList;
      var optionDataList = new Array();
      for (let i = 0; i < this.classNameList.length; i++) {
        var optionData = {
          name: this.classNameList[i].className,
          item: this.classNameList[i].className,
        };
        optionDataList.push(optionData);
      }
      this.options = optionDataList;
      this.selected = this.classNameList[0].className;
      await s3Client
        .get(
          "/" + this.project.bucketName + "/" + this.project.exampleContent,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] })
          );
          this.audioUrl = url;
          var content = {
            type: res.data.type,
            url: url,
          };
          //localStorage.exampleContent = JSON.stringify(content);
        });
    },
    ready() {
      this.$refs.mycom.seekTo(this.timeline);
    },
    onChangeAudios(e) {
      const file = e.target.files[0];
      this.audioPreUrl = URL.createObjectURL(file);
    },
    preventNav(event) {
      if (this.audioContentList == null || this.createCollection) return;
      event.preventDefault();
      event.returnValue = "";
    },
    callback(data) {
      if (typeof data == "object") {
        // 오디오 파일
        this.audioRecordList.push(data);
      }
    },
    async upload() {
      var userId = await localStorage.getItem("userId");
      var nameList = new Array();
      let audioData = new FormData();
      var audioUrlList = new Array();
      //업로드 데이터
      if (this.audioContent != null) {
        for (var uploadAudioFile of this.audioContent) {
          var uploadAudioUrl = URL.createObjectURL(uploadAudioFile);
          audioUrlList.push(uploadAudioUrl);
          audioData.append("files", uploadAudioFile);
          nameList.push(uploadAudioFile.name);
        }
      }
      //녹음한 데이터
      if (this.audioRecordList != null) {
        for (let i = 0; i < this.audioRecordList.length; i++) {
          //삭제된 오디오 녹음 파일 삭제
          if (this.audioRecordList[i].url == null) {
            this.audioRecordList.splice(i, 1);
          }
        }
        //중복 제거
        const notDuplicatedRecord = new Set(this.audioRecordList);
        this.audioRecordList = Array.from(notDuplicatedRecord);
        //녹음한 오디오 파일을 blob -> file
        for (let i = 0; i < this.audioRecordList.length; i++) {
          const file = new File(
            [this.audioRecordList[i].blob],
            userId + i + "_" + this.project.projectId + Date.now() + ".mp3",
            {
              type: this.audioRecordList[i].blob.type,
              lastModified: Date.now(),
            }
          );
          var recordAudioUrl = URL.createObjectURL(file);
          audioUrlList.push(recordAudioUrl);
          audioData.append("files", file);
          nameList.push(file.name);
        }
      }
      var audioByClass = {
        class: this.selected,
        audioFile: audioData,
        audioUrl: audioUrlList,
        name: nameList,
      };
      var duplicatedIndex = -1;
      for (let i = 0; i < this.audioContentList.length; i++) {
        if (this.audioContentList[i].class == this.selected) {
          duplicatedIndex = i;
        }
      }
      if (duplicatedIndex != -1) {
        this.audioContentList[duplicatedIndex] = audioByClass;
      } else {
        this.audioContentList.push(audioByClass);
      }
      duplicatedIndex = -1;
    },
    async endWork() {
      var successCount = 0;
      this.createCollection = true;
      axios.defaults.headers.common["bucketName"] = this.project.bucketName;
      axios.defaults.headers.common["projectId"] = this.project.projectId;
      for (let i = 0; i < this.audioContentList.length; i++) {
        await axios
          .post("/api/work/collection", this.audioContentList[i].audioFile, {
            params: {
              className: this.audioContentList[i].class,
              // 파라미터로 class를 보내야한다.
            },
          })
          .then((collectionWorkRes) => {
            if (collectionWorkRes.headers.upload == "success") {
              successCount++;
            } else {
              alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
              this.$router.go(-1);
              //location.reload();
            }
          })
          .catch(function(error) {
            if (error.response) {
              alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
              this.$router.go(-1);
            }
          });
      }
      if (successCount == this.audioContentList.length) {
        alert("수집 작업이 완료되었습니다!");
        this.$router.push("/");
      }
    },
  },
};
</script>
<style>
#audioCollectionLogo {
  width: 350px;
  height: 110px;
}
.workCard {
  max-width: 1000px;
  margin: auto;
  font-size: 20px;
}
.buttons {
  margin: auto;
  width: 50%;
}
.audioRecorder {
  margin: auto;
}
#registerButton {
  width: 200px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#registerButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#endWorkButton {
  width: 150px;
  background-color: #fa8072;
  border: none;
  font-size: 19px;
  color: black;
}
#endWorkButton:hover {
  background-color: #fa8072;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
.workContent {
  font-size: 20px;
}
#registeredAudio {
  font-weight: lighter;
  color: #696969;
}
</style>
