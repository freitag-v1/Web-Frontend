<template>
  <div class="requestedProject">
    <h2>{{ "< " + userId + "님의 의뢰한 작업 목록 >" }}</h2>
    <hr class="bar" />
    <div class="overflow-auto">
      <b-table
        id="my-table"
        :items="requestProjectList"
        :per-page="perPage"
        :current-page="currentPage"
        :fields="fields"
        @row-dbclicked="moveProject"
        small
      >
        <template v-slot:cell(projectDto.show_details)="row">
          <b-button
            id="showDetail"
            v-on:click="moveProject(row.item)"
            class="mr-2"
          >
            {{ row.item.projectDto.projectName }}
          </b-button>
        </template>
        <template v-slot:cell(projectDto.dataType)="data">
          <p class="data" v-if="data.value == 'image'">
            <b-icon icon="image" variant="success"></b-icon> 이미지
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
        <template v-slot:cell(projectDto.workType)="data">
          <p class="data" v-if="data.value == 'collection'">수집</p>
          <p class="data" v-else-if="data.value == 'labelling'">라벨링</p>
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
      requestProjectList: [],
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: "projectDto.projectName", label: "프로젝트 이름" },
        { key: "projectDto.workType", label: "작업 종류" },
        { key: "projectDto.dataType", label: "데이터 종류" },
        { key: "projectDto.show_details", label: "상세정보 보기" },
      ],
    };
  },
  async created() {
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
    this.userId = await localStorage.getItem("userId");
    await axios.get("/api/project/all")
    .then(requestProjectRes => {
        if (
          requestProjectRes.headers.list == "none" ||
          requestProjectRes.headers.login == "fail"
        ) {
          alert("의뢰한 프로젝트 목록을 가져오는데 실패하였습니다.");
        } else {
          this.requestProjectList = requestProjectRes.data.filter(work => work != null);
        }
    }).catch(function(error){
      if (error.response) {
        alert("의뢰한 작업 목록을 가져오는데 실패하였습니다.");
      }
    });
    
  },
  computed: {
    rows() {
      return this.requestProjectList.length;
    },
  },
  methods: {
    moveProject(detailItem) {
      // 자세히 보고싶은 프로젝트를 보여줄 수 있도록
      localStorage.searchProject = JSON.stringify(detailItem);
      this.$router.push({
        name: "RequestProjectDetail",
        params: {
          idx: detailItem.projectDto.projectId,
        },
      });
    },
  },
};
</script>
<style></style>
