
<template>
  <section class="profile" :class="{ open: navMenu }">
    <div class="profile__container">
      <h3 class="profile__headline">Profile Information</h3>
      <span class="profile__field">
        <p class="profile__text">Email:</p>
        <p class="profile__text profile__text--sub">{{ user.email }}</p>
      </span>

      <div class="profile__field">
        <p class="profile__text">Display Name:</p>

        <span v-if="!showEditName">
          <p class="profile__text profile__text--sub inline">{{ user.displayName }}</p>
          <a class="profile__button profile__button--edit inline" href="#" @click.prevent="toggleEditName">Edit</a>
        </span>

        <span v-if="showEditName">
          <input type="text" v-model="editName" maxlength="15"/>
          <a class="profile__button" href="#" @click.prevent="editDisplayName">Submit</a>
          <a class="profile__button" href="#" @click.prevent="toggleEditName">Cancel</a>
        </span>
      </div>

      <span v-if="success" class="profile__field profile__field--message">
        <p class="profile__success">Success!</p>
      </span>

      <span v-if="failed" class="profile__field profile__field--message">
        <p class="profile__failed">Failed!</p>
      </span>
    </div>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Profile',
    data () {
      return {
        editName: '',
        success: false,
        failed: false,
        showEditName: false
      }
    },
    computed: {
      navMenu() {
        return this.$store.getters.navMenu
      },
      user() {
        return this.$store.getters.user
      },
    },
    methods: {
      toggleEditName() {
        this.showEditName = !this.showEditName
      },
      editDisplayName() {
        let self = this

        this.user.updateProfile({
          displayName: self.editName
        }).then(() => {
          this.$emit('forceNavUpdate')
          self.successMessage()
          self.toggleEditName()
          self.editName = ''
        }).catch(error => {
          console.log(error)
          self.failureMessage()
          self.toggleEditName()
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
    }
  }
</script>

<style lang="scss" scoped>
  .profile {
    position: fixed;
    background-color: white;
    height: 100%;
    width: 100%;
    transition: transform 350ms ease;
    transform: translateX(-1500px);
    top: 0;
    z-index: 0;
    margin-top: 55px;

    &:after {
      opacity: 0;
      transition: opacity 1000ms ease;
    }

    @media screen and (min-width: 768px) {
      width: 50vw;
      max-width: 1000px;
    }

    &.open {
      transform: translateX(0px);

      @media screen and (min-width: 768px) {
        &:after {
          content: '';
          opacity: 1;
          position: absolute;
          top: 0;
          left: 50vw;
          height: 100%;
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
        }
      }
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
      text-decoration: none;

      &--edit {
        margin-left: 10px;
      }
    }

    &__field {
      &--message {
        position: absolute;
        bottom: 50px;
      }
    }

    &__text,
    &__lable {
      color: #eb4e3b;

      &--sub {
        color: #a1a8af;
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

    .inline {
      display: inline-block;
    }
  }
</style>
