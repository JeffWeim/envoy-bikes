<template>
  <div class="welcome">
    <h1>ENVOY BIKES</h1>

    <h2>Schedule for {{ date }}</h2>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
    props: [
      'date'
    ],
    data () {
      return {
        msg: ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: rgb(233, 120, 94);
  }

  h1, h2 {
    font-weight: normal;
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
