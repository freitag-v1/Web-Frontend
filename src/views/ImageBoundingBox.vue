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
    <br>
    <h5><데이터 라벨></h5>
    <div v-for="value, index in colorListByLabel">
        <hr :color="value.strokeColor" style="width : 100px; margin : auto;"> {{value.className}} </hr>
    </div>
    <br>
    <b-form-radio-group
            v-model="selected"
            :options="options"
            class="option"
            value-field="item"
            text-field="name"
            ></b-form-radio-group>
    <b-card-text class = "content">
        <canvas id="boundingImage" width="800" height="600"></canvas>
        <br> 
    </b-card-text>
    <div class="overflow-auto" style="margin : auto;">
        <b-pagination id="pagination"
         v-model="currentPageV"
          :total-rows="problemList.length"
            per-page= 1
            first-text="처음"
            prev-text="이전"
            next-text="다음"
            last-text="마지막"></b-pagination>
    </div>
    <div class = "buttons">
        <b-button id = "removeBoxButton"  v-on:click="clearBox">
            <b-icon icon="trash-fill"></b-icon> 박스 지우기
        </b-button>
        <b-button id = "endWorkBoxButton" v-on:click="upload" v-model ="successLabelling">
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



/************************************Naver Object Storage 접근****************************/

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
const local_file_path = '../assets';


/************************************바운딩 박스 그리기******************************************/
var canvas;
var ctx;
var last_mouseX = 0;
var last_mouseY = 0;
var mouseX = 0;
var mouseY = 0;
var isMouseDown = false;
var boxAnswer = new Map(); //각 문제에 대한 이전 작업 결과
var realBoxAnswer = new Map();
var boxAnswerList = new Array(); //이전에 작업한 box의 좌표들이 담긴 배열
var realBoxAnswerList = new Array(); //서버에 전송되어 저장되는 좌표
var currentPageL = 1;
var selectedLabel;
var colorByLabel = new Array(); //라벨마다 

//색 랜덤으로 추출하는거
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//마우스로 그림을 그리는 코드

//마우스가 눌러질 때
function down(e){
    last_mouseX = e.offsetX;
    last_mouseY = e.offsetY;
    isMouseDown = true;
}
//눌러진 마우스가 놓일 때 이 때 그림을 그려야한다. 
function up(e) {
    draw();
}
//마우스가 움직이는 동안
function move(e){
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}


function draw(){
    if(isMouseDown){
        ctx.beginPath();
        var width = mouseX - last_mouseX;
        var height = mouseY - last_mouseY;
        //박스를 그림
        ctx.rect(last_mouseX, last_mouseY, width, height);
        //선택된 class에 맞는 색을 찾음.
        var currentColor = colorByLabel.find(color => color.className == selectedLabel);
        //색으로 그림을 그리고 어떤 class에 해당하는지 글로 보여주고
        ctx.strokeStyle = currentColor.strokeColor;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.font = "18px Verdana";
        ctx.fillStyle = currentColor.strokeColor;
        ctx.fillText(selectedLabel,last_mouseX + 5,last_mouseY - 5);
        //작업한 좌표를 나중에 그릴 수 있도록 
        var workedBoxCoord = last_mouseX+" "+last_mouseY+" "+width+" "+height;
        //실제 서버에 보낼 좌표 xmin xmax, ymin, ymax
        var xMin = (last_mouseX / canvas.width).toFixed(2);
        var yMin = (last_mouseY / canvas.height).toFixed(2);
        var xMax = (mouseX / canvas.width).toFixed(2);
        var yMax = (mouseY / canvas.height).toFixed(2);
        var answerCoord = xMin+" "+yMin+" "+xMax+" "+yMax;
        //아무런 작업 결과가 없는 경우
        if(boxAnswerList[currentPageL - 1] == null){
            //박스가 여러개인 경우
             if(boxAnswer.has(selectedLabel)){
                var multiAnswerString = boxAnswer.get(selectedLabel)+"&"+workedBoxCoord;
                boxAnswer.set(selectedLabel, multiAnswerString);
            }//박스가 한개인 경우
            else {
                boxAnswer.set(selectedLabel, workedBoxCoord);
            }
            boxAnswerList[currentPageL - 1] = boxAnswer;
        }
        else {
            //작업된 결과에 선택된 라벨에 대해 작업 결과가 있는 경우
            if(boxAnswerList[currentPageL - 1].has(selectedLabel)){
                var multiAnswerString = boxAnswerList[currentPageL - 1].get(selectedLabel)+"&"+workedBoxCoord;
                boxAnswerList[currentPageL - 1].set(selectedLabel, multiAnswerString);
            }//작업 결과 없는 경우
            else {  
                boxAnswerList[currentPageL -1].set(selectedLabel, workedBoxCoord);
            }
        }
        if(realBoxAnswerList[currentPageL - 1] == null){
            //박스가 여러개인 경우
             if(realBoxAnswer.has(selectedLabel)){
                var multiAnswerString = realBoxAnswer.get(selectedLabel)+"&"+answerCoord;
                realBoxAnswer.set(selectedLabel, multiAnswerString);
            }//박스가 한개인 경우
            else {
                realBoxAnswer.set(selectedLabel, answerCoord);
            }
            realBoxAnswerList[currentPageL - 1] = realBoxAnswer;
        }
        else {
            //작업된 결과에 선택된 라벨에 대해 작업 결과가 있는 경우
            if(realBoxAnswerList[currentPageL - 1].has(selectedLabel)){
                var multiAnswerString = realBoxAnswerList[currentPageL - 1].get(selectedLabel)+"&"+answerCoord;
                realBoxAnswerList[currentPageL - 1].set(selectedLabel, multiAnswerString);
            }//작업 결과 없는 경우
            else {  
                realBoxAnswerList[currentPageL -1].set(selectedLabel, answerCoord);
            }
        }
    }
    isMouseDown = false;
}
//이전에 작업한 바운딩 박스를 돌아가도 보여질 수 있도록 
function workedBoxDraw(x, y, width, height, className){
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    //선택된 class에 맞는 색을 찾음.
    var currentColor = colorByLabel.find(color => color.className == className);
    //색으로 그림을 그리고 어떤 class에 해당하는지 글로 보여주고
    ctx.strokeStyle = currentColor.strokeColor;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.font = "18px Verdana";
    ctx.fillStyle = currentColor.strokeColor;
    ctx.fillText(className, x + 5, y - 5);
}



 export default {
    name: 'ImageCollection',
    data() {
        return {
            problemList:[],
            project: '',
            successLabelling: false,
            ctx: '',
            canvas: '',
            currentPageV: 1,
            downloadUrl: '',
            workhistoryId : '',
            problemContentList : [],
            options : [],
            selected : '',
            failCount : 0,
            successCount : 0,
            colorListByLabel : [],
            classNameList: [],
        }
    },
    async beforeCreate() {
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    async created() {
        await this.fetchData();
        //canvas 생성 
        canvas = document.getElementById("boundingImage");
        ctx = canvas.getContext('2d');
        // 캔버스의 마우스 이벤트 핸들러 등록
        canvas.addEventListener( "mousemove", move);
        canvas.addEventListener( "mousedown", down);
        canvas.addEventListener( "mouseup", up);
    },
    watch : {
        '$route' : 'fetchData',
        currentPageV : function(page) {
            currentPageL = page;
            boxAnswer = new Map();
            realBoxAnswer = new Map();
            //페이지 바뀔 때마다 이미지 다르게 보여야하기 때문에
            ctx.clearRect(0,0,canvas.width, canvas.height);
            var originalImage = new Image();
            originalImage.src = this.problemContentList[page - 1].blob;
            var imageContext = ctx;
            //페이지 바뀔 때마다 이미지 새로 띄우고 이전에 한 작업을 보여줄 수 있도록 
            originalImage.onload = function() {
                var scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
                var x = (canvas.width / 2) - (originalImage.width / 2) * scale;
                var y = (canvas.height / 2) - (originalImage.height / 2) * scale;
                imageContext.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
                if(boxAnswerList[page - 1] != null) {
                    var workedBoxes = Array.from(boxAnswerList[page - 1].values());
                    var workedClass = Array.from(boxAnswerList[page - 1].keys());
                    for(let i = 0; i < workedBoxes.length; i++){
                        if(workedBoxes[i].includes("&")){
                            var parseBoxAnswer = workedBoxes[i].split("&");
                            for(let j = 0; j < parseBoxAnswer.length; j++){
                                var coordinateWithMulti = parseBoxAnswer[j].split(" ");
                                workedBoxDraw(Number(coordinateWithMulti[0]), Number(coordinateWithMulti[1]),
                                    Number(coordinateWithMulti[2]), Number(coordinateWithMulti[3]), workedClass[i]);
                            }
                        }
                        else {
                            var coordinate = workedBoxes[i].split(" ");
                            workedBoxDraw(Number(coordinate[0]), Number(coordinate[1]), Number(coordinate[2]), 
                                Number(coordinate[3]),workedClass[i]);
                        }
                    }
                } 
            }
           
        },
        selected : function(className){
            selectedLabel = className;
        }
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav); //웹페이지 닫을 때 일어나는거 
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) { //작업하고나서 나가려고 하면 이루어지는거
        if (boxAnswerList.length != 0 && !this.successLabelling) {
            if (!window.confirm("페이지를 벗어나면 작업이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
        next();
    },
    methods : {
        async fetchData() {
            var searchproject = await localStorage.getItem('searchProject');
            this.project = JSON.parse(searchproject).projectDto;
            axios.defaults.headers.common['projectId'] = this.project.projectId;
            await axios.get("/api/work/boundingbox/start").then(boundingBoxRes => {
            if(boundingBoxRes.headers.problems == "success"){
                this.problemList = boundingBoxRes.data;
                this.workhistoryId = boundingBoxRes.headers.workhistory;
                this.problemDataDownload();
            }
            else {
                alert("잘못 접근한 프로젝트이거나 문제 세트를 생성할 수 없습니다.");
                window.location.href = "/project";
            }
            
            }).catch(function(err) {
                if(err){
                    alert("잘못 접근한 프로젝트이거나 문제 세트를 생성할 수 없습니다.");
                    window.location.href = "/project";
                }
            
            })
            this.exampleDownload();
        },
        async problemDataDownload() {
            for(let i = 0; i < this.problemList.length; i++){
                    await s3Client.get("/"+this.problemList[i].problemDto.bucketName+"/"+this.problemList[i].problemDto.objectName, {
                        responseType: 'blob'
                    }).then(problemRes =>  {
                        const url = URL.createObjectURL(new Blob([problemRes.data], { type: problemRes.headers['content-type'] }));
                        var problemBlob = {
                            type : problemRes.headers['content-type'],
                            blob : url,
                        }
                        this.problemContentList.push(problemBlob);
                    });
                }
                await this.initialData();
        },
        async exampleDownload(){
            await s3Client.get("/"+this.project.bucketName+"/"+this.project.exampleContent, {
                responseType : 'blob'
            }).then(exampleRes => {
                const url = URL.createObjectURL(new Blob([exampleRes.data], { type: exampleRes.headers['content-type'] }));
                this.downloadUrl = url;
            })
        },
        initialData () {
            var originalImage = new Image();
            originalImage.src = this.problemContentList[0].blob;
            var imageContext = ctx;
            originalImage.onload = function() {
                var scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
                var x = (canvas.width / 2) - (originalImage.width / 2) * scale;
                var y = (canvas.height / 2) - (originalImage.height / 2) * scale;
                imageContext.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
            }
            for(let i = 0; i < this.problemList[0].classNameList.length; i++){
                    var option = { item : this.problemList[0].classNameList[i].className, name : this.problemList[0].classNameList[i].className };
                    this.options.push(option);
                    var color = getRandomColor();
                    colorByLabel[i] = {
                        strokeColor : color,
                        className : this.problemList[0].classNameList[i].className,
                    };
            }
            this.classNameList = this.problemList[0].classNameList;
            this.colorListByLabel = colorByLabel;
            this.selected = this.options[0].item;  
        },
        preventNav(event) {
            if (boxAnswerList.length == 0 || this.successLabelling) return;
                event.preventDefault();
                event.returnValue = "";
        },
        clearBox() {
            boxAnswerList[this.currentPageV - 1] = null;
            realBoxAnswerList[this.currentPageV - 1] = null;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            var originalImage = new Image();
            originalImage.src = this.problemContentList[this.currentPageV - 1].blob;
            var imageContext = ctx;
            //페이지 바뀔 때마다 이미지 새로 띄우고 이전에 한 작업을 보여줄 수 있도록 
            originalImage.onload = function() {
                var scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
                var x = (canvas.width / 2) - (originalImage.width / 2) * scale;
                var y = (canvas.height / 2) - (originalImage.height / 2) * scale;
                imageContext.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);
            }

        },
        async upload() { //formData 리스트!
            this.successLabelling = true;
            axios.defaults.headers.common['projectId'] = this.project.projectId;
            axios.defaults.headers.common['historyId'] = this.workhistoryId;
                for(let i = 0; i < this.problemList.length; i++){
                    if(boxAnswerList[i] != null || boxAnswerList[i] != undefined) {
                        var answerJson = Object.fromEntries(realBoxAnswerList[i]);
                        await axios.post("/api/work/boundingbox", answerJson, {
                            params : {
                                problemId : this.problemList[i].problemDto.problemId,
                            }
                        }).then(boundingWorkRes => {
                            if(boundingWorkRes.headers.map == "fail"){
                                this.failCount++;
                                alert("답이 제대로 저장이 되지 않았습니다.")
                            }
                            else if(boundingWorkRes.headers.project == "fail"){
                                this.failCount++;
                                alert("해당 프로젝트가 존재하지 않습니다.")
                            }
                            else if(boundingWorkRes.headers.answer == "success"){
                                this.successCount++;
                            }
                            else {
                                this.failCount++;
                                alert("작업이 실패하였습니다. 다시 시도해주세요.")
                            }
                        })
                        .catch(function(error) {
                            if(error.response){
                                this.failCount++;
                                alert("작업이 제대로 완료되지 않았습니다.");
                            }
                        });
                    }
                    
                }
                if(this.failCount == 0 || this.successCount != 0) {
                        alert("작업이 완료되었습니다.");
                        this.$router.push("/");
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
.buttons {
    margin: auto;
    width: 50%;
}
.buttons button{
    margin: 5px;
    width: 150px;
}
#boundingImage {
    cursor : crosshair;
}
#endWorkBoxButton {
  width: 150px;
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#endWorkBoxButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#removeBoxButton {
  width: 150px;
  background-color: #fa8072;
  border: none;
  font-size: 19px;
  color: black;
}
#removeBoxButton:hover {
  background-color: #fa8072;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
</style>
