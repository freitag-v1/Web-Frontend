<template>
  <div class="startLabelling">
    <br />
    <h2>{{ "< " + userId + "님의 라벨링 작업 시작 >" }}</h2>
    <h4 style="color : #4682B4">
      *이 페이지는 작업자가 방구석수집가에서 제공되는 이미지 바운딩 박스 혹은
      분류 작업을 진행하는 공간입니다.
    </h4>
    <img
      id="classification"
      v-on:click="classificationProject"
      src="../assets/classificationLogo.png"
    />
    <img
      id="bounding"
      v-on:click="boundingBoxProject"
      src="../assets/imageBoundingBox.png"
    />
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "StartLabelling",
  data() {
    return {
      userId: "",
    };
  },
  async created() {
    this.userId = await localStorage.getItem("userId");
  },
  methods: {
    classificationProject: function() {
      alert("3초 뒤에 분류 작업이 시작이 됩니다.");
      setTimeout(() => {
        this.$router.push({ name: "Classification" });
      }, 3000);
    },
    boundingBoxProject: function() {
      var params = {
        projectType: "Labelling",
        workType: "boundingBox",
        difficulty: -1,
        subject: "",
      };
      localStorage.projectList = JSON.stringify(params);
      this.$router.push({ name: "Project" });
    },
  },
};
</script>
<style>
#classification {
  width: 550px;
  height: 400px;
  margin-top: 67px;
}
#bounding {
  margin-left: 100px;
  width: 570px;
  height: 380px;
}
#classification:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}
#bounding:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
</style>
