<template>
<div>
  <b-tabs content-class="mt-3" class = "ranking" v-model="tabIndex">
    <b-tab id="accuracyTitle" title="정확도" :title-link-class="linkClass(0)"><p>
      <div>
        <b-table striped hover :items="accuracyItems" :fields="accuracyFields" >
        <template v-slot:cell(rank)="data"> 
              {{data.index + 1 }}
          </template>
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
      pointFields : [{key: 'rank', label: '순위'}, {key : 'userId', label: '사용자 아이디'}, {key : 'totalPoint', label: '누적 포인트'},{key : 'numOfProblems', label: '누적 작업 수'} ],
      accuracyFields : [{key: 'rank', label: '순위'}, {key : 'userId', label: '사용자 아이디'}, {key : 'userAccuracy', label: '정확도'},{key : 'numOfProblems', label: '누적 작업 수'} ],
      accuracyItems: [],
      pointItems: [],
      tabIndex: 0,
    }
  },
  async created() {
    await axios.get("/api/ranking/point").then(pointRankingRes => {
      if(pointRankingRes.headers.ranking == 'fail') {
        alert("누적 포인트 별 랭킹 조회가 실패하였습니다.");
      }
      else {
        this.pointItems = pointRankingRes.data;
        this.pointSort();
      }
    }).catch(function(error){
      if (error.response) {
        alert("누적 포인트 랭킹 목록을 가져오는데 실패하였습니다.");
      }
    });
    await axios.get("/api/ranking/accuracy").then(accuracyRankingRes => {
      if(accuracyRankingRes.headers.ranking == 'fail') {
        alert("누적 포인트 별 랭킹 조회가 실패하였습니다.");
      }
      else {
        this.accuracyItems = accuracyRankingRes.data;
        this.accuracySort();
      }
    }).catch(function(error){
      if (error.response) {
        alert("누적 포인트 랭킹 목록을 가져오는데 실패하였습니다.");
      }
    });
    

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
    pointSort() {
      for(let i = 0; i < this.pointItems.length; i++){
        for(let j = i + 1; j < this.pointItems.length; j++){
          if(this.pointItems[i].totalPoint == this.pointItems[j].totalPoint && 
            this.pointItems[i].numOfProblems < this.pointItems[j].numOfProblems){
              //console.log(this.pointItems[i],this.pointItems[j]);
              var tempItems = this.pointItems[i];
              this.pointItems[i] = this.pointItems[j];
              this.pointItems[j] = tempItems;
            }
        }
      }
    },
    accuracySort() {
      for(let i = 0; i < this.accuracyItems.length; i++){
        for(let j = i + 1; j < this.accuracyItems.length; j++){
          if(this.accuracyItems[i].accuracy == this.accuracyItems[j].accuracy && 
            this.accuracyItems[i].numOfProblems < this.accuracyItems[j].numOfProblems){
              //console.log(this.accuracyItems[i],this.accuracyItems[j]);
              var tempItems = this.accuracyItems[i];
              this.accuracyItems[i] = this.accuracyItems[j];
              this.accuracyItems[j] = tempItems;
            }
        }
      }
    },

  }
}
</script>

<style>
.ranking{
  max-width: 500px;
}
</style>