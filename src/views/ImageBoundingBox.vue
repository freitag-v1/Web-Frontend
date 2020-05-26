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

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
var ImageList = new Array();
var dataState = false; //데이터가 업로드 되었는지의 여부


const AWS = require('aws-sdk');
const fs = require('fs');
const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = 'sQG5BeaHcnvvqK4FI01A';
const secret_key = 'mvNVjSac240XvnrK4qF39HpoMvvtMQMzUnnNHaRV';

const S3 = new AWS.S3({
    endpoint : endpoint,
    region: region,
    credentials : {
        accessKeyId : access_key,
        secretAccessKey : secret_key,
    },
    apiVersion: '2006-03-01',
    httpOptions : {
        xhrWithCredentials : true,
    },
    sslEnabled : true,
});

AWS.config.update({region: 'REGION'});

const bucket_name = 'woneyhoney5';
const object_name = 'ㅋㅋ.HEIC';
const local_file_path = '../assets';

var params = {
  Bucket: bucket_name, /* required */
  CORSConfiguration: { /* required */
    CORSRules: [ /* required */
      {
        AllowedMethods: [ /* required */
          'GET',
          'PUT',
          /* more items */
        ],
        AllowedOrigins: [ /* required */
          'http://localhost:8081',
          /* more items */
        ],
        AllowedHeaders: [
          'Authorization',
          /* more items */
        ],
        MaxAgeSeconds: '3000'
      },
      /* more items */
    ]
  },
  ContentMD5: ''
};


 export default {
    name: 'ImageCollection',
    components : {
        //ImageUpload,
    },
    data() {
        return {
            project: null,
            classNameList: [],
            imageCount: 1,
            createCollection: false,

        }
    },
    created() {
        this.fetchData();
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
        async download() {
             console.log("hello!");
            // S3.putBucketCors(corsParams, function(err, data) {
            //     if (err) {
            //         // display error message
            //         console.log("Error", err);
            //     } else {
            //         // update the displayed CORS config for the selected bucket
            //         console.log("Success", data);
            //     }
            //     });

             S3.getObject(
                 { Bucket: bucket_name, Key : object_name },
                 function(error, data){
                     if(error != null) {
                         alert("Failed to retrieve an object: " + error);
                     }
                     else {
                         alert("Loaded " + data.ContentLength + " bytes");
                     }
                 }
            );

            // await S3.putBucketCors(params, function(err, data) {
            //     if (err) {
            //         // display error message
            //         console.log("Error", err);
            //     } else {
            //         // update the displayed CORS config for the selected bucket
            //         console.log("Success", data);
            //     }
            //     });
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

