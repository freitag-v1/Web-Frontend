<template>
    <div class ="imageBoundingBox">
        <img id = "imageBoxLogo" src = "../assets/imageBoundingBox.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">이미지 바운딩 박스 작업</h4>
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
    <b-card-text class ="content">{{project.exampleContent}}</b-card-text>
    <div v-for="i in imageCount">
        <br>
    </div>
    <div class = "buttons">
        <b-button size="lg" variant="primary" v-on:click="addImage">
                <b-icon icon="file-earmark-plus" aria-label="Help"></b-icon> Add
        </b-button>
        <b-button size="lg" variant="warning" v-on:click="upload" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> Upload
        </b-button>
        <b-button size="lg" variant="warning" v-on:click="download" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> download
        </b-button>
        <img :src = "downloadUrl" v-if="downloadUrl != ''" style="width: 400px; height: 500px;"/>
        <AudioUpload v-if="audioUrl != ''" :value="audioUrl"/>
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
import AudioUpload from '../components/AudioUpload.vue';

var ImageList = new Array();
var dataState = false; //데이터가 업로드 되었는지의 여부

const endpoint = 'kr.object.ncloudstorage.com';
const region = 'kr-standard';
const access_key = 'InfcDU4FIzbmJ85y7trv';
const secret_key = 'AYdAOuv3f7UtkfJy2vGpjw2HQEWsE5VCWmlaFKYa';

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

const local_file_path = '../assets';

 export default {
    name: 'ImageCollection',
    components : {
        //ImageUpload
        AudioUpload,
    },
    data() {
        return {
            project: null,
            classNameList: [],
            imageCount: 1,
            createCollection: false,
            bucketName: '',
            downloadUrl: '',
            audioUrl: '',
            

        }
    },
    async beforeCreate() {
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    async created() {
        this.fetchData();
        var searchproject = await localStorage.getItem('searchProject');//this.$route.params.project;
        //console.log(JSON.parse(searchproject));
        this.bucketName = JSON.parse(searchproject).projectDto.bucketName;

    },
    watch : {
        '$route' : 'fetchData'
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거

        if (dataState || this.createCollection) {
            if (!window.confirm("페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
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
        preventNav(event) {
                if (!dataState || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        addImage() {
            this.imageCount += 1;
        },
        upload() { //formData 리스트!
            //var imageFormData = new Array(); 뭔가 formdata 리스트가 아니라 formdata에 append해서 보내는거 같다
        this.createCollection = true;
        let imgUrl = new FormData();
           for(var uploadImageFile of ImageList){
               imgUrl.append('file', uploadImageFile);
               //imageFormData.push(imgUrl);
           }
           console.log(imgUrl);//여기서 데이터 보내면 된다
           console.log("=========================================");
           
        },
        download() {
            console.log("hello!");
            var string = "안녕하세요.txt"
            var subString = ".txt";
            if(string.includes(subString)){
                s3Client.get("/freitag/안녕하세요.txt", {
                    responseType : 'text',
                }).then(res => {
                    console.log(res.data.type);
                    console.log(res.data);
                })
            }
            // s3Client.get("/freitag/안녕하세요.txt", {
            //     responseType : 'blob',
            // }).then(res => {
            //     const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
            //     console.log("hello!!!");
            //     console.log(res.data.type);
            //     if(res.data.type == "image/jpeg"){
            //         this.downloadUrl = url;
            //     }
            //     else if(res.data.type == "audio/x-m4a"){
            //         this.audioUrl = url;
            //     }
            //     console.log(url);
                
            //});
        }
        
        


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

</style>

