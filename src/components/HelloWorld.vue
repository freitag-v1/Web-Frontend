<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import request from "request"
import axios from 'axios'


export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: ""
    }
  },
  async mounted() {
    const res = await axios.get("/api/hello");
    console.log(res);
    console.log(res.data);
    this.msg = res.data;
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
