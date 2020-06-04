<template>
<div>
  <b-tabs content-class="mt-3" class = "ranking">
    <b-tab title="정확도" active><p>
      <div>
        <b-table striped hover :items="accuracyItems" >
        </b-table>
      </div></p></b-tab>
    <b-tab title="누적포인트"><p>
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
        { Ranking: 1, first_name: 'Dickerson', accuracy: '99%' },
        { Ranking: 2, first_name: 'Larsen', accuracy: '70%' },
        { Ranking: 3, first_name: 'Geneva', accuracy: '50%' },
        { Ranking: 4, first_name: 'Jami', accuracy: '40%' }
      ],
      pointItems: [
        // { Ranking: 1, first_name: 'Dickerson', point: 3310000 },
        // { Ranking: 2, first_name: 'Larsen', point: 200000 },
        // { Ranking: 3, first_name: 'Geneva', point: 10000 },
        // { Ranking: 4, first_name: 'Jami', point: 4000 }
      ],
    }
  },
  async created() {
    const pointRankingRes = await axios.get("/api/ranking/point");
    if(pointRankingRes.headers.ranking == 'fail') {
      alert("누적 포인트 별 랭킹 조회가 실패하였습니다.");
    }
    else {
      this.pointItems = pointRankingRes.data;
      console.log(pointRankingRes.data);
    }
  }
}
</script>


<style>
.ranking{
  max-width: 400px;
  
}
</style>