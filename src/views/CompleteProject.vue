<template>
  <div class="completeProject">
    <h2>{{ "< " + userId + "님의 완료한 작업 목록 >" }}</h2>
    <hr class="bar" />
    <div class="overflow-auto">
      <b-table
        id="my-table"
        :items="completeProjectList"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        small
      >
        <template v-slot:cell(projectDataType)="data">
          <p class="data" v-if="data.value == 'image'">
            <b-icon icon="image" variant="info"></b-icon> 이미지
          </p>
          <p class="data" v-else-if="data.value == 'audio'">
            <b-icon icon="mic-fill" variant="primary"></b-icon> 음성
          </p>
          <p class="data" v-else-if="data.value == 'text'">
            <b-icon icon="blockquote-left" variant="warning"></b-icon> 텍스트
          </p>
          <p class="data" v-else>
            <b-icon icon="tag" color="#e83e8c"></b-icon> 라벨링
          </p>
        </template>
        <template v-slot:cell(projectWorkType)="data">
          <p class="data" v-if="data.value == 'collection'">수집</p>
          <p class="data" v-else-if="data.value == 'labelling'">라벨링</p>
        </template>
        <template v-slot:cell(projectStatus)="data">
          <b-icon icon="chevron-double-right" variant="warning"></b-icon>
          {{ data.value }}
        </template>
      </b-table>
      <br />
      <br />
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        align="center"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
      ></b-pagination>
      <p class="mt-3">현재 페이지: {{ currentPage }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CompleteProject",
  data() {
    return {
      userId: "",
      completeProjectList: [],
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: "projectName", label: "프로젝트 이름" },
        { key: "problemId", label: "문제 번호" },
        { key: "projectRequester", label: "작업 의뢰자" },
        { key: "projectWorkType", label: "작업 종류" },
        { key: "projectDataType", label: "데이터 종류" },
        { key: "problemStatus", label: "진행 상태" },
      ],
    };
  },
  async created() {
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
    this.userId = await localStorage.getItem("userId");
    await axios.get("/api/work/all").then(completeProjectRes => {
        if (
          completeProjectRes.headers.worklist == "fail" ||
          completeProjectRes.headers.login == "fail"
        ) {
          alert("완료한 작업 목록을 가져오는데 실패하였습니다.");
        } else {
          //console.log(completeProjectRes.data);
          this.completeProjectList = completeProjectRes.data.filter(work => work != null);
        }
    }).catch(function(error){
      if (error.response) {
        alert("완료한 작업 목록을 가져오는데 실패하였습니다.");
      }
    });
    
  },
  computed: {
    rows() {
      return this.completeProjectList.length;
    },
  },
};
</script>
<style></style>
