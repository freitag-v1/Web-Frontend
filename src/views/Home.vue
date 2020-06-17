<template>
  <div class="home">
    <div class="carousel-fade">
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
            />
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
            />
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
            />
          </template>
        </b-carousel-slide> </b-carousel
      ><router-view></router-view>
      <footer class="footer">
        <br />
        <p>Copyright &copy; 2020 Freitag. All rights reserved.</p>
      </footer>
    </div>

    <div class="description">
      <b-card id="description_card">
        <span style="font-weight: bolder; font-size: 22px; text-align:left;"
          >방구석 수집가</span
        >

        <b-card-text style="font-size : 17px; text-align: left;">
          <br />
          방구석 수집가는 누구나 참여할 수 있는 데이터 수집/가공 플랫폼입니다.
          <br />
          <br />
          <b-icon icon="star" variant="warning"></b-icon> 시간과 공간에 대해
          제약없이 자유로운 작업 참여 가능!
          <br />
          <br />
          <b-icon icon="star" variant="info"></b-icon> 자유로운 작업 의뢰와 교차
          검증 과정을 통해 고품질의 데이터 제공!
          <br />
        </b-card-text>
      </b-card>
    </div>
    <div class="ranking">
      <Ranking></Ranking>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import Ranking from "@/components/Ranking.vue";
import SignUp from "@/views/SignUp.vue";

export default {
  name: "Home",
  components: {
    Ranking,
  },
  data() {
    return {
      loginStatus: "",
    };
  },
  async created() {
    this.loginStatus = await localStorage.getItem("loginState");
  },
};
</script>
<style>
b-navber-nav {
  color: #21a2b7;
  font-size: 30px;
}
.navbar {
  height: 65px;
  width: 70%;
  margin-left: 15%;
}
.bar-font {
  color: red;
}
.overflow-hidden {
  margin-left: 300px;
}
.carousel-fade {
  width: 800px;
  margin-left: 100px;
  float: left;
}
.ranking {
  width: 100%;
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 120px;
  float: left;
}
#description_card {
  margin-left: 140px;
  width: 600px;
  height: 250px;
  float: left;
}
</style>
