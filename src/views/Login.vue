
<template>
  <section class="signup">

    <div class="signup__logo-container">
      <img src="../assets/envoy-logo.png" alt="Envoy Logo" class="signup__logo"/>

      <img src="../assets/bike-large.svg" alt="Bike Logo" class="signup__bike"/>
    </div>

    <span class="signup__spinner" v-if="loading">
      <trinity-rings-spinner :animation-duration="1500" :size="66" color="#eb4e3b" />
    </span>

    <div v-if="user">
      <img :src="user.photoURL" alt="avatar" style="width: 30px; height: 30px; border-radius: 50%;"/>
      <button @click="signOut">Sign Out</button>
    </div>

    <div v-if="!user && !loading">
      <p class="signup__directions">Please Sign in using your <br> <span class="orange">username@weareenvoy.com</span> account</p>
      <img class="signup__google" src="../assets/google_signin.png" alt="Google Sign In Button" @click="signInWithGoogle"/>

      <p class="signup__error--disabled" v-if="showError">We're sorry, your account has been disabled</p>
    </div>

  </section>
</template>

<script>
  import firebase from 'firebase'
  import { TrinityRingsSpinner  } from 'epic-spinners'


  export default {
    name: 'Login',
    components: {
      TrinityRingsSpinner
    },
    data() {
      return {
        loading: true,
        user: null,
        showError: false
      }
    },
    methods: {
      signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        provider.setCustomParameters({
          login_hint: 'username@weareenvoy.com',
          prompt: 'select_account',
          hd: 'weareenvoy.com'
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
        this.loading = false
      })

      firebase.auth().getRedirectResult()
        .then(authData => {
          if (authData.user !== null) {
            localStorage.setItem('token', authData.credential.accessToken)
          }
        })
        .catch(error => {
          if (error && error.code === 'auth/internal-error') {
            this.showError = true
          }
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
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;

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
      align-items: center;
      width: 100%;
      max-width: 200px;
      height: auto;
      margin: 0 auto;

      @media screen and (min-width: 480px) {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    &__logo {
      margin-bottom: 1rem;
      width: 120px;

      @media screen and (min-width: 480px) {
        margin-bottom: 0;
      }
    }

    &__bike {
      width: 70px;
    }

    &__logo,
    &__bike {
      max-width: 100%;
    }

    &__directions {
      margin: 3rem 0;
    }

    &__error {
      &--disabled {
        color: #eb4e3b;
        font-weight: bold;
        margin: 0 auto;
        max-width: 400px;
        width: 100%;
        margin-top: 3rem;
      }
    }

    &__spinner {
      margin-top: 25px;
    }

    .orange {
      color: #eb4e3b;
    }
  }
</style>
