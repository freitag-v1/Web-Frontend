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
  <button v-on:click="sort">정렬</button>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      pointFields : [{key: 'rank', label: '순위'}, {key : 'userId', label: '사용자 아이디'}, {key : 'totalPoint', label: '누적 포인트'}],
      accuracyItems: [
        { 순위: 1, userId: 'Dickerson', 정확도: '99%' },
        { 순위: 2, userId: 'Larsen', 정확도: '70%' },
        { 순위: 3, userId: 'Geneva', 정확도: '50%' },
        { 순위: 4, userId: 'Jami', 정확도: '40%' }
      ],
      pointItems: [{ numOfProblems: 1, userId: 'Dickerson', totalPoint: 5000 },
        { numOfProblems : 2, userId: 'Larsen', totalPoint: 4000 },
        { numOfProblems: 5, userId: 'Geneva', totalPoint: 4000 },
        { numOfProblems: 3, userId: 'Geneva', totalPoint: 2000 },
        { numOfProblems: 4, userId: 'Jami', totalPoint: 2000 }],
      tabIndex: 0,
    }
  },
  async created() {
    // const pointRankingRes = await axios.get("/api/ranking/point");
    // if(pointRankingRes.headers.ranking == 'fail') {
    //   alert("누적 포인트 별 랭킹 조회가 실패하였습니다.");
    // }
    // else {
    //   this.pointItems = pointRankingRes.data;
    // }
  },
  methods:{
    linkClass(idx){
      if(this.tabIndex == idx){
        return ['bg-info', 'text-light']
      }
      else {
        return ['bg-light', 'text-info']
      }
    },
    sort() {
      for(let i = 0; i < this.pointItems.length; i++){
        for(let j = i + 1; j < this.pointItems.length; j++){
          if(this.pointItems[i].totalPoint == this.pointItems[j].totalPoint && 
            this.pointItems[i].numOfProblems < this.pointItems[j].numOfProblems){
              console.log(this.pointItems[i],this.pointItems[j]);
              var tempItems = this.pointItems[i];
              this.pointItems[i] = this.pointItems[j];
              this.pointItems[j] = tempItems;
            }
        }
      }
      console.log(this.pointItems);
    }
  }
}
</script>

<style>
.ranking{
  max-width: 400px;
}
</style>