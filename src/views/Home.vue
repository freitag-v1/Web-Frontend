<template>
  <div class="home">
    <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">
    Collector In Room</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item-dropdown text="Project" style="font-size: 18px;" right>
          <b-dropdown-item href="project" style="font-size: 18px;" >Project List</b-dropdown-item>
          <b-dropdown-item href="newProject" style="font-size: 18px;">Project Create</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-on:click="collectionProject" link-classes="bar-font" style="font-size: 18px;">Collection</b-nav-item>
        <b-nav-item-dropdown text="Labelling" style="font-size: 18px;" right>
          <b-dropdown-item v-on:click="boundingBoxProject" style="font-size: 18px;" >Image Bounding Box</b-dropdown-item>
          <b-dropdown-item v-on:click="classificationProject" style="font-size: 18px;">Classification</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-nav-item v-b-toggle.sidebar-backdrop style="font-size: 19px; font-weight: bold; font-style: italic; ">Search</b-nav-item>
          <!--<b-icon id ="searchIcon" icon="search" scale="1.5" shift-v="1.25" type = "submit" aria-hidden="true"></b-icon>-->
           <b-sidebar
            id="sidebar-backdrop"
            title="Search"
            backdrop
            shadow
          >
          <div>
            <b-form-select v-model="selectedProject" class="mb-3">
              <b-form-select-option-group label="프로젝트 종류">
                <b-form-select-option :value="'Labelling'">라벨링 프로젝트</b-form-select-option>
                <b-form-select-option :value="'Collection'">수집 프로젝트</b-form-select-option>
                </b-form-select-option-group>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-select v-if="selectedProject == 'Labelling'" v-model="searchType" class="mb-3">
            <b-form-select-option-group label="검색 타입">
                <b-form-select-option :value="'dataType'">데이터 종류</b-form-select-option>
                <b-form-select-option :value="'levelType'">난이도</b-form-select-option>
                <b-form-select-option :value="'workType'">작업 종류</b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-select v-if="selectedProject == 'Collection'" v-model="searchType" class="mb-3">
            <b-form-select-option-group label="검색 타입">
                <b-form-select-option :value="'dataType'">데이터 종류</b-form-select-option>
                <b-form-select-option :value="'levelType'">난이도</b-form-select-option>
                <b-form-select-option :value="'subjectType'">주제</b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-group label="난이도 별 검색" v-if="searchType == 'levelType'">
            <b-form-checkbox-group id="checkbox-group-2" v-model="selectedLevel" name="flavour-2">
              <b-form-checkbox value="0">0</b-form-checkbox>
              <b-form-checkbox value="1">1</b-form-checkbox>
              <b-form-checkbox value="2">2</b-form-checkbox>
              <b-form-checkbox value="3">3</b-form-checkbox>
              <b-form-checkbox value="4">4</b-form-checkbox>
              <b-form-checkbox value="5">5</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-form-select v-if="searchType == 'dataType'" v-model="selectedData" class="mb-3">
            <b-form-select-option-group label="데이터 타입">
                <b-form-select-option :value="'image'">이미지</b-form-select-option>
                <b-form-select-option :value="'audio'">음성</b-form-select-option>
                <b-form-select-option :value="'text'">텍스트</b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-select v-if="searchType == 'workType' && selectedProject == 'Labelling'" v-model="selectedWork" class="mb-3">
            <b-form-select-option-group label="작업 종류">
                <b-form-select-option :value="'boundingBox'">이미지 바운딩 박스</b-form-select-option>
                <b-form-select-option :value="'classification'">분류</b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="selectedSubject" v-if="searchType == 'subjectType' && selectedProject == 'Collection'"></b-form-input>
          <br>
          <br>
          <b-button class="searchButton" v-on:click = "search" variant="outline-primary">Search</b-button>
        </div>
        
        </b-sidebar>
        </b-nav-form>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="mypage" v-if="loginStatus" style="font-size: 19px;" >Profile</b-dropdown-item>
          <b-dropdown-item-button v-on:click = "logout" style="font-size: 19px;" v-if="loginStatus">Sign Out</b-dropdown-item-button>
          <b-dropdown-item href="login" style="font-size: 19px;" v-if="!loginStatus">Sign In</b-dropdown-item>
          <b-dropdown-item href="signup" style="font-size: 19px;" v-if="!loginStatus">Sign Up</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <div class ="carousel-fade">
    <b-carousel
    style="text-shadow: 0px 0px 2px #000"
    fade
    indicators
    img-width="1024"
    img-height="480"
  >
    <b-carousel-slide>
        <template v-slot:img>
          <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            src="../assets/home_collection.png"
            alt="image slot"
          >
        </template>
      </b-carousel-slide>
      <b-carousel-slide>
        <template v-slot:img>
          <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            src="../assets/home_classification.png"
            alt="image slot"
          >
        </template>
      </b-carousel-slide>
      <b-carousel-slide>
        <template v-slot:img>
          <img
            class="d-block img-fluid w-100"
            width="1024"
            height="480"
            src="../assets/home_labelling.png"
            alt="image slot"
          >
        </template>
      </b-carousel-slide>
  </b-carousel><router-view></router-view>
</div>
<div class = "ranking">
  <Ranking></Ranking>
</div>


 
    
    <!--<Login id = "login" v-if="!loginStatus" @login-event="loginMethod"/> <!-- emit해서 login에서 로그인 상태 던지고 home에서 이거 받아서 할 수 있도록> -->
 
    

</div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import Ranking from '@/components/Ranking.vue'
import SignUp from '@/views/SignUp.vue'


export default {
  name: 'Home',
  components: {
    Ranking
  },
  data() {
    return {
      loginStatus: '',
      selected: null,
      selectedLevel: null,
      searchType: null,
      selectedProject: null,
      selectedData : null,
      selectedWork: null,
      selectedSubject: null,
  }
  },
  async beforeCreate() {
      this.loginStatus = await localStorage.getItem('loginState');
      //console.log("ggggg"+this.loginStatus);
      //alert(this.loginStatus);
  },
   methods : {
     logout: function() {
        this.$store.dispatch('LOGOUT');
        alert("로그아웃 완료");
        setTimeout(()=> {
                location.reload();
                           //alert("hello");
                },2000);   
      },
      search: function() {
        if(!this.loginStatus){
          alert("로그인이 필요한 작업입니다.");
          this.$router.push("/login");
        }
        else {
          if (this.selectedProject == null) {
            alert("원하는 검색 종류를 선택해주세요!");
          }
          else {
            this.$router.push({name: "Project",
              params: {
                projectType : this.selectedProject,
                workType : this.selectedWork,
                dataType: this.selectedData,
                difficulty : this.selectedLevel,
                subject : this.selectedSubject,
              }
            })
          }
          
          }
        },
        collectionProject: function() {
          this.$router.push({name : "Project", params : {
              projectType : "Collection",
          }});
        },
        boundingBoxProject: function() {
            this.$router.push({name : "Project", params : {
              projectType : "Labelling",
              workType: 'boundingBox'
            }});
        },
        classificationProject: function() {
          this.$router.push({name : "Project", params : {
              projectType : "Labelling",
              workType: 'classification'
            }});
        }

      },
     
}
</script>
<style>
b-navber-nav {
  color: #21a2b7;
  font-size : 30px;
}
.navbar {
  height: 65px;
  width: 70%;
  margin-left : 15%;
}
.bar-font {
  color : red;
}
.overflow-hidden {
  margin-left: 300px;

}
.carousel-fade {
  width: 800px;
  margin-top: 30px;
  margin-left: 150px;
  float:left;
}
.ranking{
  width : 100%;
  vertical-align: middle;
  margin-top: 30px;
  margin-left: 100px;
  float:left;
}
#searchIcon{
  margin:4px;
}
.mb-3 {
  margin : 4px;
  width: 50px;
}
.searchButton {
  width: 150px;
  height: 40px;
  text-transform: uppercase;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  font-family:"Verdana";
  margin-top: 100px;
}
.searchButton:hover {
  background-color: #28adfc;
  box-shadow: 0px 15px 20px rgba(40, 173,252, 0.4);
  color: #fff;
  transform: translateY(-7px);
  border-radius: 8px;
}





</style>

