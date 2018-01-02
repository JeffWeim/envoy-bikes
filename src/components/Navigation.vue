
<template>
  <section v-if="signedIn" class="navigation">
    <div class="navigation__wrapper">
      <span>
        <a class="navigation__toggle" href="#" @click.prevent="toggleMenu">&#9776;</a>
      </span>
      <span class="navigation__profile">
        <img class="navigation__avatar" :src="user.photoURL" alt="avatar"/>

        <p class="navigation__name">Welcome, {{ user.displayName }}</p>

        <button class="navigation__button" @click="signOut">Sign Out</button>
      </span>
    </div>

    <Profile v-on:forceNavUpdate="update"></Profile>
  </section>
</template>

<script>
  import firebase from 'firebase'
  import Profile from '@/components/Profile'

  export default {
    name: 'Navigation',
    components: {
      Profile
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      navMenu() {
        return this.$store.getters.navMenu
      },
      signedIn() {
        return this.$route.path !== '/envoy-bikes/login'
      }
    },
    methods: {
      update() {
        // Force update on 'user' computed property - need this since Vue can't deep watch nested arrays with computed properties
        this.$forceUpdate()
      },
      toggleMenu() {
        if (this.navMenu) {
          this.$store.dispatch('setNavMenu', false)
        } else {
          this.$store.dispatch('setNavMenu', true)
        }
      },
      signOut() {
        firebase.auth().signOut()
          .then(() => {
            this.$store.dispatch('setUser', null)
            localStorage.removeItem('token')
            this.$router.go('/envoy-bikes/login')
          })
          .catch(error => {
            console.log(error)
          })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .navigation {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: #f2f2f2;
    border-bottom: 1px solid lightgray;

    @media screen and (max-width: 480px) {
      margin-left: auto;
      margin-right: auto;
    }

    &__wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 90%;
      margin: 0 auto;

      @media screen and (min-width: 990px) {
        max-width: 990px;
      }
    }

    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &__name {
      margin-right: 10px;
    }

    &__button {
      padding: 5px;
      cursor: pointer;
      background: transparent;
      font-size: 15px;
      border: 1px solid #eb4e3b;
      color: #eb4e3b;
    }

    &__profile {
      display: inline-flex;
      align-items: center;
      height: 100%;
    }

    &__toggle {
      font-size: 24px;
      text-decoration: none;
      color: #eb4e3b;
    }
  }
</style>

