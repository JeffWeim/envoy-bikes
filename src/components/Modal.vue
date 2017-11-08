<template>
  <section class="modal">
    <transition name="modal">
      <div class="modal__mask">
        <div class="modal__wrapper">
          <div class="modal__container">

            <div class="modal__header">
              <slot name="header"></slot>
            </div>

            <div class="modal__body">
              <slot name="body"></slot>
            </div>

            <div class="modal__footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'Modal'
  }
</script>

<style lang="scss">
  .modal {
    &__mask {
      position: fixed;
      z-index: 9998;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: table;
      transition: opacity .3s ease;
    }

    &__wrapper {
      display: table-cell;
      vertical-align: middle;
    }

    &__container {
      max-width: 600px;
      width: 100%;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;
      height: 100%;
      max-height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    &__header  {
      h3 {
        margin-top: 0;
        color: #eb4e3b;
      }
    }

    &__body {
      margin: 20px 0;
    }

    &__default-button {
      float: right;
    }

    &__footer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    &__footer-wrapper {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      width: 60%;
      height: 150px;
    }

    p {
      margin: 0;
    }

    a {
      color: #eb4e3b;
      text-decoration: none;
      border: 1px solid #eb4e3b;
      border-radius: 5px;
      padding: 5px;
    }

    button {
      padding: 5px;
      cursor: pointer;
      background: transparent;
      font-size: 15px;
      border: 1px solid #eb4e3b;
      color: #eb4e3b;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */
    .modal-enter {
      opacity: 0;
    }

    .modal-leave-active {
      opacity: 0;
    }

    .modal-enter .modal__container,
    .modal-leave-active .modal__container {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }

  }
</style>
