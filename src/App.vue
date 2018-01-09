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

    &:after {
      opacity: 0;
      transition: opacity 500ms ease;
    }
  }

  .fixed {
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      background: rgba($color: #000000, $alpha: .5);
      top: 0;
      left: 0;
      opacity: 1;
      z-index: 12;
    }
  }

  body,
  html {
    background: #f2f2f2;
    height: 100%;
  }
</style>
