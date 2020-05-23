<template>
    <div class ="createCollection">
    <div>
        <b-card class ="createForm" body-class="text-center" header-tag="nav">
            <img id="createLogo" src = "../assets/createcollectionLogo.png"/>
            <b-card-text>
            <b-form v-if="show">
               <b-form-group id="inputName" label="Project Name:" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="name"
                    required
                    placeholder="Enter Project Name"
                    ></b-form-input>
                </b-form-group>
                </b-form>
                <br>
                <p>프로젝트 수집 데이터 종류 선택</p>
                 <b-form-select v-model="selectedData" class="dataTypeForm">
                    <b-form-select-option-group label="데이터 타입">
                        <b-form-select-option :value="'image'">이미지</b-form-select-option>
                        <b-form-select-option :value="'audio'">음성</b-form-select-option>
                        <b-form-select-option :value="'text'">텍스트</b-form-select-option>
                    </b-form-select-option-group>
            </b-form-select>
            <br>
            <br>
            <p>프로젝트 주제</p>
            <b-form-input size="sm" class="inputSubject" placeholder="Subject" v-model="subject" ></b-form-input>
            <br>
            <br>
            <p>희망하는 수집 데이터 갯수</p>
            <b-form-input size="sm" class="inputSubject" placeholder="수집 데이터 갯수" v-model="totalData" ></b-form-input>
            <br>
            <br>
            <p>원하는 수집 데이터</p>
            <b-button variant="light" class="addClassButton" v-on:click="addClass">
                    Add <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
                <div v-for="data in dataClass">
                    <b-form-input size="sm" id="inputClass" placeholder="수집 데이터" v-model="data.name" ></b-form-input>
                    <br>
                </div>
            <br>
            <br>
            <p>프로젝트 설명</p>
            <b-form-input  id="description" placeholder="description" v-model="description" ></b-form-input>
            <br>
            <br>
            <p>수집 방법 작성</p>
            <b-form-input id="inputWay" placeholder="수집 방법을 작성해주세요." v-model="wayContent" ></b-form-input>
            <br>
            <br>
            <p>수집 조건 작성</p>
            <b-form-input id="inputCondition" placeholder="수집 조건을 작성해주세요." v-model="conditionContent" ></b-form-input>
            <br>
            <br>
            <p>예시 데이터 업로드</p>
            <p>텍스트 데이터 프로젝트인 경우 아래에 글을 작성하시거나 텍스트 파일을 업로드 해주세요!</p>
            <b-form-input id="inputExample" placeholder="예시 데이터를 작성해주세요." v-model="exampleTextContent" ></b-form-input>
            <br>
            <b-form-file 
                v-model="exampleContent"
                :state="Boolean(exampleContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeImages"
                accept="audio/*,image/*,text/*"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ exampleContent ? exampleContent.name : '' }}</div>
                <img id ="examplePreview" v-if="imageUrl && this.selectedData == 'image'" :src = "imageUrl"></img>
            </b-card-text>

            <b-button id ="createButton" variant="outline-info" v-on:click ="createProject">Create</b-button>
        </b-card>
    </div>
    </div>
</template>
<script>
import axios from 'axios';
import Qs from 'qs';

var FileSaver = require("file-saver");
var createSuccess = '';
export default {
  name: 'CreateProject',
    data() {
        return {
            show : true,
            name: null,
            selectedData: null,
            subject: null,
            wayContent: null,
            description: null,
            conditionContent: null,
            exampleContent: null,
            imageUrl: null,
            totalData: 0,
            dataClass: [{name : '수집 데이터'}],
            exampleTextContent: null,
            isEditing: false,
            
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
        async createProject() {
            const config = {
                    headers: { 'Content-type': 'multipart/form-data'}
            };
            var userId = await localStorage.getItem('userId');
            //alert(userId);
            if(this.name == null || this.selectedData == null || this.subject == null || this.wayContent == null 
            || this.description == null || this.conditionContent == null || this.totalData == null || this.dataClass == null || this.exampleContent == null){
                console.log(typeof(this.totalData));
                alert("프로젝트 생성을 위해 내용을 빠짐없이 작성해주세요.");
            }
            else {
                console.log(this.name, this.selectedData, this.subject, this.wayContent, this.description, this.conditionContent, this.totalData, this.dataClass);
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
                console.log(projectRes.headers.create); //class를 먼저 업로드를 하고 예시데이터 업로드!
                if(projectRes.headers.create == "success"){
                    const projectId = projectRes.headers.projectid;
                    console.log(projectId);
                    var params = new URLSearchParams();
                    for (let i = 0; i < this.dataClass.length; i++){
                        params.append("className",this.dataClass[i].name);
                    }
                    params.append("projectId",projectId);
                    
                    const classNameRes = await axios.post("/api/project/class", params);
                    console.log(classNameRes.headers.class);
                    if(classNameRes.headers.class == "success"){
                        axios.defaults.headers.common['bucketName'] = classNameRes.headers.bucketname;
                        if(this.selectedData == 'text'){
                            if(this.exampleContent == null){ //텍스트인데 그냥 적은 내용 자체가 텍스트 예시 데이터 인경우 파일로 변환을 해야 
                                var exampleTextFile = new File([this.exampleTextContent],userId+this.name+".txt",{type: "text/plain;charset=utf-8"});
                                //FileSaver.saveAs(exampleTextFile)
                                console.log(exampleTextFile);
                                let exampleTextData = new FormData();
                                    exampleTextData.append('file',exampleTextFile);
                                    const textRes = await axios.post("/api/project/upload/example", exampleTextData, config);
                                    createSuccess = textRes.headers.example;
                                    if(textRes.headers.example == "success") {
                                        alert("수집 프로젝트 생성 완료!");
                                        this.$router.push({name: "ProjectPayment", 
                                        params : {
                                            projectId : textRes.headers.projectid,
                                            point: exampleDataRes.headers.cost,
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
        onChangeImages(e) {
                console.log(e.target.files);
                const file = e.target.files[0];
                this.imageUrl = URL.createObjectURL(file);    
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
#inputExample {
    height: 300px;
}
#inputCondition {
    height: 300px;
}
#description {
    height: 150px;
}
#examplePreview {
    width : 300px;
    height : 300px;
}
#createButton{
    width: 200px;
    height: 60px;
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    text-transform: uppercase;
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
#createButton:hover {
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
#createLogo {
    width: 400px;
    height: 70px;
    margin : auto;
}
#addClassIcon {
    width: 30px;
    height : 30px;
    
}
.addClassButton {
    float: right;
    margin-right: 370px;
    height: 30px;
}
#inputClass {
    margin-left: 480px;
    max-width: 200px;
}
</style>