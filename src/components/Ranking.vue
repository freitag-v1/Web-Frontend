<template>
<div>
  <b-tabs content-class="mt-3" class = "ranking" v-model="tabIndex">
    <b-tab id="accuracyTitle" title="정확도" :title-link-class="linkClass(0)"><p>
      <div>
        <b-table striped hover :items="accuracyItems" >
        </b-table>
      </div></p></b-tab>
    <b-tab id="pointTitle" title="누적포인트" :title-link-class="linkClass(1)" active><p>
     <div>
        <b-table striped hover :items="pointItems" :fields="pointFields">
          <template v-slot:cell(rank)="data"> 
              {{data.index + 1 }}
          </template>
        </b-table>
      </div>
    </p></b-tab>
  </b-tabs>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      pointFields : [{key: 'rank', label: '순위'}, {key : 'userId', label: '사용자 아이디'}, {key : 'totalPoint', label: '누적 포인트'}],
      accuracyItems: [
        { 순위: 1, 이름: 'Dickerson', 정확도: '99%' },
        { 순위: 2, 이름: 'Larsen', 정확도: '70%' },
        { 순위: 3, 이름: 'Geneva', 정확도: '50%' },
        { 순위: 4, 이름: 'Jami', 정확도: '40%' }
      ],
      pointItems: [],
      tabIndex: 0,
    }
  },
  async created() {
    const pointRankingRes = await axios.get("/api/ranking/point");
    if(pointRankingRes.headers.ranking == 'fail') {
      alert("누적 포인트 별 랭킹 조회가 실패하였습니다.");
    }
    else {
      this.pointItems = pointRankingRes.data;
    }
  },
  methods:{
    linkClass(idx){
      if(this.tabIndex == idx){
        return ['bg-info', 'text-light']
      }
      else {
        return ['bg-light', 'text-info']
      }
    }
  }
}
</script>

<style>
.ranking{
  max-width: 400px;
}
</style>