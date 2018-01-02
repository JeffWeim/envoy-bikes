<template>
  <section class="modal">
    <transition name="modal">
      <div class="modal__mask">
        <div class="modal__wrapper">
          <div class="modal__container">

            <div class="modal__close-wrapper">
              <slot name="close"></slot>
            </div>

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
    name: 'Modal',
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
      position: relative;
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
      width: 100%;
      height: 150px;

      @media screen and (min-width: 480px) {
        width: 60%;
      }
    }

    p {
      margin: 0;
      max-width: 320px;
    }

    a {
      color: #eb4e3b;
      text-decoration: none;
      border: 1px solid #eb4e3b;
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

    &__close {
      position: absolute;
      right: 0;
      z-index: 999;
      top: 1rem;
      width: 25px;
      height: 25px;
      padding: 0 1rem 0 1.5rem;
      border: none  !important;

      &:hover {
        &:after,
        &:before {
          background: #eb4e3b;
        }
      }

      &:after,
      &:before {
        content: "";
        position: absolute;
        top: 18px;
        left: 9px;
        width: 2px;
        height: 22px;
        margin-top: -12px;
        background: #eb4e3b;
        transform: rotate(45deg);
        transition: background 250ms ease;
      }

      &:after {
        left: 0;
        width: 22px;
        height: 2px;
        margin-top: -2px;
      }
    }

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
