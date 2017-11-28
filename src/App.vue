<template>
  <section class="app" id="app">
    <ScrollNavigation></ScrollNavigation>
    <navigation></navigation>

    <div class="app__wrapper">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import ScrollNavigation from '@/components/ScrollNavigation'

  export default {
    name: 'app',
    components: {
      Navigation,
      ScrollNavigation
    },
    created() {
      if (localStorage.getItem('signedWaiver') === null) {
        localStorage.setItem('signedWaiver', false)
      }
    }
  }
</script>

<style lang="scss">
  .app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;

    &__wrapper {
      width: 100%;
      max-width: 90%;
      margin: 0 auto;
    }
  }

  body,
  html {
    background: #f2f2f2;
    height: 100%;
  }
</style>
