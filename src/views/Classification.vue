<template>
    <div class ="classification">
        <img src = "../assets/classification.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">분류 작업</h4>
      <br>
      <p>*분류 작업은 주어진 데이터를 보고 문제에 맞게 답을 선택하는 작업입니다.</p>
    </template>
    <br>
    <b-card-footer style="font-weight: bolder">분류 작업</b-card-footer>
    <br>
    <h4 style="color : tomato;">*분류 문제마다 작업 결과를 등록해야 분류 작업이 완료됩니다!</h4>
        <br>
    <div class = "collectionWork">
        <h4>{{"< "+currentPage + "번째 작업 >"}}</h4>
        <span>{{ "문제 번호: " +this.problem.problemId}}</span>
        <br>
        <br>
        <h4 v-if = "boundingProblem == false">{{currentPage + "번째 문제 : 데이터에 해당하는 라벨을 선택하시면 됩니다."}}</h4>
        <br>
        <br>
        <canvas id = "boundingcanvas" width="0" height="0"></canvas>
        <img id = "problemImage" v-if = "problemImageUrl != ''" :src= "problemImageUrl"/>
        <AudioUpload v-if="problemAudioUrl != ''" :value = "problemAudioUrl"/>
        <b-card v-if="textQnA != '' || textData != ''"style="width: 900px; margin: auto;">
                <b-card-text class ="content">
                <div v-if = "textQnA != ''" v-for="index, value in textQnA">
                    <p>{{value+1 + "번 질문 : " + index.question}}</p>
                    <p>{{value+1 + "번 답변 : " + index.answer}}</p>
                </div>
                <div v-if="textData != ''">
                {{textData}}
                </div>
            </b-card-text>
                
        </b-card>
        <br>
        
    </div>
    <br>
    <br>
    <h5 v-if="boundingProblem == false"><데이터 라벨></h5>
    <br>
    <b-form-checkbox-group
            v-model="selected"
            :options="options"
            v-if="boundingProblem == false"
            class="option"
            ></b-form-checkbox-group>
    <div v-if="boundingProblem == true" v-for="index, value in boundingBoxAnswers">
        <br>
        <h5 v-if = "boundingProblem == true">{{currentPage+"-"+(value+1)+"번째 문제 : 위 사진 속 "+(value+1)+"번 바운딩 박스가 주어진 작업 조건에 맞게 "+index.className+"을(를) 포함하고 있습니까?"}} </h5>
        <b-form-radio-group
                v-model="selectedBoxAnswer[value]"
                :options="yesornoOptions"
                v-if="boundingProblem == true"
                class="option"
                ></b-form-radio-group>
    </div>  
    <br>      
    <div class = "buttons">
        <b-button id = "workRegister" variant="warning" v-on:click="register" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> 작업 결과 등록
        </b-button>
        <b-button variant="warning" v-on:click="upload" v-if= "currentPage == 5" v-model ="createCollection">
                <b-icon icon="upload"></b-icon> 작업 완료
        </b-button>
        
    </div>
    <br>
    </b-card>
    <br>
    <br>
    <div class="overflow-auto" style="margin : auto;">
        <b-pagination id="pagination"
         v-model="currentPage"
          :total-rows="problemList.length"
            per-page= 1
            first-text="처음"
            prev-text="이전"
            next-text="다음"
            last-text="마지막"></b-pagination>
    </div>
    </div>
</template>
<script>
import axios from 'axios';
import AudioUpload from '../components/AudioUpload.vue';
//import ClassificationWork from '../components/ClassificationWork.vue';
var dataState = false; //데이터가 업로드 되었는지의 여부

const endpoint = 'kr.object.ncloudstorage.com';
const region = 'kr-standard';
const access_key = '4WhQkGZPLH1sVg6cWLtK';
const secret_key = 'xmKmQXfbYyyPuXyEw1KeDXE7CveACDQdWUPACtzP';

const v4 = require('aws-signature-v4');
var AnswerList = new Map();
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

//색 랜덤으로 추출하는거
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


var globalctx;

function workedBoxDraw(x, y, width, height, index){
    globalctx.beginPath();
    globalctx.rect(x, y, width, height);
    //선택된 class에 맞는 색을 찾음.
    var currentColor = getRandomColor();
    //색으로 그림을 그리고 어떤 class에 해당하는지 글로 보여주고
    globalctx.strokeStyle = currentColor;
    globalctx.lineWidth = 5;
    globalctx.stroke();
    globalctx.font = "italic bolder 30px Verdana";
    globalctx.fillStyle = currentColor;
    globalctx.fillText(index+1, x + 5, y - 5);
        }
export default {
    name: 'ImageCollection',
    components : {
        //ImageUpload
        AudioUpload,
        //ClassificationWork,
    },
    data() {
        return {
            imageCount: 1,
            createCollection: false,
            bucketName: '',
            problemList : [],
            problemContent: [],
            index: 0,
            problemImageUrl: '',
            problemAudioUrl :'',
            textData: '',
            problem: '',
            currentPage : 1,
            problemContentList: [],
            selected: '',
            options: [],
            currentProblem: '',
            historyId: '',
            textQnA: [],
            boundingProblem: false,
            canvas : '',
            ctx : '',
            selectedBoxAnswer: [],
            boundingBoxAnswers: [],
            yesornoOptions: [ { value : 'yes', text : '예'}, { value : 'no', text : '아니오'}],

        }
    },
    async created() {
        this.fetchData();
        //this.initialData();
        //this.examplaDataDownload();
    },
    mounted() {
        this.canvas = document.getElementById("boundingcanvas");
        console.log(document.getElementById("boundingcanvas").width);
        this.ctx = this.canvas.getContext('2d');
        globalctx = this.ctx;
    },
    watch : {
        '$route' : 'fetchData',
        currentPage : async function(val){ //변할 때마다 문제 달리 보여지도록
            //console.log("plaeadsd");
            this.problemImageUrl = '';
            this.problemAudioUrl = '';
            this.textData = '';
            this.textQnA = [];
            this.currentProblem = '';
            this.selected = [];
            this.selectedBoxAnswer = [];
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.boundingProblem = false;
            this.problem = this.problemList[val -1].problemDto;
            //이미지 수집에 대한 교차검증 문제
            if(this.problemContentList[val -1].type.includes("image/") && this.problemList[val - 1].boundingBoxList == null){
                this.problemImageUrl = this.problemContentList[val -1].blob;
            }
            //음성 수집에 대한 교차검증 문제
            else if (this.problemContentList[val -1].type.includes("audio/")){
                
                this.problemAudioUrl = this.problemContentList[val -1].blob;
                console.log(this.problemAudioUrl);
            } //사용자가 텍스트를 등록하여 수집을 한 경우
            else if(this.problemContentList[val -1].type == 'textQnA'){

                this.textQnA.push(this.problemContentList[val -1].blob);
                console.log(this.textQnA.question);
            }
            //바운딩 박스에 대한 교차 검증인 경우
            else if(this.problemList[val - 1].boundingBoxList != null){
                this.boundingProblem = true;
                var originalImage = new Image();
                originalImage.src = this.problemContentList[val- 1].blob;
                this.canvas.width = 800;
                this.canvas.height = 600;
                this.ctx.clearRect(0,0, 800, 600);
                var imageContext = this.ctx;
                var imageCanvas = this.canvas;
                var boxList = this.problemList[val -1].boundingBoxList;
                this.boundingBoxAnswers = boxList;
                originalImage.onload = function() {
                var scale = Math.min(imageCanvas.width / originalImage.width, imageCanvas.height / originalImage.height);
                var x = (imageCanvas.width / 2) - (originalImage.width / 2) * scale;
                var y = (imageCanvas.height / 2) - (originalImage.height / 2) * scale;
                imageContext.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
                    for(let i = 0; i < boxList.length; i++){
                        var coordinate = boxList[i].coordinates.split(" ");
                            workedBoxDraw(Number(coordinate[0]), Number(coordinate[1]), Number(coordinate[2]), 
                                Number(coordinate[3]), i);
                    }
                }

            }
            else { // 사용자가 그냥 데이터를 업로드한 경우
                this.textData = this.problemContentList[val -1].blob;
            }
            
            this.options = [];
            for(let i = 0; i < this.problemList[val -1].classNameList.length; i++){
                var option = { value : this.problemList[val -1].classNameList[i].className, text : this.problemList[val -1].classNameList[i].className };
                this.options.push(option);
            }
            var option = { value : '없음', text : '없음'};
                this.options.push(option);
        }

        
    },
    beforeMount() {
            delete localStorage.problemList;
            delete localStorage.problemData;
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거
        delete localStorage.problemList;
        delete localStorage.problemData;
        if (this.AnswerList != null && this.createCollection) {
            if (!window.confirm("페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
        delete localStorage.exampleContent;
        next();
    },
    methods : {
        async fetchData() {
            axios.defaults.headers.common['dataType'] = 'classification';
            axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
            console.log(axios.defaults.headers.common['authorization']);
        
                await axios.get("/api/work/classification/start").then((problemRes) => {
                    console.log(problemRes.headers.problems);
                    if(problemRes.headers.problems == "success"){
                        this.historyId = problemRes.headers.workhistory;
                        this.problemList = problemRes.data; 
                        this.problem = this.problemList[0].problemDto;
                        localStorage.problemList = JSON.stringify(problemRes.data); //가져와서 나중에 다운로드해서 데이터를 가져와서 저장할 수 있도록 
                        console.log(problemRes.data);
                    }
                    else {
                        alert("문제를 가져오는데 실패하였습니다.");
                        window.location.href = "/project/startLabelling";
                    }
                })
                .catch(function(error) {
                    if(error.response){
                        alert("생성된 분류 작업이 없습니다!");
                        window.location.href = "/project/startLabelling";
                    }
                })
                for(let i = 0; i < this.problemList.length; i++){
                    console.log("hello", this.problemList.length);
                    //텍스트 수집에 대한 교차검증문제인 경우 
                    if(this.problemList[i].problemDto.objectName.includes(".txt")){ 
                        await s3Client.get("/"+this.problemList[i].problemDto.bucketName+"/"+this.problemList[i].problemDto.objectName, {
                            responseType: 'text'
                        }).then(res =>  {
                            console.log(res);
                            var textData = res.data;
                            console.log(textData);
                            //사용자가 직접 텍스트를 등록하여 데이터를 제공한 경우 //원래 이름 확인할 때 this.problemList[i].problemDto.projectName+이거 붙여야한다.
                            //console.log("workTextWrite.txt");
                            if(this.problemList[i].problemDto.objectName.includes("workTextWrite.txt")){
                                var problemBlob = {
                                    type : 'textQnA',
                                    blob : textData,
                                }
                            }
                            else {
                                 var problemBlob = {
                                    type : 'textData',
                                    blob : textData,
                                }
                            }
                            this.problemContentList.push(problemBlob);
                        });
                    }
                    // //바운딩 박스에 대한 교차검증 문제인 경우
                    // else if(this.problemList[i].boundingBoxList != null){
                    //     this.canvas = document.getElementById("boundingcanvas");
                    //     this.ctx = this.canvas.getContext('2d');
                    //     await s3Client.get("/"+this.problemList[i].problemDto.bucketName+"/"+this.problemList[i].problemDto.objectName, {
                    //         responseType: 'blob'
                    //     }).then(res =>  {
                    //         console.log(res);
                    //         var text = new Response(res).text();
                    //         console.log(text);
                    //         const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                    //         var problemBlob = {
                    //                 type : res.headers['content-type'],
                    //                 blob : url,
                    //         }
                    //         this.problemContentList.push(problemBlob);
                    //     });
                    // }
                    //이미지나 음성 수집에 대한 교차검증을 하는 경우
                    else {
                        await s3Client.get("/"+this.problemList[i].problemDto.bucketName+"/"+this.problemList[i].problemDto.objectName, {
                            responseType: 'blob'
                        }).then(res =>  {
                            console.log(res);
                            var text = new Response(res).text();
                            console.log(text);
                            const url = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                            var problemBlob = {
                                    type : res.headers['content-type'],
                                    blob : url,
                            }
                            this.problemContentList.push(problemBlob);
                        });
                    }

                    
                    
                }
                console.log(this.problemContentList);
                await this.initialData();
               
                
            //localStorage.problemData = JSON.stringify(problemContentList);
                
                

        },
        initialData () {
            if(this.problemContentList[0].type.includes("image/")){
                        this.problemImageUrl = this.problemContentList[0].blob;
                    }
                    else if (this.problemContentList[0].type.includes("audio/")){
                        this.problemAudioUrl = this.problemContentList[0].blob;
                    }
                    else {
                        this.textData = this.problemContentList[0].blob;
                    }
                    for(let i = 0; i < this.problemList[0].classNameList.length; i++){
                        var option = { value : this.problemList[0].classNameList[i].className, text : this.problemList[0].classNameList[i].className };
                        this.options.push(option);
                    }
                    var option = { value : 'x', text : '없음'};
                    this.options.push(option);
                
        },
        register() {
            if(this.selected.length != 0){
                var selected = "";
                console.log(typeof(this.selected));
                if(this.selected.length > 1){
                    for(let i = 0 ; i < this.selected.length - 1; i++){
                        selected = selected + this.selected[i] + "&";
                    }
                    selected = selected + this.selected[this.selected.length - 1];
                }
                else {
                    selected = this.selected[0];
                }
                var problemId = this.problemList[this.currentPage - 1].problemDto.problemId;
                AnswerList.set(problemId.toString(), selected);
            }//바운딩 박스 답을 등록
            if(this.selectedBoxAnswer.length != 0){
                var selected = "";
                if(this.selectedBoxAnswer.length == 3){
                        
                        for(let i = 0 ; i < this.selectedBoxAnswer.length - 1; i++){
                            if(this.selectedBoxAnswer[i] == "yes"){
                                console.log("hellooo");
                                console.log(this.problemList[this.currentPage - 1].boundingBoxList);
                                selected = selected + this.problemList[this.currentPage - 1].boundingBoxList[i].boxId+ " ";
                            }
                        }
                        if(this.selectedBoxAnswer[this.selectedBoxAnswer.length - 1] == "yes"){
                            selected = selected + this.problemList[this.currentPage - 1].boundingBoxList[this.selectedBoxAnswer.length - 1].boxId;
                        }
                        console.log(selected);
                    var problemId = this.problemList[this.currentPage - 1].problemDto.problemId;
                    AnswerList.set(problemId.toString(), selected);
                    }
                else {
                    alert("답을 선택하지 않은 문제가 존재합니다!");
                }
                
            }
        console.log(AnswerList);
            
        },    
        preventNav(event) {
                if (AnswerList == null || this.createCollection) return;
                event.preventDefault();
                // Chrome requires returnval -1ue to be set.
                event.returnvalue = "";
        },
        async upload() { //formData 리스트!
            this.createCollection = true;

            if(AnswerList.size < this.problemList.length){
                alert("결과가 등록되지 않은 문제가 있습니다! 한 문제라도 빠짐없이 결과를 작성해야 합니다!")
            }
            else {
                axios.defaults.headers.common['historyId'] = this.historyId;
                var Answer = Object.fromEntries(AnswerList);
                console.log(Answer);
                await axios.post("/api/work/classification", Answer).then(res => {
                    if(res.headers.answer == "success"){
                        alert("분류 작업이 완료되었습니다!");
                        AnswerList.clear();
                        this.$router.push("/");
                    }
                    else {
                        alert("분류 작업이 실패하였습니다!");
                        AnswerList.clear();
                    }
                })
            }
        
           
        },

    }
}
</script>
<style>
.overflow-auto{
    display: table; 
    margin-left: auto; 
    margin-right: auto;
}
#problemImage{
    width: auto;
    height : auto;
    max-width: 600px;
    max-height: 400px;
}
#workRegister {
    width: 200px;
}
canvas {
    cursor : default;
}
</style>
