<template>
<div class = "uploadImage">
    <b-card-footer style="font-weight: bolder">이미지 수집</b-card-footer>
    <br>
        <b-form-file 
                v-model="imageContent"
                :state="Boolean(imageContent)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                hidden @change="onChangeImages"
                accept="image/*"
                ></b-form-file>
                <div class="mt-3">Selected file: {{ imageContent ? imageContent.name : '' }}</div>
                <br>
                <!--<img id ="imageContentPreview" v-if="imageUrl" :src = "imageUrl"></img>-->
            </b-card-text>
    <br>
    <p>수집한 이미지를 업로드 하는 경우, 자르고 싶다면 crop을 하면 됩니다. 
    <br>
    원본 이미지를 보내고 싶은 경우 크롭 이미지를 삭제하시고 수집 버튼을 눌러주세요. 
    <br>
    </p>
    <p style="color: red;">
        Register Image를 해야 사진이 등록이 됩니다! 꼭 해주세요!
    </p>
    <br>
    <vue-cropper
        id ="previewImg"
        ref='cropper' 
        :src = "imageUrl" 
        alt="Source Image"
        :guides="true"
        :view-mode="2"
        drag-mode="crop"
        :auto-crop-area="0.5"
        :min-container-width="250"
        :min-container-height="180"
        :background="true"
        :rotatable="true"
    > 
    </vue-cropper>
    <br>
    <p>크롭된 이미지</p>
    <img id = "cropImg" :src="cropImg" v-if="cropImg != null" alt="Cropped Image" />

    <br>
    <br>
    <div class = "cropButton">
        <button  v-on:click="cropImage" v-if="imageUrl != ''">Crop</button>
        <button  v-on:click="rotate" v-if="imageUrl != ''">Rotate</button>
        <button  style="width: 230px; height: 40px;" v-on:click="deleteCrop" v-if="imageUrl != ''">Delete Crop Image</button>
        <button  style="width: 230px; height: 40px;" v-on:click="registerImg" v-if="imageUrl != ''">Register Image</button>
        
    </div>
    </div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
//base64인 파일을 서버에 전송하기 위해 file 객체로 변환을 해야한다. 
const dataURLtoFile = (dataurl, fileName) => {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], fileName, {type:mime});
    };
export default {
  name: 'ImageUpload',
  components : {
        VueCropper,

    },
    props:{
        idx  : Number,
    },
  data() {
      return {
        imageContent: '',
            imageUrl:'',
            cropImg : '',
      }
  },
  methods : {
        onChangeImages(e) {
            console.log(e.target.files);
            const file = e.target.files[0];
            this.imageUrl = URL.createObjectURL(file);    
            this.$refs.cropper.replace(this.imageUrl);
            this.cropImg="";
        },
        cropImage() {
        // get image data for post processing, e.g. upload or setting image src
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            
        },
        rotate() {
            // guess what this does :)
            this.$refs.cropper.rotate(90);
        },
        deleteCrop() {
            this.cropImg = "";
        },
        registerImg() {
            if(this.cropImg == "") { //그냥 원본이미지 올리는 경우 
                var imageData = {url : this.imageContent, index : this.idx}
                this.$emit('registerImg', imageData);
            }
            else { //크롭한 이미지 올리는 경우 base64를 file로 변형해서 
                var ImageFile = dataURLtoFile(this.cropImg,this.imageContent.name);
                //console.log(ImageFile);
                var imageData = {url : ImageFile, index : this.idx}
                this.$emit('registerImg', imageData);
            }
        }
  },
}
</script>
<style>
.cropButton {
    margin: auto;
    width: 50%;
}
.cropButton button {
    margin: 5px;
}
</style>