
<template>
  <section class="edit-profile" :class="{ open: navMenu }">
    <div class="edit-profile__container">
      <h3 class="edit-profile__headline">Profile Information</h3>
      <span class="edit-profile__field">
        <p class="edit-profile__text">Email:</p>
        <p class="edit-profile__text edit-profile__text--sub">{{ user.email }}</p>
      </span>

      <span class="edit-profile__field">
        <p class="edit-profile__text">Display Name:</p>
        <p class="edit-profile__text edit-profile__text--sub">{{ user.displayName }}</p>
      </span>

      <h3 class="edit-profile__headline">Edit Profile</h3>
      <span class="edit-profile__field">
        <label for="displayNanme">Edit Display Name</label>
        <input type="text" v-model="editName" maxlength="15"/>
        <a class="edit-profile__button" href="#" @click.prevent="editDisplayName">Submit</a>
      </span>

      <span v-if="success" class="edit-profile__field edit-profile__field--message">
        <p class="edit-profile__success">Success!</p>
      </span>

      <span v-if="failed" class="edit-profile__field edit-profile__field--message">
        <p class="edit-profile__failed">Failed!</p>
      </span>
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'EditProfile',
    data () {
      return {
        editName: '',
        success: false,
        failed: false,
        user: {}
      }
    },
    computed: {
      navMenu() {
        return this.$store.getters.navMenu
      },
    },
    methods: {
      createDate(val) {
        debugger
        return new Date(val)
      },
      editDisplayName() {
        let self = this

        this.user.updateProfile({
          displayName: self.editName
        }).then(() => {
          self.user = firebase.auth().currentUser
          self.successMessage()
          self.$store.dispatch('setUser', {
            displayName: self.user.displayName,
            photoURL: self.user.photoURL,
            uid: self.user.uid,
            email: self.user.email,
            metadata: {
              lastSignInTime: self.user.metadata.lastSignInTime
            }
          })
          self.editName = ''
        }).catch(error => {
          console.log(error)
          self.failureMessage()
        })
      },
      successMessage() {
        this.success = !this.success

        setTimeout(() => {
          this.success = !this.success
        }, 4000)
      },
      failureMessage() {
        this.failed = !this.failed

        setTimeout(() => {
          this.failed = !this.failed
        }, 4000)
      }
    },
    created() {
      setTimeout(() => {
        this.user = firebase.auth().currentUser
      }, 2000)
    }
  }
</script>

<style lang="scss" scoped>
  .edit-profile {
    position: fixed;
    background-color: white;
    height: 100%;
    width: 100%;
    transition: transform 350ms ease;
    transform: translateX(-1500px);
    top: 0;
    z-index: -1;
    padding-top: 54px;

    @media screen and (min-width: 768px) {
      width: 50vw;
      max-width: 1000px;
    }

    &.open {
      transform: translateX(0px);
    }

    &__container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 95vh;
    }

    &__headline {
      color: #eb4e3b;
      font-size: 25px;
    }

    input {
      padding: 8px;
      border: 1px solid lightgray;
    }

    label {
      display: block;
      margin-bottom: 10px;
    }

    &__button {
      padding: 5px;
      cursor: pointer;
      background: transparent;
      font-size: 15px;
      border: 1px solid #eb4e3b;
      color: #eb4e3b;
      border-radius: 4px;
      text-decoration: none;
    }

    &__field {
      &--message {
        position: absolute;
        bottom: 50px;
      }
    }

    &__success {
      color: #9fcd9f;
      font-size: 20px;
      font-weight: bold;
    }

    &__failed {
      color: #d56363;
      font-size: 20px;
      font-weight: bold;
    }
  }
</style>
