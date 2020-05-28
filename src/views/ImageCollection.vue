<template>
    <div class ="imageCollection">
        <img id = "imageCollectionLogo" src = "../assets/imageCollection.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">이미지 수집 작업</h4>
      <h5>*이미지 수집 작업은 주어진 수집 데이터 목록에 맞는 이미지를 업로드 하는 작업입니다.</h5>
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
        <br>
        <img :src = "downloadUrl" v-if="downloadUrl != ''" style="width: 400px; height: 300px;"/>
        <AudioUpload v-if="audioUrl != ''" :value="audioUrl"/></b-card-text>

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
            <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
        </div>
        <br>
            <div class = "registeredImage" v-for="name in imageNameList">
                <br>
                <h4 v-if = "name.class == selected">< 이전에 등록된 이미지 이름 ></h4>
                <div v-if = "name.class == selected" v-for="index, value in name.name">
                    <p> {{ value+1 + ". " + index }}</p>

                </div>    
            </div>
        <br>
    <b-form-file multiple 
                v-model="imageContent"
                :state="Boolean(imageContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeImages"
                accept="image/*"
                ></b-form-file>
                <br>
                <p v-if="imageUrl!=''">{{ "업로드 데이터 " + imageContent[0].name + "의 preview" }} </p>
                <img id ="previewImg" v-if="imageUrl!=''" :src = "imageUrl"></img>
                <div class="mt-3"  v-for = "name, index in imageContent">
                    Selected file: {{ index + 1 + "." + name ? name.name : '' }}
                </div>
                <br>

    <div class = "buttons">
        <b-button variant="warning" v-on:click="upload" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> 이미지 등록
        </b-button>
        <b-button variant="warning" v-on:click="endWork" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> 작업 완료
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
import ImageUpload from '../components/ImageUpload.vue';


var ImageList = new Array();
var ImageByClassList = new Array();
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
    data() {
        return {
            project: '',
            classNameList: [],
            createCollection: false,
            imageContent: '',
            imageUrl : '',
            downloadUrl: '',
            audioUrl: '',
            options: [],
            selected : '',
            imageNameList: [],
        }
    },
    async created() {
        this.fetchData();
        var exampleData = await localStorage.getItem('exampleContent');
        console.log(exampleData);
        if(exampleData == null){
            // if(this.project.exampleContent.includes(".txt")){
            //     s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
            //         responseType: 'text',
            //     }).then((res) =>{
            //     var textExample = document.createElement('p');
            //     textExample.innerText = res.data;
            //     document.getElementById("exampleContent").appendChild(textExample);
            //     localStorage.exampleContent = res.data;
            //     }); 
            // }
            // else { // 이미지 데이터에 대해서만 처리를 한다 
                // s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                //     responseType : 'blob',
                // }).then((res) =>{
                //     const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                //     this.downloadUrl = url;
                //     var content = {
                //         type : res.data.type,
                //         url : url,
                //     }
                //     localStorage.exampleContent = JSON.stringify(content);

                // });
            
        }
        else {
            var exampleLocal = await localStorage.getItem('exampleContent');
            var exampleLocalDataType = JSON.parse(exampleLocal).type;
            var exampleLocalData = JSON.parse(exampleLocal).url;
             //예시데이터가 이미지인 경우
            this.downloadUrl = exampleLocalData;
            
            // else if(exampleLocalDataType.includes("audio/")){//예시데이터가 음성인 경우
            //     this.audioUrl = exampleLocalData;
            // }
            // else {//예시데이터가 텍스트인 경우
            //      var textExample = document.createElement('p');
            //     textExample.innerText = exampleLocalData;
            //     document.getElementById("exampleContent").appendChild(textExample);
            // }
        }   
    },
    watch : {
        '$route' : 'fetchData',
        // selected: function(val) {
        //     this.imageContent = null;
            
        // }
    },
    beforeMount() {
            delete localStorage.exampleContent;
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거

        if (ImageByClassList != null && !this.createCollection) {
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
            var optionDataList = new Array();
            for(let i = 0 ; i < this.classNameList.length; i++){
                var optionData = {
                    name : this.classNameList[i].className,
                    item : this.classNameList[i].className,
                }
                optionDataList.push(optionData);
               
            }
            this.options = optionDataList;
            this.selected = this.classNameList[0].className;
            console.log(this.options);
            console.log(this.project);
        },
        onChangeImages(e) {
            console.log(e.target.files);
            const file = e.target.files[0];
            this.imageUrl = URL.createObjectURL(file);    
            
        },
        preventNav(event) {
                if (ImageByClassList == null || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        upload() { //formData 리스트!
            //var imageFormData = new Array(); 뭔가 formdata 리스트가 아니라 formdata에 append해서 보내는거 같다
            
            let imgUrl = new FormData();
            var nameList = new Array();
            for(var uploadImageFile of this.imageContent){
                imgUrl.append('files', uploadImageFile);
                nameList.push(uploadImageFile.name);
            }
            var imageName = {
                name: nameList,
                class : this.selected,
            }
            var imageByClass = {
                class : this.selected,
                imgUrl : imgUrl,
            }
            var duplicatedIndex = -1;
            for(let i = 0; i < ImageByClassList.length; i++){
                console.log(this.selected);
                if(ImageByClassList[i].class == this.selected){
                    console.log("hello",i);
                    duplicatedIndex = i;
                }
            }
            if(duplicatedIndex != -1){
                //ImageByClassList.splice(duplicatedIndex,1);
                ImageByClassList[duplicatedIndex] = imageByClass;
                this.imageNameList[duplicatedIndex] = imageName;
                //duplicatedIndex = 0;
            }
            else {
                ImageByClassList.push(imageByClass);
                this.imageNameList.push(imageName);
            }
            duplicatedIndex = -1;
            console.log(imgUrl);//여기서 데이터 보내면 된다
            console.log(ImageByClassList);
            console.log("===================name===================");
            console.log(this.imageNameList);
            console.log("======================================");
            

           
        },
        async endWork(){
            var successCount = 0;
            this.createCollection = true;
            axios.defaults.headers.common['bucketName'] = this.project.bucketName;
            axios.defaults.headers.common['projectId'] = this.project.projectId;
            for(let i  = 0; i < ImageByClassList.length; i++){
                    await axios.post("/api/work/collection", ImageByClassList[i].imgUrl, {
                        params: {
                            projectId : 1,
                            //class : ImageByClassList[i].class,
                            // 파라미터로 class를 보내야한다. 
                        }
                    }).then((collectionWorkRes) => {
                        if(collectionWorkRes.headers.upload == "success"){
                            successCount++;
                            //alert("수집 작업이 완료되었습니다!");
                        
                        }
                        else {
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                            //location.reload();
                        }
                    })
                    .catch(function(error){
                        if(error.response){
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                        }
                })
            }
            if(successCount == ImageByClassList.length){
                alert("수집 작업이 완료되었습니다!");
                this.$router.push("/");
            }
        },
        // registerImageUrl(data) { //index를 저장을 해서 기존에 올린 사진을 수정하는 경우 추가되지 않고 변경해야해서 props로 index 주고 받고 해서 변경
        //         if(data != null) {
        //             dataState = true;
        //         }
        //         let i = data.index -1;
        //         let url  = data.url;
        //         if(ImageList[i] == null){
        //             ImageList.push(url);
        //         }
        //         else {
        //             ImageList.splice(i,1,url);

        //         }
        //         alert("등록완료!");
        //         console.log(ImageList);
        
        // }


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
    width: 200px;
}
.option{
    max-width : 200px;
    margin: auto;
}
</style>