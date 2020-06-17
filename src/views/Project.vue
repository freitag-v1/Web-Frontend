<template>
  <div class="projectList">
    <img id="projectLogo" src="../assets/projectList.png" />
    <b-button
      class="mr-2"
      href="/newProject"
      style="margin-top: 10px; height : 40px; width: 100px;"
    >
      작업 의뢰
    </b-button>
    <b-button
      v-b-toggle.sidebar-backdrop
      class="mr-2"
      style="margin-top: 10px; height : 40px; color: white;"
    >
      검색
    </b-button>
    <b-sidebar id="sidebar-backdrop" title="Search" backdrop shadow>
      <div>
        <br />
        <b-form-group
          label="난이도 별 검색"
          v-if="selectedProject != ''"
          style="font-size: 15px;"
        >
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="selectedLevel"
            name="flavour-2"
          >
            <b-form-checkbox value="0">0</b-form-checkbox>
            <b-form-checkbox value="1">1</b-form-checkbox>
            <b-form-checkbox value="2">2</b-form-checkbox>
            <b-form-checkbox value="3">3</b-form-checkbox>
            <b-form-checkbox value="4">4</b-form-checkbox>
            <b-form-checkbox value="5">5</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <br />
        <p v-if="selectedProject == 'Collection'" style="font-size: 15px;">
          데이터 별 검색
        </p>
        <b-form-select
          v-model="selectedData"
          style="width: 100px;"
          v-if="selectedProject == 'Collection'"
          class="mb-3"
        >
          <b-form-select-option-group label="데이터 타입">
            <b-form-select-option :value="'image'">이미지</b-form-select-option>
            <b-form-select-option :value="'audio'">음성</b-form-select-option>
            <b-form-select-option :value="'text'">텍스트</b-form-select-option>
          </b-form-select-option-group>
        </b-form-select>
        <br />
        <p v-if="selectedProject == 'Labelling'" style="font-size: 15px;">
          작업 종류 별 검색
        </p>
        <b-form-select
          style="width: 200px;"
          v-if="selectedProject == 'Labelling'"
          v-model="selectedWork"
          class="mb-3"
        >
          <b-form-select-option-group label="작업 종류">
            <b-form-select-option :value="'boundingBox'"
              >이미지 바운딩 박스</b-form-select-option
            >
            <b-form-select-option :value="'classification'"
              >분류</b-form-select-option
            >
          </b-form-select-option-group>
        </b-form-select>
        <br />
        <p v-if="selectedProject == 'Collection'" style="font-size: 15px;">
          주제 별 검색
        </p>
        <b-form-input
          v-if="selectedProject == 'Collection'"
          size="sm"
          class="mb-3"
          placeholder="검색"
          v-model="selectedSubject"
        ></b-form-input>
        <br />
        <br />
        <b-button
          v-b-toggle.sidebar-backdrop
          v-on:click="search"
          id="projectSearchButton"
          placeholder="검색"
          >검색</b-button
        >
      </div>
    </b-sidebar>
    <hr class="bar" />
    <div class="overflow-auto">
      <b-table
        id="my-table"
        :items="projectList"
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
        first-text="처음"
        prev-text="이전"
        next-text="다음"
        last-text="마지막"
      ></b-pagination>

      <p class="mt-3">현재 페이지: {{ currentPage }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Project",
  data() {
    return {
      projectList: "",
      loginStatus: "",
      fields: [
        { key: "projectDto.projectName", label: "프로젝트 이름" },
        { key: "projectDto.userId", label: "의뢰자" },
        { key: "projectDto.workType", label: "작업 종류" },
        { key: "projectDto.dataType", label: "데이터 종류" },
        { key: "projectDto.show_details", label: "상세정보 보기" },
      ],
      workType: "",
      dataType: "",
      perPage: 10,
      currentPage: 1,
      selectedLevel: -1,
      selectedProject: "",
      selectedData: "",
      selectedWork: "",
      selectedSubject: "",
    };
  },
  async beforeCreate() {
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
  },
  async created() {
    this.fetchData();
    this.loginStatus = await localStorage.getItem("loginState");
    var projectType = await localStorage.getItem("projectList");
    this.selectedProject = JSON.parse(projectType).projectType;
  },
  watch: {
    $route: "fetchData",
  },
  computed: {
    rows() {
      return this.projectList.length;
    },
  },
  methods: {
    moveProject(detailItem) {
      // 자세히 보고싶은 프로젝트를 보여줄 수 있도록
      localStorage.searchProject = JSON.stringify(detailItem);
      this.$router.push({
        name: "ProjectDetail",
        params: {
          idx: detailItem.projectDto.projectId,
        },
      });
    },
    async fetchData() {
      var projectListParams = await localStorage.getItem("projectList");
      //라벨링 작업 프로젝트
      if (JSON.parse(projectListParams).projectType == "Labelling") {
        await axios
          .get("/api/project/list", {
            params: {
              workType: "labelling",
              dataType: JSON.parse(projectListParams).workType,
              difficulty: JSON.parse(projectListParams).difficulty,
              subject: JSON.parse(projectListParams).subject,
            },
          })
          .then((projectListRes) => {
            if (projectListRes.headers.search == "success") {
              this.projectList = projectListRes.data;
            } else {
              alert("검색한 프로젝트가 존재하지 않습니다.");
            }
          })
          .catch(function(error) {
            if (error.response) {
              alert("검색 정보가 없습니다!");
            }
          });
      }
      //수집 프로젝트 리스트
      if (JSON.parse(projectListParams).projectType == "Collection") {
        const projectListRes = await axios
          .get("/api/project/list", {
            params: {
              workType: "collection",
              dataType: JSON.parse(projectListParams).dataType,
              difficulty: JSON.parse(projectListParams).difficulty,
              subject: JSON.parse(projectListParams).subject,
            },
          })
          .then((projectListRes) => {
            if (projectListRes.headers.search == "success") {
              this.projectList = projectListRes.data;
            } else {
              alert("검색한 프로젝트가 존재하지 않습니다.");
            }
          })
          .catch(function(error) {
            if (error.response) {
              alert("검색 정보가 없습니다!");
            }
          });
      }
    },
    search: function() {
      if (!this.loginStatus) {
        alert("로그인이 필요한 작업입니다.");
        this.$router.push("/login");
      } else {
        if (this.selectedProject == null) {
          alert("원하는 검색 종류를 선택해주세요!");
        } else {
          let difficulty =
            this.selectedLevel == -1
              ? this.selectedLevel
              : this.selectedLevel[0];
          var params = {
            projectType: this.selectedProject,
            workType: this.selectedWork,
            dataType: this.selectedData,
            difficulty: difficulty,
            subject: this.selectedSubject,
          };
          localStorage.projectList = JSON.stringify(params);
          this.$router.push({ path: "/project", query: { params: params } });
        }
      }
    },
  },
};
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/hanna.css);
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);

#my-table {
  margin: auto;
  width: 1300px;
}
#projectLogo {
  width: 250px;
}

.list-group {
  max-width: 1200px;
  margin: auto;
  font-family: "Jeju Gothic", sans-serif;
  font-size: 18px;
}
.bar {
  border: none;
  border: 2px dashed tomato;
}
#projectNav {
  max-width: 1200px;
  margin: auto;
  font-size: 30px;
  font-family: "Hanna", sans-serif;
}
.data {
  font-size: 15px;
  font-weight: lighter;
}
.mb-3 {
  margin: 4px;
  width: 40px;
}

#showDetail {
  height: auto;
  line-height: auto;
  text-align: center;
  width: auto;
  border: 0px;
  padding-left: 10px;
  padding-right: 10px;
  min-width: 100px;
  color: white;
}
#projectSearchButton {
  width: 150px;
  height: 40px;
  font-size: 20px;
  text-transform: uppercase;
  color: #4682b4;
  background-color: #fff;
  border: 2px solid #4682b4;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  margin-top: 100px;
}
#projectSearchButton:hover {
  background-color: #4682b4;
  box-shadow: 0px 15px 20px rgba(40, 173, 252, 0.4);
  color: #fff;
  transform: translateY(-7px);
}
</style>
