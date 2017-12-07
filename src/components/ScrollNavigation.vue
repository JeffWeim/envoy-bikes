
<template>
  <section class="scroll-navigation" :class="{ show : showScrollNav }">
    <div class="scroll-navigation__wrapper">
      <span class="scroll-navigation__user-details">
        <img class="scroll-navigation__avatar" :src="user.photoURL" alt="avatar"/>

        <p class="scroll-navigation__name">{{ user.displayName }}</p>
      </span>

      <p class="scroll-navigation__date"><span class="orange">Date Selected:</span> <span class="bold">{{ todayString }}</span></p>
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'
  import debounce from 'lodash.debounce'

  export default {
    name: 'ScrollNavigation',
    data() {
      return {
        showScrollNav: false
      }
    },
    computed: {
      user() {
        if (!this.$store.getters.user) {
          return {}
        }

        return this.$store.getters.user
      },
      todayString() {
        return this.$store.getters.todayString
      }
    },
    methods: {
      signOut() {
        firebase.auth().signOut()
          .then(() => {
            this.$store.dispatch('setUser', null)
            this.$store.dispatch('setSignedIn', false)
            localStorage.removeItem('token')
            this.$router.go('/envoy-bikes/login')
          })
          .catch(error => {
            console.log(error)
          })
      },
    },
    updated() {
      let datePicker = document.querySelector('.vdp-datepicker')

      if (datePicker) {
        let datePickerTop = datePicker.getBoundingClientRect().top

        window.addEventListener('scroll', debounce(() => {
          let scrollTop = window.scrollY || window.screenY

          if (scrollTop >= datePickerTop) {
            this.showScrollNav = true
          } else {
            this.showScrollNav = false
          }

          if (scrollTop === 0) {
            this.showScrollNav = false
          }
        }, 25))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-navigation {
    transform: translateY(-170px);
    transition: transform 400ms ease;
    position: fixed;
    z-index: 150;
    background: white;
    box-shadow: grey 1px 0px 17px -2px;
    width: 100%;
    z-index: 1001;

    &.show {
      transform: translateY(-96px);
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
      justify-content: space-between;
      width: 100%;
      max-width: 90%;
      margin: 0 auto;
      text-align: center;
      min-height: 50px;

      @media screen and (min-width: 990px) {
        max-width: 990px;
      }
    }

    &__user-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      display: none;

      @media screen and (min-width: 480px) {
        display: flex;
      }
    }

    .bold {
      font-weight: bold;
    }

    .orange {
      color: #eb4e3b;
    }
  }
</style>
