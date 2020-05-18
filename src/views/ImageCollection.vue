<template>
    <div class ="imageCollection">
        <img id = "imageCollectionLogo" src = "../assets/imageCollection.png">
        <b-card
        class = "workCard"
        no-body
  >
    <template v-slot:header>
      <h4 class="mb-0">이미지 수집 작업</h4>
    </template>
    <b-list-group flush>
      <b-list-group-item>프로젝트 이름 : {{" "+ project.projectName}}</b-list-group-item>
      <b-list-group-item>프로젝트 의뢰자 : {{" " + project.userId}}</b-list-group-item>
      <b-list-group-item><프로젝트 수집 데이터 목록>
        <div v-for="classname, index in classNameList">
            <br>
            {{index+1+". "+classname}}
        </div>
        </b-list-group-item>
    </b-list-group>
    <b-card-footer style="font-weight: bolder">프로젝트 진행 방법</b-card-footer>
    <b-card-text class ="content">{{project.wayContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">프로젝트 조건</b-card-footer>
    <b-card-text class ="content">{{project.conditionContent}}</b-card-text>
    <b-card-footer style="font-weight: bolder">프로젝트 예시 데이터</b-card-footer>
    <b-card-text class ="content">{{project.exampleContent}}</b-card-text>
    <div v-for="i in imageCount">
        <ImageUpload v-bind:idx=i @registerImg="registerImageUrl"> </ImageUpload>
        <br>
    </div>
    <div class = "buttons">
        <b-button size="lg" variant="primary" v-on:click="addImage">
                <b-icon icon="file-earmark-plus" aria-label="Help"></b-icon> Add
        </b-button>
        <b-button size="lg" variant="warning" v-on:click="upload">
                <b-icon icon="upload"></b-icon> Upload
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
 export default {
    name: 'ImageCollection',
    components : {
        ImageUpload,
    },
    data() {
        return {
            project: null,
            classNameList: ['사과', '배', '마라탕'],
            imageCount: 1,

        }
    },
    async beforeCreate() {
         var loginStatus = await localStorage.getItem('loginState');
        //axios.defaults.headers.common['authorization'] = await localStorage.getItem('token');
        if(!loginStatus) {
            alert("로그인이 필요한 페이지입니다.")
            this.$router.push("/login"); 
        }
        this.project = this.$route.params.project;
        console.log(this.project);
    },
    methods : {
        addImage() {
            this.imageCount += 1;
        },
        upload() { //formData 리스트!
            //var imageFormData = new Array(); 뭔가 formdata 리스트가 아니라 formdata에 append해서 보내는거 같다
            let imgUrl = new FormData();
           for(var uploadImageFile of ImageList){
               imgUrl.append('file', uploadImageFile);
               //imageFormData.push(imgUrl);
           }
           console.log(imgUrl);//여기서 데이터 보내면 된다
           console.log("=========================================");
        },
        registerImageUrl(data) { //index를 저장을 해서 기존에 올린 사진을 수정하는 경우 추가되지 않고 변경해야해서 props로 index 주고 받고 해서 변경
            let i = data.index -1;
            let url  = data.url;
            if(ImageList[i] == null){
                ImageList.push(url);
            }
            else {
                ImageList.splice(i,1,url);

            }
            alert("등록완료!");
            console.log(ImageList);
        }


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
    width: 150px;
}

</style>