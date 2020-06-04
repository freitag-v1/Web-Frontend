<template>
    <div class ="createCollection">
    <div>
        <b-card class ="createForm" body-class="text-center" header-tag="nav">
            <img id="createLogo" src = "../assets/createcollectionLogo.png"/>
            <b-card-text>
            <b-form v-if="show">
               <b-form-group id="inputName" label="작업명:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="name"
                    required
                    placeholder="작업 이름을 입력해주세요"
                    ></b-form-input>
                </b-form-group>
                </b-form>
                <br>
                <p>수집 데이터 타입</p>
                 <b-form-select v-model="selectedData" class="dataTypeForm">
                    <b-form-select-option-group label="데이터 타입">
                        <b-form-select-option :value="'image'">이미지</b-form-select-option>
                        <b-form-select-option :value="'audio'">음성</b-form-select-option>
                        <b-form-select-option :value="'text'">텍스트</b-form-select-option>
                    </b-form-select-option-group>
            </b-form-select>
            <br>
            <br>
            <p>예시 데이터 업로드</p>
            <b-form-group v-if="selectedData == 'text'" style="text-align: center;">
                <b-form-radio v-model="selectedOption" name="텍스트 데이터 입력" value="textWrite">텍스트 데이터 입력</b-form-radio>
                <b-form-radio v-model="selectedOption" name="텍스트 데이터 업로드" value="textUpload">텍스트 데이터 업로드</b-form-radio>
            </b-form-group>
            <br>
            <b-button variant="light" id="addTextButton" v-if="selectedData == 'text' && selectedOption == 'textWrite'" v-on:click="addText">
                    텍스트 예시 데이터 추가 <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
            <br>
            <div class = "exampleTextForm" v-if="selectedOption == 'textWrite' && selectedData == 'text'" v-for="value in exampleTextConversation">
                <br>
                <b-card>
                <p>질문</p>
                <b-form-textarea
                    id="inputExample"
                    v-model="value.question"
                    placeholder="예시 텍스트 데이터를 작성해주세요."
                ></b-form-textarea>
                <br>
                <p>답변</p>
                <b-form-textarea
                    id="inputExample"
                    v-model="value.answer"
                    placeholder="예시 텍스트 데이터를 작성해주세요."
                ></b-form-textarea>
                </b-card>
            <br>
                <br>
            </div>
            <b-form-file 
                v-model="exampleContent"
                v-if="(selectedData == 'text' && selectedOption == 'textUpload') || selectedData != '텍스트'"
                :state="Boolean(exampleContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeFile"
                accept="audio/*,image/*,text/*"
                ></b-form-file>
                <div class="exampleClass" v-if="exampleContent != null">선택된 파일: {{ exampleContent ? exampleContent.name : '' }}
                <br>
                </div>
                <img style="max-width: 100%; height: auto;" v-if="imageUrl && this.selectedData == 'image'" :src = "imageUrl"></img>
                <AudioUpload id="audioPreview" v-if="this.selectedData == 'audio' && audioUrl" :value="audioUrl"/>
            <br>
            <br>
            <p>수집 작업 주제</p>
            <b-form-input size="sm" class="inputSubject" placeholder="주제" v-model="subject" ></b-form-input>
            <br>
            <br>
            <p>수집 데이터 갯수</p>
            <b-form-input size="sm" class="inputSubject" placeholder="수집 데이터 갯수" v-model="totalData" ></b-form-input>
            <br>
            <br>
            <p>수집 데이터 라벨</p>
            <b-button variant="light" id="addClassButton" v-on:click="addClass">
                    라벨 추가 <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
                <div v-for="data in dataClass">
                    <b-form-input size="sm" id="inputClass" placeholder="수집 데이터" v-model="data.name" ></b-form-input>
                    <br>
                </div>
            <br>
            <br>
            <p>수집 작업 설명</p>
            <b-form-textarea  id="description" style="" placeholder="수집 작업 설명을 입력해주세요." v-model="description" ></b-form-textarea>
            <br>
            <br>
            <p>수집 방법 작성</p>
            <b-form-textarea id="inputWay" placeholder="수집 방법을 작성해주세요." v-model="wayContent" ></b-form-textarea>
            <br>
            <br>
            <p>수집 조건 작성</p>
            <b-form-textarea id="inputCondition" placeholder="수집 조건을 작성해주세요." v-model="conditionContent" ></b-form-textarea>
            <br>
            <br>
            
            </b-card-text>

            <b-button id ="createProjectButton" variant="outline-info" v-on:click ="createProject">작업 생성</b-button>
        </b-card>
    </div>
    </div>
</template>
<script>
import axios from 'axios';
import Qs from 'qs';
import AudioUpload from '../components/AudioUpload.vue';

var FileSaver = require("file-saver");
var createSuccess = '';
export default {
  name: 'CreateProject',
  components : {
      AudioUpload,
  },
    data() {
        return {
            selectedOption: null,
            show : true,
            name: null,
            selectedData: null,
            subject: null,
            wayContent: null,
            description: null,
            conditionContent: null,
            exampleContent: null,
            imageUrl: null,
            totalData: null,
            dataClass: [{name : '수집 데이터'}],
            exampleTextContent: null,
            isEditing: false,
            audioUrl: null,
            textExampleCount: 1,
            exampleQuestionText: null,
            exampleAnswerText: null,
            exampleTextConversation: [{question : "예시 텍스트 데이터를 작성해주세요.", answer : "예시 텍스트 데이터를 작성해주세요."}],
        }
    },
    async beforeCreate() {
      axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
    },
    beforeMount() {
            window.addEventListener("beforeunload", this.preventNav);
            this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    beforeRouteLeave(to, from, next) {
        if (this.isEditing && createSuccess != "success") {
            if (!window.confirm("페이지를 벗어나는 경우 프로젝트이 생성되지 않습니다. 그래도 이동하시겠습니까?")) {
                return;
            }
        }
        next();
    },
    watch : {
        name : function(data) {
            this.isEditing = true;
            
        },
        selectedData : function(data) {
            this.isEditing = true;
            
        },
        subject : function(data) {
            this.isEditing = true;
        },
        wayContent : function(data) {
            this.isEditing = true;
        },
        description : function(data) {
            this.isEditing = true;
            
        },
        conditionContent : function(data) {
            this.isEditing = true;
            
        },
        exampleContent : function(data) {
            this.isEditing = true;
            
        },
        imageUrl : function(data) {
            this.isEditing = true;
            
        },
        totalData : function(data) {
            this.isEditing = true;
            
        },
        dataClass : function(data) {
            this.isEditing = true;
            
        },
        exampleTextContent : function(data) {
            this.isEditing = true;
            
        },

    },
    methods : {
        preventNav(event) {
                if (!this.isEditing) return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        addText() {
            console.log(this.exampleAnswerText, this.exampleQuestionText);
            // var conversation = {
            //     question : this.exampleQuestionText,
            //     answer : this.exampleAnswerText,
            // }
            this.exampleTextConversation.push({question : '', answer: ''});
            // console.log(this.exampleTextConversation);
            // console.log(JSON.stringify(this.exampleTextConversation))

            
        },
        async createProject() {
            const config = {
                    headers: { 'Content-type': 'multipart/form-data'}
            };
            var userId = await localStorage.getItem('userId');
            //alert(userId);
            if(this.name == null || this.selectedData == null || this.subject == null || this.wayContent == null 
            || this.description == null || this.conditionContent == null || this.totalData == null || this.dataClass == null){
                //console.log(typeof(this.totalData));
                alert("프로젝트 생성을 위해 내용을 빠짐없이 작성해주세요.");
            }
            else {
                //console.log(this.name, this.selectedData, this.subject, this.wayContent, this.description, this.conditionContent, this.totalData, this.dataClass);
                let classLength = this.dataClass.length;
                if(this.dataClass[classLength -1].name == ""){
                    this.dataClass.splice(classLength-1, 1);
                }
                
                 //맨 뒤에 빈 값이 들어가서 그거 삭제하는 역할
                const projectRes = await axios.post("/api/project/create","", {
                    params : {
                        projectName : this.name,
                        dataType : this.selectedData,
                        subject : this.subject,
                        wayContent : this.wayContent,
                        conditionContent : this.conditionContent,
                        description : this.description,
                        userId : userId,
                        workType : 'collection',
                        totalData: this.totalData,
                    }
                });
                //프로젝트 class 전송
                //class를 먼저 업로드를 하고 예시데이터 업로드!
                if(projectRes.headers.create == "success"){
                    const projectId = projectRes.headers.projectid;
                    var params = new URLSearchParams();
                    for (let i = 0; i < this.dataClass.length; i++){
                        params.append("className",this.dataClass[i].name);
                    }
                    params.append("projectId",projectId);
                    
                    const classNameRes = await axios.post("/api/project/class", params);
                    if(classNameRes.headers.class == "success"){
                        axios.defaults.headers.common['bucketName'] = classNameRes.headers.bucketname;
                        if(this.selectedData == 'text'){
                            if(this.selectedOption == 'textWrite' ){ //텍스트인데 그냥 적은 내용 자체가 텍스트 예시 데이터 인경우 파일로 변환을 해야 
                                var jsonTextExample = JSON.stringify(this.exampleTextConversation);
                                var exampleTextFile = new File([jsonTextExample], userId+this.name+"exampleTextWrite.txt",{type: "text/plain;charset=utf-8"});
                                let exampleTextData = new FormData();
                                    exampleTextData.append('file',exampleTextFile);
                                    const textRes = await axios.post("/api/project/upload/example", exampleTextData, config);
                                    createSuccess = textRes.headers.example;
                                    if(textRes.headers.example == "success") {
                                        alert("수집 프로젝트 생성 완료!");
                                        this.$router.push({name: "ProjectPayment", 
                                        params : {
                                            projectId : textRes.headers.projectid,
                                            point: textRes.headers.cost,
                                            projectName : this.name,
                                        }});
                                    }
                                    else {
                                        alert("수집 프로젝트 생성 실패");
                                    }
                            }
                            else {//그냥 텍스트 첨부파일을 올리는 경우 
                                let exampleData = new FormData();
                                        exampleData.append('file',this.exampleContent);
                                        const exampleDataRes = await axios.post("/api/project/upload/example", exampleData, config); 
                                        createSuccess = exampleDataRes.headers.example;
                                        if(exampleDataRes.headers.example == "success") {
                                            alert("수집 프로젝트 생성 완료!");
                                            this.$router.push({name: "ProjectPayment", 
                                            params : {
                                                projectId : exampleDataRes.headers.projectid,
                                                point: exampleDataRes.headers.cost,
                                                projectName : this.name,
                                            }});
                                        }
                                        else {
                                            alert("수집 프로젝트 생성 실패");
                                        }     
                            }
                        }
                        else  {// 이미지, 음성인 경우 
                            let exampleData = new FormData();
                            exampleData.append('file',this.exampleContent);
                            const exampleDataRes = await axios.post("/api/project/upload/example", exampleData, config); 
                            createSuccess = exampleDataRes.headers.example;
                            if(exampleDataRes.headers.example == "success") {
                                alert("수집 프로젝트 생성 완료!");
                                this.$router.push({name: "ProjectPayment", 
                                params : {
                                    projectId : exampleDataRes.headers.projectid,
                                    point: exampleDataRes.headers.cost,
                                    projectName : this.name,
                                }});
                            }
                            else {
                                alert("수집 프로젝트 생성 실패");
                            }
                        }
                    }
                    else {
                        alert("수집 프로젝트 생성 실패");
                    }

                }
                else {
                    alert("수집 프로젝트 생성 실패");
                }
            }
            
        },
        onChangeFile(e) {
                console.log(e.target.files);
                const file = e.target.files[0];
                if(file.type == "image/"){
                    this.imageUrl = URL.createObjectURL(file);    
                }
                else //if(file.type == "audio/"){
                {
                    this.audioUrl = URL.createObjectURL(file);  
                }
                
        },
        addClass() {

                this.dataClass.push({name:''});
                console.log(this.dataClass);

            // else {
            //     alert("원하는 수집 데이터를 입력해주세요!");
            // }
        }
    }
}
</script>
<style>
#createLogo {
    width: 300px;
    height: 70px;
    margin : auto;
}
.createForm {
    max-width: 1200px;
    margin: auto;
}
#inputName {
    max-width: 500px;
    margin: auto;
}
.dataTypeForm{
    max-width: 200px;
    margin: auto;
}
.inputSubject{
    max-width: 200px;
    margin: auto;
}
#inputWay{
    height: 300px;
}
#inputCondition {
    height: 300px;
}
#description {
    height: 150px;
}
#createProjectButton{
    width: 200px;
    height: 60px;
    font-size: 20px;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    border: none;
    border-radius: 20px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;

}
#createProjectButton:hover {
    background-color: #28adfc;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
    border-radius: 8px;
}
p {
    font-weight: bolder;
    font-size: 18px;
}

#addClassIcon {
    width: 30px;
    height : 30px;
    
}
#addClassButton {
    float: right;
    margin-right: 320px;
    height: 30px;
    width: 150px;
}
#inputClass {
    margin-left: 480px;
    max-width: 200px;
}
#audioPreview{
    display: table; 
    margin-left: auto; 
    margin-right: auto;
}
#addTextButton {
    width: 300px;
}
</style>