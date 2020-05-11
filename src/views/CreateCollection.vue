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
export default {
  name: 'CreateProject',
    data() {
        return {
            show : true,
            name: null,
            selectedData: null,
            subject: null,
            wayContent: null,
            inputCondition: null,
            description: null,
            conditionContent: null,
            exampleContent: null,
            imageUrl: null,
        }
    },
    async beforeCreate() {
      var loginStatus = await localStorage.getItem('loginState');
      if(!loginStatus) {
          alert("로그인이 필요한 페이지입니다.")
          this.$router.push("/login"); 
      }
    },
    methods : {
        async createProject() {
            console.log(this.exampleContent);
            var userId = await localStorage.getItem('userId');
            // const projectRes = await axios.post("/api/project/collection", {
            //     params : {
            //         name : this.name,
            //         dataType : this.selectedData,
            //         subject : this.subject,
            //         wayContent : this.wayContent,
            //         conditionContent : this.conditionContent,
            //         description : this.description,
            //         userId : userId,
            //     }
            // });
            // 이미지 가져오면 디코딩해서 보여주는 역할 
            // function getBase64(url) {
            //     return axios
            //         .get(url, {
            //         responseType: 'arraybuffer'
            //         })
            //         .then(response => new Buffer(response.data, 'binary').toString('base64'))
            //   }
            //이미지 예시데이터 업로드 
            if(this.selectedData == 'image'){
                const exampleUrl = URL.createObjectURL(this.exampleContent); //업로드 한 파일에 대해서 url을 만듦 
                console.log(exampleUrl);
                let buffer = new Buffer(exampleUrl);
                var base64ExampleUrl = buffer.toString('base64'); // url을 이용해서 http 통신을 위해 base64로 변형 
                console.log(base64ExampleUrl);
                base64ExampleUrl = base64ExampleUrl.replace(/\r?\n?/g, ''); // 개행이 있으면 오류가 나서 없애서 보내야
                base64ExampleUrl = base64ExampleUrl.trim();
                //이미지 파일 전송 
                const exampleData = await axios.post("/api/project/example", {
                        headers: {'Content-type': 'application/x-www-form-urlencoded',},
                        imageName: this.exampleContent.name, imageData: base64ExampleUrl
                });
            }
            else if (this.selectedData == 'audio'){
                    //음성 파일인 예시 데이터 업로드 얘는 따로 base64 인코딩을 안하는 것 같은데...
                    if(this.exampleContent != null){
                        let data = new FormData();
                        data.append('audiofile',this.exampleContent, this.exampleContent.name);

                        const audioConfig = {
                            headers: { 'Content-type': 'multipart/form-data'}
                        };
                        axios.post("/api/project/example", data, audioConfig);

                    }
            }
            else { //텍스트 파일인 예시 데이터 업로드 
                if(this.examplContent != null){
                        let exampleTextData = new FormData();
                        exampleTextData.append('textfile',this.exampleContent, this.exampleContent.name);
                        const textRes = axios.post("/api/project/example", exampleTextData, config);
                }
            }
            alert("수집 프로젝트 생성 완료!");
            this.$router.push("/project");//결제하는 페이지를 만들어서 이동하도록 
        },
        onChangeImages(e) {
                console.log(e.target.files);
                const file = e.target.files[0];
                this.imageUrl = URL.createObjectURL(file);    
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

</style>