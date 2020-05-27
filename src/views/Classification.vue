<template>
    <div class ="imageCollection">
        <img src = "../assets/classification.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">분류 작업</h4>
      <br>
      <p>*분류 작업은 주어진 데이터를 주어진 라벨링 클래스를 보고 적합한 것을 선택하여 분류하는 작업입니다</p>
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
    <b-card-text id = "exampleContent"class="content"> 
        <br>
        <img :src = "downloadUrl" v-if="downloadUrl != ''" style="width: 400px; height: 300px;"/>
        <AudioUpload v-if="audioUrl != ''" :value="audioUrl"/>
    </b-card-text>
    <div v-for="i in imageCount">
        <br>
    </div>
    <div class = "buttons">
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
import AudioUpload from '../components/AudioUpload.vue';
var dataState = false; //데이터가 업로드 되었는지의 여부

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
            problemList : [],
        }
    },
    async created() {
        this.fetchData();
        this.examplaDataDownload();
    },
    watch : {
        '$route' : 'fetchData'
    },
    beforeMount() {
            delete localStorage.exampleContent;
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
            this.bucketName = JSON.parse(searchproject).projectDto.bucketName;
            var problemRes = await axios.get("/api/work/labelling", {
                params: {
                    projectId : this.project.projectId,
                }
            });
            if(problemRes.headers.problems == "success"){
                this.problemList = problemRes.data; 
            }
            else {
                alert("문제를 가져오는데 실패하였습니다.");
            }
        },
        async examplaDataDownload(){
            var exampleData = await localStorage.getItem('exampleContent');
            console.log(exampleData);
            if(exampleData == null){
                if(this.project.exampleContent.includes(".txt")){
                    s3Client.get("/"+this.bucketName+"/"+this.project.exampleContent, {
                        responseType: 'text',
                    }).then((res) =>{
                    var textExample = document.createElement('p');
                    textExample.innerText = res.data;
                    document.getElementById("exampleContent").appendChild(textExample);
                    localStorage.exampleContent = res.data;
                    }); 
                }
                else {
                    s3Client.get("/"+this.bucketName+"/"+this.project.exampleContent, {
                        responseType : 'blob',
                    }).then((res) =>{
                        var exampleFile = new File([res.data], this.project.exampleContent,{ type: res.headers['content-type'], lastModified : Date.now() } );
                        const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        if(res.data.type.includes("image/")){
                            this.downloadUrl = url;
                            console.log(res.data.type);
                            var content = {
                                type : res.data.type,
                                file : exampleFile,
                            }
                            console.log(exampleFile);
                            localStorage.exampleContent = JSON.stringify(content);
                        }
                        else{
                            this.audioUrl = url;
                            var content = {
                                type : res.data.type,
                                url : exampleFile,
                            }
                            localStorage.exampleContent = JSON.stringify(content);
                        }
                    });
                }
            }
            else {
                var exampleLocal = await localStorage.getItem('exampleContent');
                var exampleLocalDataType = JSON.parse(exampleLocal).type;
                var exampleLocalData = JSON.parse(exampleLocal).url;
                if(exampleLocalDataType.includes("image/")){ //예시데이터가 이미지인 경우
                    this.downloadUrl = exampleLocalData;
                }
                else if(exampleLocalDataType.includes("audio/")){//예시데이터가 음성인 경우
                    this.audioUrl = exampleLocalData;
                }
                else {//예시데이터가 텍스트인 경우
                    var textExample = document.createElement('p');
                    textExample.innerText = exampleLocalData;
                    document.getElementById("exampleContent").appendChild(textExample);
                }
            }   
        },
        async problemDownload() {

        },
        preventNav(event) {
                if (!dataState || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
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
            // if(string.includes(subString)){
            //     s3Client.get("/freitag/안녕하세요.txt", {
            //         responseType : 'text',
            //     }).then(res => {
            //         console.log(res.data.type);
            //         console.log(res.data);
            //     })
            // }
        }
    }
}
</script>
