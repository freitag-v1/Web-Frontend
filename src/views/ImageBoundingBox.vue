<template>
    <div class ="imageBoundingBox">
        <img id = "imageBoxLogo" src = "../assets/imageBoundingBoxLogo.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">이미지 바운딩 박스 작업</h4>
    </template>
    <b-list-group flush>
      <b-list-group-item>작업 이름 : {{" "+ project.projectName}}</b-list-group-item>
      <b-list-group-item>작업 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item><데이터 라벨 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname.className}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">라벨 진행 방법</b-card-footer>
    <b-card-text class ="content">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">라벨 조건</b-card-footer>
    <b-card-text class ="content">{{project.conditionContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">작업 예시 데이터</b-card-footer>
    <b-card-text class ="content">
        <br>
        <div class = "exampleClass" >
            <img id="exampleImage" :src = "downloadUrl" v-if="downloadUrl != ''" style="width: 400px; height: 300px;"/>
        </div>
        </b-card-text>
    <b-card-footer style="font-weight: bolder">이미지 바운딩 박스 작업</b-card-footer>
    <b-card-text class = "content">
    <img id="boundingBoxImage" :src = "boundingBoxProblemUrl" v-if="boundingBoxProblemUrl != ''"/>
    <b-form-file multiple 
                v-model="imageContent"
                :state="Boolean(imageContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeImages"
                accept="image/*"
                ></b-form-file>
        <canvas id="boundingImage" width="800" height="600"></canvas>
        <br> 
    </b-card-text>
    <div class="overflow-auto" style="margin : auto;">
        <b-pagination id="pagination"
         v-model="currentPage"
          :total-rows="problemList.length"
            per-page= 1
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"></b-pagination>
    </div>
    <div class = "buttons">
        <b-button size="lg" variant="primary" v-on:click="clearBox">
            박스 지우기
        </b-button>
        <b-button size="lg" variant="warning" v-on:click="upload" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> 업로드
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
//import VueCropper from 'vue-cropperjs';

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

//바운딩 박스를 그릴 때 필요한 데이터

var ctx;
var canvas;
var canvasX = 0;
var canvasY = 0;
var last_mouseX = 0;
var last_mouseY = 0;
var mouseX = 0;
var mouseY = 0;
var isMouseDown = false;




//마우스로 그림을 그리는 코드

//마우스가 눌러질 때
function down(e){
    last_mouseX = e.offsetX - canvasX;
    last_mouseY = e.offsetY - canvasY;
    isMouseDown = true;
}

//눌러진 마우스가 놓일 때
function up(e) {
    if(isMouseDown){
        ctx.beginPath();
        var width = mouseX - last_mouseX;
        var height = mouseY - last_mouseY;
        ctx.rect(last_mouseX, last_mouseY, width, height);
        ctx.strokeStyle = '#1E3269';
        ctx.lineWidth = 5;
        ctx.stroke();
        //이게 박스 좌표여서 이거를 서버에 보내면 된다. 
        console.log(last_mouseX, last_mouseY, width, height);
    }
    isMouseDown = false;
}

//마우스가 움직이는 동안
function move(e){
    mouseX = e.offsetX - canvasX;
    mouseY = e.offsetY - canvasY;

}


 export default {
    name: 'ImageCollection',
    components : {
        
    },
    data() {
        return {
            problemList:[],
            problem: '',
            classNameList: [],
            project: '',
            createCollection: false,
            bucketName: '',
            imageContent: '',
            imageUrl:'',
            ctx: '',
            canvas: '',
            bounding: '',
            boundingBoxProblemUrl : '',
            currentPage: 1,
            downloadUrl: '',

        }
    },
    async beforeCreate() {
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    async created() {
        this.fetchData();
        //this.examplaDataDownload();
        var searchproject = await localStorage.getItem('searchProject');//this.$route.params.project;
        //console.log(JSON.parse(searchproject));
        this.bucketName = JSON.parse(searchproject).projectDto.bucketName;
        //canvas를 생성해서 여기 위에서 진행을 할 수 있도록 
        this.canvas = document.getElementById("boundingImage");
        //var boundingImageData = '';
        this.ctx = this.canvas.getContext('2d');
        this.bounding = this.canvas.getBoundingClientRect(); //뭔가 바운딩을 하면 그림을 그려주는 느낌
        // 캔버스의 마우스 이벤트 핸들러 등록
        ctx = this.ctx;
        canvas = this.canvas;
        this.canvas.addEventListener( "mousemove", move);
        this.canvas.addEventListener( "mousedown", down);
        this.canvas.addEventListener( "mouseup", up);

        //this.ctx.strokeRect(0,0,800,600);

    },
    watch : {
        '$route' : 'fetchData',

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
        // async examplaDataDownload(){
        //     var exampleData = await localStorage.getItem('exampleContent');
        //     console.log(exampleData);
        //     if(exampleData == null){
        //             s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
        //                 responseType : 'blob',
        //             }).then((res) =>{
        //                 var exampleFile = new File([res.data], this.project.exampleContent,{ type: res.headers['content-type'], lastModified : Date.now() } );
        //                 const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
        //                 console.log(url);
        //                     this.downloadUrl = url;
        //                         var content = {
        //                             type : res.data.type,
        //                             file : exampleFile,
        //                         }
        //                     localStorage.exampleContent = JSON.stringify(content);
        //             });
        //     }
        //     else {
        //         var exampleLocal = await localStorage.getItem('exampleContent');
        //         var exampleLocalDataType = JSON.parse(exampleLocal).type;
        //         var exampleLocalData = JSON.parse(exampleLocal).file;

        //         this.downloadUrl = URL.createObjectURL(exampleLocalData);
        //     }   
        // },
        preventNav(event) {
                if (!dataState || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        clearBox() {
            this.ctx = clearRect(0, 0, canvas.width, canvas.height);

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
        onChangeImages(e) {
            console.log(e.target.files);
            const file = e.target.files[0];
            this.imageUrl = URL.createObjectURL(file);    
            //this.$refs.cropper.replace(this.imageUrl);
            var originalImage = new Image();
            originalImage.src = this.imageUrl;
            //boundingImageData = this.imageUrl;
            var imageContext = this.ctx;
            
            originalImage.onload = function() {
                var scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
                var x = (canvas.width / 2) - (originalImage.width / 2) * scale;
                var y = (canvas.height / 2) - (originalImage.height / 2) * scale;
                imageContext.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
            }
            
        },
        
    }

 }
</script>
<style>
#imageBoxLogo {
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
canvas {
    cursor : crosshair;
}
</style>

