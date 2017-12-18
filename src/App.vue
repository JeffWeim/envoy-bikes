<template>
  <section class="app" id="app" :class="{ fixed: navMenu }">
    <ScrollNavigation></ScrollNavigation>
    <navigation></navigation>

    <router-view></router-view>
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
    computed: {
      navMenu() {
        return this.$store.getters.navMenu
      }
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
  }

  .fixed {
    overflow: hidden;
  }

  body,
  html {
    background: #f2f2f2;
    height: 100%;
  }
</style>
