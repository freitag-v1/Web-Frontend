<template>
    <div class = "completeProject">
        <h1>{{userId + "님의 의뢰한 작업 목록"}}</h1>
    </div>
</template>
<script>
export default {
    name : 'CompleteProject',
    data() {
        return {
            userId: '',
        }
    },
    async created() {
        this.userId = await localStorage.getItem('userId');
    }
}
</script>
<style>
</style>
