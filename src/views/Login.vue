
<template>
  <section class="signup">

    <div class="signup__logo-container">
      <img src="../assets/envoy-logo.png" alt="Envoy Logo" class="signup__logo"/>

      <img src="../assets/bike-large.svg" alt="Bike Logo" class="signup__bike"/>
    </div>

    <p v-if="loading">Loading...</p>

    <div v-if="user">
      <img :src="user.photoURL" alt="avatar" style="width: 30px; height: 30px; border-radius: 50%;"/>
      <button @click="signOut">Sign Out</button>

      <router-link to="/envoy-bikes">
        Home
      </router-link>
    </div>

    <div v-if="!user && !loading">
      <p class="signup__directions">Please Sign in using your <br> <span class="orange"><span style="font-style: normal;">username@</span>weareenvoy.com</span> account</p>
      <img class="signup__google" src="../assets/google_signin.png" alt="Google Sign In Button" @click="signInWithGoogle"/>
    </div>

  </section>
</template>

<script>
  import firebase from 'firebase'


  export default {
    name: 'Login',
    data() {
      return {
        loading: true,
        user: null,
      }
    },
    methods: {
      signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        provider.setCustomParameters({
          login_hint: 'user_name@weareenvoy.com',
          prompt: 'select_account',
          hd: "weareenvoy.com"
        })

        firebase.auth().signInWithRedirect(provider)
          .then(result => {
            this.user = result.user
            this.$store.dispatch('setUser', result.user)
          })
          .catch(error => {
            console.log(error)
          })
      },

      signOut() {
        firebase.auth().signOut()
          .then(() => {
            this.user = null
            this.$store.dispatch('setUser', null)
            localStorage.removeItem('token')
          })
          .catch(error => {
            console.log(error)
          })
      },
    },
    beforeCreate() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('setUser', user)
        }
        this.loading = false
      })

      firebase.auth().getRedirectResult()
        .then(authData => {
          if (authData !== null) {
            localStorage.setItem('token', authData.credential.accessToken)
          }
        }).catch(error => {
          console.log(error)
        })
    },
    updated() {
      if (this.$store.getters.user) {
        this.$router.replace('/envoy-bikes')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .signup {
    &__google {
      cursor: pointer;
      transform: translateY(0);
      transition: transform 350ms ease;
      max-width: 100%;
      width: 275px;

      &:hover {
        transform: translateY(2px);
      }
    }

    &__logo-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-self: center;
      width: 20%;
      height: 40px;
      margin: 0 auto;

      @media screen and (min-width: 480px) {
        flex-direction: row;
      }
    }

    &__logo {
      margin-bottom: 1rem;

      @media screen and (min-width: 480px) {
        margin-bottom: 0;
      }
    }

    &__logo,
    &__bike {
      max-width: 100%;
      width: 120px;
    }

    &__directions {
      margin: 3rem 0;
    }

    .orange {
      color: #eb4e3b;
      font-style: italic;
    }
  }
</style>

