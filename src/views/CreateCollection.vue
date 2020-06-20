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
            <b-button id="addTextButton" v-if="selectedData == 'text' && selectedOption == 'textWrite'" v-on:click="addText">
                    텍스트 예시 데이터 추가 <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
            <br>
            <div class = "exampleTextForm" v-if="selectedOption == 'textWrite' && selectedData == 'text'" v-for="value in exampleTextConversation">
                <br>
                <b-card>
                <b-button id="deleteTextButton" v-on:click="deleteText(i)" >
                    삭제 <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                </b-button>
                <br>
                <br>
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
            </div>
            <b-form-file 
                v-model="exampleContent"
                v-if="(selectedData == 'text' && selectedOption == 'textUpload') || selectedData != 'text'"
                :state="Boolean(exampleContent)"
                placeholder="파일을 선택하거나 끌어서 놓아주세요."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeFile"
                accept="audio/*,image/*,text/*"
                ></b-form-file>
                <div class="exampleClass" v-if="exampleContent != ''">선택된 파일: {{ exampleContent ? exampleContent.name : '' }}
                </div>
                <img style="max-width: 100%; height: auto;" v-if="imageUrl != '' && selectedData == 'image'" :src = "imageUrl"></img>
                <VueAudio v-if="audioUrl != '' && selectedData == 'audio'" :file="audioUrl" />
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
            <b-button id ="createProjectButton" v-on:click ="createProject">작업 생성</b-button>
        </b-card>
    </div>
    </div>
</template>
<script>
import axios from 'axios';
import VueAudio from "vue-audio";

var createSuccess = '';

export default {
  name: 'CreateProject',
  components : {
      VueAudio,
  },
    data() {
        return {
            selectedOption: "",
            show : true,
            name: "",
            selectedData: "",
            subject: "",
            wayContent: "",
            description: "",
            conditionContent: "",
            exampleContent: "",
            imageUrl: "",
            totalData: "",
            dataClass: [{name : '수집 데이터'}],
            isEditing: false,
            audioUrl: "",
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
        if (!this.isEditing || createSuccess != "success") {
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
            this.exampleContent = '';
            
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


    },
    methods : {
        preventNav(event) {
            if (!this.isEditing) return;
            event.preventDefault();
            event.returnValue = "";
        },
        addText() {
            this.exampleTextConversation.push({question : '', answer: ''});
        },
        async createProject() {
            const config = {
                    headers: { 'Content-type': 'multipart/form-data'}
            };
            var userId = await localStorage.getItem('userId');
            if(this.name == '' || this.selectedData == '' || this.subject == '' || this.wayContent == '' 
            || this.description == '' || this.conditionContent == '' || this.totalData == '' || this.dataClass == ''){
                alert("프로젝트 생성을 위해 내용을 빠짐없이 작성해주세요.");
            }
            else {
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
                        switch(this.selectedData) {
                            case 'text' : {
                                if(this.selectedOption == 'textWrite' ){ //텍스트인데 그냥 적은 내용 자체가 텍스트 예시 데이터 인경우 파일로 변환을 해야 
                                    var jsonTextExample = JSON.stringify(this.exampleTextConversation);
                                    var exampleTextFile = new File([jsonTextExample], Date.now()+this.name+userId+"exampleTextWrite.txt",{type: "text/plain;charset=utf-8"});
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
                                break;
                            }
                            default: {
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
                                break;
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
            const file = e.target.files[0];
            if(file.type.includes("image/")){
                this.imageUrl = URL.createObjectURL(file);    
            }
            else {
                this.audioUrl = URL.createObjectURL(file);  
            } 
            
        },
        addClass() {
            this.dataClass.push({name:''});
        },
        deleteText(index) {
            this.exampleTextConversation.splice(index, 1);
        },
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
  background-color: #4682b4;
  border: none;
  font-size: 19px;
  color: black;
}
#createProjectButton:hover {
    background-color: #4682B4;
    box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
    color: #fff;
    transform: translateY(-7px);
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
    height: 35px;
    width: 150px;
    background-color: #B0C4DE;
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
    border : none;
    background-color: #B0C4DE;
}
#deleteTextButton {
    width: 150px;
    border : none;
    float : right;
    background-color : tomato;
}

</style>