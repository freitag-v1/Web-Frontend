<template>
    <div class ="imageCollection">
        <img id= "textCollectionLogo"src = "../assets/textCollection.png">
         <b-card
        class = "workCard"
        no-body
  >
         <template v-slot:header>
      <h4 class="mb-0">텍스트 수집 작업</h4>
      <h5>*텍스트 수집 작업은 주어진 수집 데이터 라벨에 해당하는 텍스트를 업로드하는 작업입니다</h5>
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
    <b-card-footer style="font-weight: bolder">작업 방법</b-card-footer>
    <br>
    <b-card-text class ="content">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">작업 조건</b-card-footer>
    <br>
    <b-card-text class ="content">{{project.conditionContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">예시 데이터</b-card-footer>
    <br>
    <b-card-text class ="content">
        <div v-if = "textExampleList != null" v-for="index, value in textExampleList">
            <p>{{value+1 + "번 질문 : " + index.question}}</p>
            <p>{{value+1 + "번 답변 : " + index.answer}}</p>
        </div>
        <div v-if="textData != null">
        {{textData}}
        </div>
    </b-card-text>
     <br>
     <b-card-footer style="font-weight: bolder">텍스트 데이터 업로드</b-card-footer>
        <br>
        <h5>*텍스트 등록 버튼을 눌러야 작업이 완료가 됩니다! 꼭 버튼을 눌러주세요!</h5>
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
            <div class = "registeredImage" v-for="name in textNameList">
                <br>
                <h4 v-if = "name.class == selected">< 이전에 등록된 텍스트 이름 ></h4>
                <div v-if = "name.class == selected" v-for="index, value in name.name">
                    <p> {{ value+1 + ". " + index }}</p>

                </div>    
            </div>
        <br>
        <b-form-file multiple
                v-model="textContent"
                :state="Boolean(textContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept="text/*"
                ></b-form-file>
                <br>
                <p v-if="textPreUrl !=''">{{ "업로드 데이터 " + textContent[0].name + "의 preview" }} </p>
                <AudioUpload v-if="textPreUrl !=''" :value = "textPreUrl"/>
                <br>
                <div class="mt-3" v-for = "name, index in textContent">
                Selected file: {{ index + 1 + "." + name ? name.name : '' }}</div>
        <br>
    <b-card-footer style="font-weight: bolder">텍스트 데이터 작성</b-card-footer>
        <br>
        <h5>*텍스트 등록 버튼을 눌러야 작업이 완료가 됩니다! 꼭 버튼을 눌러주세요!</h5>
        <br>
            <b-button variant="light" id="addTextButton" v-on:click="addText" >
                   텍스트 데이터 추가 <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
        <br>
        <div class = "exampleTextForm" v-for="(item, i) in exampleTextConversation">
                
                <br>
                <b-card style="width: 900px; margin: auto;">
                <b-button variant="danger" id="deleteTextButton" v-on:click="deleteText(i)" >
                    삭제 <b-icon icon="dash" aria-hidden="true"></b-icon>
                </b-button>
                <br>
                <br>
                <p>질문</p>
                <b-form-textarea
                    id="inputExample"
                    v-model="item.question"
                    placeholder="텍스트 수집 데이터를 작성해주세요."
                ></b-form-textarea>
                <br>
                <p>답변</p>
                <b-form-textarea
                    id="inputExample"
                    v-model="item.answer"
                    placeholder="텍스트 수집 데이터를 작성해주세요."
                ></b-form-textarea>
                <br>
                
                </b-card>
                <br>
            </div>
    
    <br>
    <div class = "buttons">
        <b-button id = "registerButton" variant="warning" v-on:click="upload" v-model ="createCollection">
                    <b-icon icon="upload"></b-icon> 텍스트 등록
                </b-button>
        <b-button variant="warning"  v-model ="createCollection" v-on:click="endWork">
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

const endpoint = 'kr.object.ncloudstorage.com';
const region = 'kr-standard';
const access_key = '4WhQkGZPLH1sVg6cWLtK';
const secret_key = 'xmKmQXfbYyyPuXyEw1KeDXE7CveACDQdWUPACtzP';

const v4 = require('aws-signature-v4');

var TextByClassList = new Array();

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
    name : 'TextCollection',
    data() {
        return {
            project: '',
            classNameList: [],
            createCollection : false,
            textContent: '',
            textPreUrl: '',
            options: [],
            selected : '',
            textNameList: [],
            textExampleList : [],
            textData: null,
            textExampleCount: 1,
            exampleQuestionText: null,
            exampleAnswerText: null,
            exampleTextConversation: [{question : "", answer : ""}],
        }
    },
    async beforeCreate() {
        axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    async created() {
        this.fetchData();
    },
    watch : {
        selected : function(val){
            this.textContent = '';
            this.textPreUrl = '';
            this.exampleTextConversation = [{question : "", answer : ""}];
            
        },
    },
    beforeMount() {
            delete localStorage.exampleContent;
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거
        delete localStorage.exampleContent;
        if (this.textNameList != null &&  !this.createCollection) {
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
            
            this.project = JSON.parse(searchproject).projectDto;
            console.log(this.project);
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
            console.log(this.project);
                console.log(this.project.bucketName, this.project.exampleContent);
                if(this.project.exampleContent.includes(this.project.projectName+this.project.userId+"exampleTextWrite.txt")) { // 질문 답변 직접 작성해서 넣은 경우
                    await s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                            responseType : 'text',
                        }).then((res) =>{
                            console.log(res.data);
                            this.textExampleList = res.data;
                            console.log(this.textExampleList);
            
                                //localStorage.exampleContent = JSON.stringify(content);
                        });
                }
                else { //그냥 텍스트 데이터를 올린 경우 
                    await s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                            responseType : 'text',
                        }).then((res) =>{
                            this.textData = res.data;
                            console.log(this.textData);
            
                                //localStorage.exampleContent = JSON.stringify(content);
                        });
                }

        },
        addText() {
            console.log(this.exampleAnswerText, this.exampleQuestionText);
            // var conversation = {
            //     question : this.exampleQuestionText,
            //     answer : this.exampleAnswerText,
            // }
            this.exampleTextConversation.push({question : '', answer: ''});
            console.log(this.exampleTextConversation);
            // console.log(JSON.stringify(this.exampleTextConversation))

            
        },
        preventNav(event) {
                if (AudioByClassList == null || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        deleteText(index) {
            console.log(this.exampleAnswerText, this.exampleQuestionText);
            // var conversation = {
            //     question : this.exampleQuestionText,
            //     answer : this.exampleAnswerText,
            // }
            this.exampleTextConversation.splice(index, 1);
            console.log(this.exampleTextConversation);
            // console.log(JSON.stringify(this.exampleTextConversation))

            
        },
        async upload() {
            var userId = await localStorage.getItem('userId');
            var nameList = new Array();
            let textUploadData = new FormData();
            if(this.textContent != null){ //텍스트 데이터 업로드
                for(var uploadTextFile of this.textContent){
                    textUploadData.append('files', uploadTextFile);
                    nameList.push(uploadTextFile.name);
                }
            }//텍스트에 글을 쓰고 한개이상이 있는경우 텍스트를 작성한 것이므로 
             console.log(this.exampleTextConversation.length);
            if(this.exampleTextConversation.length >= 1) {
                for(let i = 0; i < this.exampleTextConversation.length; i++){
                    if(this.exampleTextConversation[i].question != "" && this.exampleTextConversation[i].answer != ""){
                        var jsonTextExample = JSON.stringify(this.exampleTextConversation[i]);
                        var exampleTextFile = new File([jsonTextExample], Date.now()+userId+this.project.projectName+"workTextWrite.txt",{type: "text/plain;charset=utf-8"});
                        textUploadData.append('files',exampleTextFile);
                        nameList.push(exampleTextFile.name);
                    }
                }
            }
            var textByClass = {
                class : this.selected,
                textFormData : textUploadData,
                textConversation : this.exampleTextConversation
            }
            var textName = {
                class : this.selected,
                name : nameList,
            };

            var duplicatedIndex = -1;
            for(let i = 0; i < TextByClassList.length; i++){
                console.log(this.selected);
                if(TextByClassList[i].class == this.selected){
                    console.log("hello",i);
                    duplicatedIndex = i;
                }
            }
            if(duplicatedIndex != -1){
                //ImageByClassList.splice(duplicatedIndex,1);
                TextByClassList[duplicatedIndex] = textByClass;
                this.textNameList[duplicatedIndex] = textName;
                //duplicatedIndex = 0;
            }
            else {
                TextByClassList.push(textByClass);
                this.textNameList.push(textName);
            }
            duplicatedIndex = -1;
            //if(this.exampleTextConversation)
            console.log(TextByClassList);
            console.log(this.textNameList);


        },
        async endWork() {
            var successCount = 0;
            this.createCollection = true;
            axios.defaults.headers.common['bucketName'] = this.project.bucketName;
            axios.defaults.headers.common['projectId'] = this.project.projectId;
            for(let i  = 0; i < TextByClassList.length; i++){
                    await axios.post("/api/work/collection", TextByClassList[i].textFormData, {
                        params: {
                            className : TextByClassList[i].class,
                            // 파라미터로 class를 보내야한다. 
                        }
                    }).then((collectionWorkRes) => {
                        if(collectionWorkRes.headers.upload == "success"){
                            successCount++;
                        }
                        else {
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                            this.$router.push("/project");
                            //location.reload();
                        }
                    })
                    .catch(function(error){
                        if(error.response){
                            alert("수집 작업이 실패하였습니다. 다시 시도해주세요!");
                            this.$router.push("/project");
                        }
                })
            }
            if(successCount == TextByClassList.length){
                alert("수집 작업이 완료되었습니다!");
                this.$router.push("/");
            }
        }
    }
}
</script>
<style>
#textCollectionLogo {
    width : 400px;
    height : 100px;
}
#addTextButton {
    width: 300px;
    margin: auto;
}
#deleteTextButton {
    width: 150px;
    float : right;
}
#registerButton {
    width: 150px;
    margin: auto;
}
</style>