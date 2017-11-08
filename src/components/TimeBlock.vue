
<template>
  <section class="time-block">
    <div class="time-block__time">
      <p>{{ time.time_text }}</p>
    </div>

    <div class="time-block__reservations">
      <div class="time-block__card time-block__card--a" v-if="time.rider_names.a && !showSpotAForm">
        <span class="time-block__card-letter time-block__card-letter--a">A</span>
        <p class="time-block__card-name">{{ time.rider_names.a }}</p>
        <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Edit</a>
      </div>
      <div class="time-block__card time-block__card--a" v-else>
        <span class="time-block__card-letter time-block__card-letter--a">A</span>
        <span v-if="!time.rider_names.a && !showSpotAForm">
          <button @click.prevent="showSpotAForm = !showSpotAForm">Reserve Spot A</button>
        </span>

        <span class="time-block__card-input" v-if="showSpotAForm">
          <input placeholder="Ex. John D." maxlength="21" type="text" name="person-a" v-model="time.rider_names.a"/>
          <span>
            <a :data-id="time.id" href="#" @click.prevent="toggleModal($event, 'a')">Reserve</a>
            <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Cancel</a>
          </span>
        </span>
      </div>

      <div class="time-block__card time-block__card--b" v-if="time.rider_names.b && !showSpotBForm">
        <span class="time-block__card-letter time-block__card-letter--b">B</span>
        <p class="time-block__card-name">{{ time.rider_names.b }}</p>
        <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Edit</a>
      </div>
      <div class="time-block__card time-block__card--b" v-else>
        <span class="time-block__card-letter time-block__card-letter--b">B</span>
        <span v-if="!time.rider_names.b && !showSpotBForm">
          <button @click.prevent="showSpotBForm = !showSpotBForm">Reserve Spot B</button>
        </span>

        <span class="time-block__card-input" v-if="showSpotBForm">
          <input placeholder="Ex. John D." maxlength="21" type="text" name="person-b" v-model="time.rider_names.b"/>
          <span>
            <a :data-id="time.id" href="#" @click.prevent="toggleModal($event, 'b')">Reserve</a>
            <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Cancel</a>
          </span>
        </span>
      </div>
    </div>

    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Wait!</h3>

      <p slot="body">Have you filled already filled out the waiver?</p>

      <div class="modal__footer-wrapper" slot="footer">
        <button class="modal__default-button" @click="reserveSpot">Yes</button>

        <a href="https://drive.google.com/open?id=1gptpjNcnKs2RnWnaRwt2rKNLX9yfmZ0eC9wOATMHJBE" target="_blank">Download Waiver</a>

        <p>(Please fill out the waiver and return to HR)</p>
      </div>
    </modal>
  </section>
</template>

<script>
  import Modal from '@/components/Modal'

  export default {
    name: 'TimeBlock',
    props: [
      'time'
    ],
    components: {
      Modal
    },
    data() {
      return {
        personA: '',
        personB: '',
        hasSpotA: false,
        hasSpotB: false,
        showSpotAForm: false,
        showSpotBForm: false,
        showModal: false,
        bike: '',
        event: undefined
      }
    },
    computed: {
      bothSpotsReserved() {
        return this.hasSpotA && this.hasSpotB
      },
      daysRef() {
        return this.$store.getters.daysRef
      },
      key() {
        return this.$store.getters.key
      },
      dayData() {
        return this.$store.state.home.dayData
      }
    },
    methods: {
      toggleModal(e, bike) {
        this.bike = bike
        this.event = e

        if (localStorage.getItem('signedWaiver') !== "true") {
          this.showModal = !this.showModal
        } else {
          this.showModal = false
          this.reserveSpot()
        }
      },
      reserveSpot() {
        if (localStorage.getItem('signedWaiver') !== "true") {
          this.showModal = !this.showModal
        }

        let dayId = this.event.srcElement.dataset.id
        localStorage.setItem('signedWaiver', true)

        if (this.bike === 'a') {
          this.hasSpotA = true
          this.showSpotAForm = !this.showSpotAForm
          this.daysRef.child(this.key + '/times/' + dayId + '/' + 'rider_names/' + this.bike).set(this.time.rider_names.a)
        }

        if (this.bike === 'b') {
          this.hasSpotB = true
          this.showSpotBForm = !this.showSpotBForm
          this.daysRef.child(this.key + '/times/' + dayId + '/' + 'rider_names/' + this.bike).set(this.time.rider_names.b)
        }

        this.daysRef.child(this.key + '/contains_reservations/').set(true)
      },
    }
  }
</script>

<style lang="scss">
  .time-block {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    &__time {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #515458;
      font-weight: bold;
      align-self: flex-start;
    }

    &__reservations {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;

      @media screen and (min-width: 768px) {
        max-width: 1000px;
      }
    }

    &__card {
      flex-basis: 100%;
      height: 100%;
      padding: 10px 15px;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-radius: 10px;
      position: relative;
      margin-bottom: 1rem;

      @media screen and (min-width: 768px) {
        flex-basis: 45%;
        margin-bottom: 0;
      }

      input {
        border: 1px solid #edeff5;
        height: 25px;
        padding-left: 10px;
      }

      a {
        text-decoration: none;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 14px;
        margin-top: 3px;
      }

      button {
        padding: 5px;
        cursor: pointer;
        background: transparent;
        font-size: 15px;
      }

      &--a {
        a {
          color: #ef4f78;
        }

        button {
          border: 1px solid #ef4f78;
          color: #ef4f78;
        }
      }

      &--b {
        a {
          color: #558de1;
        }

        button {
          border: 1px solid #558de1;
          color: #558de1;
        }
      }
    }

    &__card-name {
      font-size: 20px;
      font-weight: bold;
    }

    &__card-letter {
      border-radius: 50%;
      font-size: 12px;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      position: relative;
      top: 10px;

      &:after {
        content: url('../assets/bike.svg');
        position: absolute;
        height: 25px;
        width: 25px;
        top: -20px;
        left: 5px;
      }

      &--a {
        background: #ef4f78;
      }

      &--b {
        background: #558de1;
      }
    }

    &__card-input {
      display: flex;
      flex-direction: column;
      flex-basis: 50%;
    }
  }
</style>
