<template>
    
    <div class ="imageCollection">
        <img src = "../assets/audioCollection.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">음성 수집 작업</h4>
      <h5>*음성 수집 작업은 주어진 수집 데이터 목록에 해당하는 음성을 업로드하는 작업입니다</h5>
    </template>
    <b-list-group flush>
      <b-list-group-item>프로젝트 이름 : {{" "+ project.projectName}}</b-list-group-item>
      <b-list-group-item>프로젝트 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item><프로젝트 수집 데이터 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname.className}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">프로젝트 진행 방법</b-card-footer>
    <b-card-text class ="content">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">프로젝트 조건</b-card-footer>
    <b-card-text class ="content">{{project.conditionContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">프로젝트 예시 데이터</b-card-footer>
    <b-card-text class ="content">
        <AudioUpload v-if="audioUrl != ''" :value="audioUrl"></AudioUpload>
    </b-card-text>
     <br>
     <b-card-footer style="font-weight: bolder">음성 업로드</b-card-footer>
        <br>
        <b-form-file multiple
                v-model="audioContent"
                :state="Boolean(audioContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept="audio/*"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ audioContent ? audioContent.name : '' }}</div>
        <br>
        <b-card-footer style="font-weight: bolder">음성 녹음</b-card-footer>
        <br>
        <audio-recorder
            class = "audioRecorder"
            :time="10"
            :before-recording="callback"
            :pause-recording="callback"
            :after-recording="callback"
            :select-record="callback"
            :before-upload="callback"
            :successful-upload="callback"
            :failed-upload="callback"
            :removeIndex="callback"/>
            
    <br>
    <div class = "buttons">
        <b-button size="lg" variant="primary">
                Register
        </b-button>
        <b-button size="lg" variant="warning" v-on:click="upload" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> Upload
        </b-button>
    </div>
    <br>
    </b-card>
    <br>
    <br>
    </div>
</template>
<script>
import axios from 'axios';
import VueCropper from 'vue-cropperjs';
import AudioUpload from "../components/AudioUpload.vue";
import AudioWork from "../components/AudioCollectionWork.vue";
import VueAudioRecorder from 'vue-audio-recorder'

var ImageList = new Array();
var dataState = false; //데이터가 업로드 되었는지의 여부
let audioMaker = require('audiomaker');
let _audioMaker = new audioMaker();

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
    name: 'AudioCollection',
    components : {
        //AudioVisual
        AudioUpload,
        VueAudioRecorder,
    },
    data() {
        return {
            project: '',
            classNameList: [],
            createCollection: false,
            audioContent: '',
            audioRecordList : [],
            removedRecordList : [],
            audioUrl: '',
        }
    },
    async created() {
        this.fetchData();
        this.examplaDataDownload();
    },
    beforeMount() {
            delete localStorage.exampleContent;
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거

        if (dataState || !this.createCollection) {
            if (!window.confirm("페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
        delete localStorage.exampleContent;
        next();
    },
    methods : {
        async fetchData() {
            var searchproject = await localStorage.getItem('searchProject');//this.$route.params.project;
            console.log(JSON.parse(searchproject));

            this.project = JSON.parse(searchproject).projectDto;
            this.classNameList = JSON.parse(searchproject).classNameList;//this.$route.params.classList;
            console.log(this.project);
        },
        async examplaDataDownload(){
            // var exampleData = await localStorage.getItem('exampleContent');
            // console.log(exampleData);
            // if(exampleData == null){
            //         s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
            //             responseType : 'blob',
            //         }).then((res) =>{
            //             //var exampleFile = new File([res.data], this.project.exampleContent,{ type: res.headers['content-type'], lastModified : Date.now() } );
            //             const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
            //             console.log(url);
            //                 this.audioUrl = url;
            //                     var content = {
            //                         type : res.data.type,
            //                         url : url,
            //                     }
            //                 localStorage.exampleContent = JSON.stringify(content);
            //         });
            // }
            // else {
            //     var exampleLocal = await localStorage.getItem('exampleContent');
            //     var exampleLocalDataType = JSON.parse(exampleLocal).type;
            //     var exampleLocalData = JSON.parse(exampleLocal).url;
            //     this.audioUrl = exampleLocalData;
            // }   
        },
        ready() {
            this.$refs.mycom.seekTo(this.timeline)
        },
        onChangeAudios(e) {
            console.log(e.target.files);
            const file = e.target.files[0];
            this.audioUrl = URL.createObjectURL(file);
            console.log(this.audioUrl);
        },
        preventNav(event) {
                if (!dataState || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        callback (data) {

            console.log(data);
            if(typeof(data) == "object"){ // 오디오 파일
                 this.audioRecordList.push(data);
            }
           
            //console.log(this.audioRecordList);
        },
        async upload() { //formData 리스트!
            //var imageFormData = new Array(); 뭔가 formdata 리스트가 아니라 formdata에 append해서 보내는거 같다
        this.createCollection = true;
        var userId = await localStorage.getItem('userId');
        let audioData = new FormData();
           for(var uploadAudioFile of this.audioContent){
               audioData.append('files', uploadAudioFile);
               //imageFormData.push(imgUrl);
           }
           console.log("=========================================");
           console.log(this.audioRecordList);
           for(let i = 0; i < this.audioRecordList.length; i++){ //삭제된 오디오 녹음 파일 삭제
                console.log("helllo");
                console.log(this.audioRecordList[i].url);
               if(this.audioRecordList[i].url == null){
                   this.audioRecordList.splice(i,1);
               }
               
               
           }
           for(let i = 0; i < this.audioRecordList.length; i++){
               const file = new File([this.audioRecordList[i].url],userId+i+"_"+this.project.projectId, {type: 'audio/mp3', 
                    lastModified: Date.now()});
               audioData.append('files', file);
           }
           axios.defaults.headers.common['bucketName'] = this.project.bucketName;
           const collectionWorkRes = await axios.post("/api/work/collection", audioData, {
               params: {
                   projectId : this.project.projectId,
               }
            });
           if(collectionWorkRes.headers.upload == "success"){
               alert("수집 작업이 완료되었습니다!");
               this.$router.push("/");
           }
           else {
               alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
               //location.reload();
           }
           
        },


    }

 }
</script>
<style>
#imageCollectionLogo {
    width: 400px;
    height: 100px;
}
.workCard {
    max-width: 1000px;
    margin: auto;
    font-size : 20px;
}
#cropImg {
    margin: auto;
    max-width: 500px;
    max-height: 200px;
}
#previewImg {
    margin: auto;
    max-width: 800px;
    max-height: 600px;
}
.buttons {
    margin: auto;
    width: 50%;
}
.buttons button{
    margin: 5px;
    width: 150px;
}
.audioRecorder {
    margin: auto;
}
</style>