<template>
<div>
  <b-tabs content-class="mt-3" class = "ranking">
    <b-tab title="정확도" active><p>
      <div>
        <b-table striped hover :items="accuracyItems"></b-table>
      </div></p></b-tab>
    <b-tab title="누적포인트"><p>
     <div>
        <b-table striped hover :items="pointItems"></b-table>
      </div>
    </p></b-tab>
  </b-tabs>
</div>
</template>

<script>

export default {
  data() {
    return {
      accuracyItems: [
        { Ranking: 1, first_name: 'Dickerson', accuracy: '99%' },
        { Ranking: 2, first_name: 'Larsen', accuracy: '70%' },
        { Ranking: 3, first_name: 'Geneva', accuracy: '50%' },
        { Ranking: 4, first_name: 'Jami', accuracy: '40%' }
      ],
      pointItems: [
        { Ranking: 1, first_name: 'Dickerson', point: 3310000 },
        { Ranking: 2, first_name: 'Larsen', point: 200000 },
        { Ranking: 3, first_name: 'Geneva', point: 10000 },
        { Ranking: 4, first_name: 'Jami', point: 4000 }
      ]
    }
  }
}
</script>


<style>
.ranking{
  max-width: 400px;
  
}
</style>