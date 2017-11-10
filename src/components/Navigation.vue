
<template>
  <section v-if="user" class="navigation">
    <div class="navigation__wrapper">
      <img class="navigation__avatar" :src="user.photoURL" alt="avatar"/>

      <p class="navigation__name">Welcome, {{ user.displayName }}</p>

      <button class="navigation__button" @click="signOut">Sign Out</button>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase'

  export default {
    name: 'Navigation',
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    methods: {
      signOut() {
        firebase.auth().signOut()
          .then(() => {
            this.$store.dispatch('setUser', null)
            localStorage.removeItem('token')
            this.$router.go('/envot-bikes/login')
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
    position: absolute;
    right: 3rem;
    top: 0;

    @media screen and (max-width: 480px) {
      position: absolute;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
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

    &__wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
</style>

