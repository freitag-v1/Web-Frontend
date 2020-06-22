<template>
    <div class ="createLabelling">
    <div>
        <b-card class ="createForm" body-class="text-center" header-tag="nav">
            <img id="createLabelLogo" src = "../assets/createlabelingLogo.png"/>
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
                
            </b-form-select>
            <br>
                <p>라벨링 작업 타입</p>
                <b-form-select v-model="selectedWork" class="workTypeForm">
                <b-form-select-option-group label="작업 종류">
                    <b-form-select-option :value="'boundingBox'">이미지 바운딩 박스</b-form-select-option>
                    <b-form-select-option :value="'classification'">분류</b-form-select-option>
                </b-form-select-option-group>
                </b-form-select>
            <br>
            <br>
            <p>예시 데이터 업로드</p>
            <b-form-file
                v-model="exampleContent"
                :state="Boolean(exampleContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeFile"
                accept="audio/*,image/*,text/*"
                ></b-form-file>
                <div id = "select" class="mt-3">선택된 파일: {{ exampleContent ? exampleContent.name : '' }}</div>
                    <img id ="examplePreview" v-if="imageUrl != ''" :src = "imageUrl"></img>
                    <VueAudio v-if="audioUrl != ''" :file="audioUrl" />
                <br>
                <br>
            <p>라벨링 작업 주제</p>
            <b-form-input size="sm" class="inputSubject" placeholder="주제" v-model="subject" ></b-form-input>
            <br>
            <br>
            <p>라벨링 데이터 라벨</p>
            <b-button variant="light" class="addClassButton" v-on:click="addClass">
                    라벨 추가 <b-icon icon="plus" aria-hidden="true"></b-icon>
            </b-button>
                <div v-for="data in dataClass">
                    <b-form-input size="sm" id="inputClass" placeholder="라벨링 클래스" v-model="data.name" ></b-form-input>
                    <br>
                </div>
            <br>
            <br>
            <p>라벨링 작업 설명</p>
            <b-form-input  id="description" placeholder="라벨링 작업 설명을 입력해주세요." v-model="description" ></b-form-input>
            <br>
            <br>
            <p>라벨링 방법 작성</p>
            <b-form-input id="inputWay" placeholder="라벨링 방법을 작성해주세요." v-model="wayContent" ></b-form-input>
            <br>
            <br>
            <p>라벨링 조건 작성</p>
            <b-form-input id="inputCondition" placeholder="라벨링 조건을 작성해주세요." v-model="conditionContent" ></b-form-input>
            <br>
            <br>
            
                <p>라벨링 데이터 업로드</p>
                <b-form-file multiple
                    v-model="labellingContent"
                    :state="Boolean(labellingContent)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept="audio/*,image/*,text/*"
                    ></b-form-file>
                    <div class="mt-3" v-for="file in labellingContent">선택된 파일: {{ file ? file.name : '' }}</div>
                </b-card-text>

            <b-button id ="createProjectButton" variant="outline-info" v-on:click ="createProject">작업 생성</b-button>
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
    data() {
        return {
            show : true,
            name: '',
            subject: '',
            wayContent: '',
            description: '',
            conditionContent: '',
            exampleContent: '',
            imageUrl: '',
            selectedWork: '',
            labellingContent: '',
            dataClass: [{name : '라벨링 데이터'}],
            audioUrl: '',
        }
    },
    components : {
      VueAudio,
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
        dataClass : function(data) {
            this.isEditing = true;
            
        },
        exampleTextContent : function(data) {
            this.isEditing = true;
            
        },
        selectedWork : function(data) {
            this.isEditing = true;
            
        },
        labellingContent : function(data) {
            this.isEditing = true;
            
        },

    },
    methods : {
        preventNav(event) {
                if (!this.isEditing || createSuccess == "success") return;
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = "";
        },
        async createProject() {
            var userId = await localStorage.getItem('userId');
            const config = {
                    headers: { 'Content-type': 'multipart/form-data'}
                };
            if(this.name == ''  || this.subject == '' || this.wayContent == '' 
            || this.description == '' || this.conditionContent == '' || this.selectedWork  == '' || this.labellingContent == ''){
                alert("프로젝트 생성을 위해 내용을 빠짐없이 작성해주세요.");
            }
            else {
                const projectRes =  await axios.post("/api/project/create", "",{
                    params : {
                        projectName : this.name,
                        dataType : this.selectedWork,
                        subject : this.subject,
                        wayContent : this.wayContent,
                        conditionContent : this.conditionContent,
                        description : this.description,
                        userId : userId,
                        workType : 'labelling',
                        totalData: 0,
                    }
                });
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
                            let exampleData = new FormData();
                            exampleData.append('file',this.exampleContent);
                            //예시 데이터 업로드
                            const exampleDataRes = await axios.post("/api/project/upload/example", exampleData, config); 
                            if(exampleDataRes.headers.example == "success") {
                                if(this.labellingContent.length < 2){
                                    alert("라벨링 데이터는 최소 20개 이상이어야합니다!")
                                }
                                else {
                                    var labellingData = new FormData();
                                    for(let labellingDataNumber = 0; labellingDataNumber < this.labellingContent.length; labellingDataNumber++){
                                        labellingData.append('files',this.labellingContent[labellingDataNumber]);
                                    }
                                }
                                //라벨링 데이터 업로드
                                const labellingDataRes = await axios.post("/api/project/upload/labelling",labellingData, {
                                    params :{
                                        projectId :exampleDataRes.headers.projectid,
                                    }}, config);
                                createSuccess = labellingDataRes.headers.upload;
                                if(labellingDataRes.headers.upload == "success") {
                                    alert("라벨링 프로젝트 생성 완료!");
                                    this.$router.push({name: "ProjectPayment", 
                                        params : {
                                            point: labellingDataRes.headers.cost,
                                            projectName : this.name,
                                            projectId : exampleDataRes.headers.projectid,
                                        }});
                                    }
                                    else {
                                        alert("라벨링 프로젝트 생성 실패");
                                    }   
                            }
                        }
                    }
                  else {
                        alert("라벨링 프로젝트 생성 실패");
                    }

            }
            
        },
        onChangeFile(e) { 
            this.imageUrl = '';
            this.audioUrl = '';
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
#createLabelLogo {
    width: 400px;
    height: 110px;
    margin : auto;
}
.workTypeForm {
    max-width: 200px;
    margin: auto;
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