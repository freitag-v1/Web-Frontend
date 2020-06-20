<template>
    <div class ="imageCollection">
        <img id = "imageCollectionLogo" src = "../assets/imageCollection.png">
        <b-card
        class = "workCard"
        no-body
        >
    <template v-slot:header>
      <h4 class="mb-0">이미지 수집 작업</h4>
      <h5>*이미지 수집 작업은 주어진 수집 데이터 라벨에 맞는 이미지를 업로드 하는 작업입니다.</h5>
    </template>
    <b-list-group flush>
      <b-list-group-item class = "workContent">작업 이름 : {{" "+ project.projectName}}</b-list-group-item>
      <b-list-group-item class = "workContent">작업 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item class = "workContent"><데이터 라벨 목록>
        <div class = "workContent" v-for="(classname, index) in classNameList" v-bind:key="index">
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
    <p class="linecontent" >{{project.conditionContent}}</p>
    <br>
    <b-card-footer style="font-weight: bolder">작업 예시 데이터</b-card-footer>
    <b-card-text class ="content">
        <br>
        <div class = "exampleClass" >
            <img id="exampleImage" :src = "downloadUrl" v-if="downloadUrl != ''" style="width: 400px; height: 300px;"/>
        </div>
        </b-card-text>

    <b-card-footer style="font-weight: bolder">이미지 수집 데이터 업로드</b-card-footer>
        <br>
        <h5>*이미지 등록 버튼을 눌러야 작업이 완료가 됩니다! 꼭 버튼을 눌러주세요!</h5>
        <div>
            <b-form-radio-group
            v-model="selected"
            :options="options"
            class="option"
            value-field="item"
            text-field="name"
            ></b-form-radio-group>
            <div class="mt-3">선택된 라벨: <strong>{{ selected }}</strong></div>
        </div>
        <br>
            <div class = "registeredImage" v-for="name in imageByClassList">
                <h4 v-if = "name.class == selected">< 이전에 등록된 이미지 이름 ></h4>
                <div v-if = "name.class == selected" v-for="(index, value) in name.name">
                    <p> {{ value+1 + ". " + index }}</p>
                </div>    
            </div>
        <br>
    <b-form-file multiple 
                v-model="imageContent"
                :state="Boolean(imageContent)"
                placeholder="파일을 선택하거나 끌어서 놓아주세요."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeImages"
                accept="image/*"
                ></b-form-file>
                <br>
                <p v-if="imageUrl!=''">{{ "업로드 데이터 " + imageContent[0].name + "의 preview" }} </p>
                <img id ="previewImg" v-if="imageUrl!=''" :src = "imageUrl"></img>
                <div class="mt-3"  v-for = "(name, index) in imageContent">
                    Selected file: {{ index + 1 + "." + name ? name.name : '' }}
                </div>
                <br>

    <div class = "buttons">
        <b-button id = "registerButton" v-on:click="upload">
                <b-icon icon="download"></b-icon> 이미지 등록
        </b-button>
        <b-button id= "endWorkButton" v-on:click="endWork">
                <b-icon icon = "upload"></b-icon> 작업 완료
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
    data() {
        return {
            project: '',
            classNameList: [],
            createCollection: false,
            imageContent: '',
            imageUrl : '',
            downloadUrl: '',
            options: [],
            selected : '',
            imageByClassList: [],
        }
    },
    async beforeCreate() {
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    watch: {
        '$route' : 'fetchData',
        selected : function(val){
            this.imageContent = '';
            this.imageUrl = '';
        }
    },
    async created() {
        this.fetchData();
        this.exampleContentDownload();
          
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거
        if (this.imageByClassList != null && !this.createCollection) {
            if (!window.confirm("페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
        next();
    },
    methods : {
        async exampleContentDownload(){
            s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                responseType : 'blob',
                }).then((res) =>{
                    var exampleFile = new File([res.data], this.project.exampleContent,{ type: res.headers['content-type'], lastModified : Date.now() } );
                    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                    this.downloadUrl = url;
                    var content = {
                        type : res.data.type,
                        file : exampleFile,
                    }
                });
            
        },
        async fetchData() {
            var searchproject = await localStorage.getItem('searchProject');
            this.project = JSON.parse(searchproject).projectDto;
            this.classNameList = JSON.parse(searchproject).classNameList;
            var optionDataList = new Array();
            //class 이름들을 선택할 수 있도록 option에 넣기 위해서
            for(let i = 0 ; i < this.classNameList.length; i++){
                var optionData = {
                    name : this.classNameList[i].className,
                    item : this.classNameList[i].className,
                }
                optionDataList.push(optionData);
            }
            this.options = optionDataList;
            this.selected = this.classNameList[0].className;
            await s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                    responseType: 'blob',
                }).then((res) => {
                    const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                    this.downloadUrl = url;
                });
        },
        onChangeImages(e) {
            const file = e.target.files[0];
            this.imageUrl = URL.createObjectURL(file);      
        },
        preventNav(event) {
                if (this.imageByClassList == null || this.createCollection) return;
                event.preventDefault();
                event.returnValue = "";
        },
        upload() {
            let imageFile = new FormData();
            var nameList = new Array();
            for(var uploadImageFile of this.imageContent){
                imageFile.append('files', uploadImageFile);
                nameList.push(uploadImageFile.name);
            }
            var imageByClass = {
                class : this.selected,
                imageFile : imageFile,
                name: nameList,
            }
            var duplicatedIndex = -1;
            for(let i = 0; i < this.imageByClassList.length; i++){
                if(this.imageByClassList[i].class == this.selected){
                    duplicatedIndex = i;
                }
            }
            if(duplicatedIndex != -1){
                this.imageByClassList[duplicatedIndex] = imageByClass;
            }
            else {
                this.imageByClassList.push(imageByClass);
            }
            duplicatedIndex = -1;
        },
        async endWork(){
            var successCount = 0;
            this.createCollection = true;
            axios.defaults.headers.common['bucketName'] = this.project.bucketName;
            axios.defaults.headers.common['projectId'] = this.project.projectId;
            for(let i  = 0; i < this.imageByClassList.length; i++){
                    await axios.post("/api/work/collection", this.imageByClassList[i].imageFile, {
                        params: {
                            className : this.imageByClassList[i].class,
                        }
                    }).then((collectionWorkRes) => {
                        if(collectionWorkRes.headers.upload == "success"){
                            successCount++;
                        }
                        else {
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                            location.reload(); //새로고침을 해서 이전에 한 작업들을 지울 수 있도록 
                        }
                    })
                    .catch(function(error){
                        if(error.response){
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                        }
                })
            }
            if(successCount == this.imageByClassList.length){
                alert("수집 작업이 완료되었습니다!");
                this.$router.push("/");
            }
        },

    }

 }
</script>
<style>
#imageCollectionLogo {
    width: 380px;
    height: 100px;
}
.workCard {
    max-width: 1000px;
    margin: auto;
    font-size : 20px;
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
.option{
    max-width : 200px;
    margin: auto;
}
#exampleImage {
    max-width: 100%;
    height: auto;
}
.exampleClass{
    width: 25%;
    margin: auto;
}
.linecontent {
    font-family:'Jeju Gothic', sans-serif;
    white-space : pre-line;
    font-weight: lighter;
    font-size : 20px;
}
#registerButton {
    width: 200px;
    background-color : #4682B4;
    border: none;
    font-size: 19px;
    color : black;
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
    background-color : #FA8072;
    border : none;
    font-size: 19px;
    color : black;
}
#endWorkButton:hover {
  background-color: #fa8072;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
.workContent {
    font-size : 20px;
}
</style>