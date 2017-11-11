
<template>
  <section class="time-block">
    <div class="time-block__time">
      <p>{{ time.time_text }}</p>
    </div>

    <div class="time-block__reservations" :class="{ disabled: isDisabled }">
      <!-- Card A -->
      <div class="time-block__card time-block__card--a" v-if="time.rider_names.a && !showSpotAForm">
        <span class="time-block__card-letter time-block__card-letter--a">1</span>
        <p class="time-block__card-name">{{ time.rider_names.a }}</p>
        <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Edit</a>
      </div>

      <!-- Card A -->
      <div class="time-block__card time-block__card--a" v-else>
        <span class="time-block__card-letter time-block__card-letter--a">1</span>
        <span v-if="!time.rider_names.a && !showSpotAForm">
          <button @click.prevent="showSpotAForm = !showSpotAForm">Reserve Bike 1</button>
        </span>

        <span class="time-block__card-input" v-if="showSpotAForm">
          <input placeholder="Ex. John D." maxlength="21" type="text" name="person-a" v-model="usersName"/>
          <span>
            <a :data-id="time.id" href="#" @click.prevent="deleteSpot($event, 'a')" v-if="hasSpotA">Delete</a>
            <a :data-id="time.id" href="#" @click.prevent="toggleModal($event, 'a')" v-else>Reserve</a>
            <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Cancel</a>
          </span>
        </span>
      </div>

      <!-- Card B -->
      <div class="time-block__card time-block__card--b" v-if="time.rider_names.b && !showSpotBForm">
        <span class="time-block__card-letter time-block__card-letter--b">2</span>
        <p class="time-block__card-name">{{ time.rider_names.b }}</p>
        <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Edit</a>
      </div>

      <!-- Card B -->
      <div class="time-block__card time-block__card--b" v-else>
        <span class="time-block__card-letter time-block__card-letter--b">2</span>
        <span v-if="!time.rider_names.b && !showSpotBForm">
          <button @click.prevent="showSpotBForm = !showSpotBForm">Reserve Bike 2</button>
        </span>

        <span class="time-block__card-input" v-if="showSpotBForm">
          <input placeholder="Ex. John D." maxlength="21" type="text" name="person-b" v-model="usersName"/>
          <span>
            <a :data-id="time.id" href="#" @click.prevent="deleteSpot($event, 'b')" v-if="hasSpotB">Delete</a>
            <a :data-id="time.id" href="#" @click.prevent="toggleModal($event, 'b')" v-else>Reserve</a>
            <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Cancel</a>
          </span>
        </span>
      </div>
    </div>

    <!-- Modal -->
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Wait!</h3>

      <a slot="close" href="#" class="modal__close" @click="showModal = false"></a>

      <p slot="body">Have you already filled out the waiver? This is <span class="orange">required</span> by our HR department!</p>

      <div class="modal__footer-wrapper" slot="footer">
        <button class="modal__default-button" @click="reserveSpot">Yes</button>

        <a href="https://drive.google.com/open?id=1gptpjNcnKs2RnWnaRwt2rKNLX9yfmZ0eC9wOATMHJBE" target="_blank">No? Download Waiver</a>

        <p>(Please fill out the waiver and return it to HR)</p>
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
        hasSpotA: false,
        hasSpotB: false,
        showSpotAForm: false,
        showSpotBForm: false,
        showModal: false,
        bike: '',
        event: undefined,
        usersName: this.$store.getters.user.displayName
      }
    },
    computed: {
      id () {
        return this.time.id
      },
      daysRef() {
        return this.$store.getters.daysRef
      },
      key() {
        return this.$store.getters.key
      },
      dayData() {
        return this.$store.state.home.dayData
      },
      isDisabled() {
        let now = new Date()
        let future = new Date(this.dayData.day)
        let hour = now.getHours()
        let minutes = now.getMinutes()

        if (minutes < 10) {
          minutes = `0${minutes}`
        }

        if (this.time.minutes_end === 0) {
          this.time.minutes_end = `0${this.time.minutes_end}`
        }

        return (parseInt(`${this.time.hour_end}${this.time.minutes_end}`) < parseInt(`${hour}${minutes}`)) && (future < now)
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
          this.showSpotAForm = false
          this.daysRef.child(`${this.key}/times/${dayId}/rider_names/${this.bike}`).set(this.usersName)
        }

        if (this.bike === 'b') {
          this.hasSpotB = true
          this.showSpotBForm = false
          this.daysRef.child(`${this.key}/times/${dayId}/rider_names/${this.bike}`).set(this.usersName)
        }

        this.daysRef.child(`${this.key}/contains_reservations/`).set(true)
      },
      deleteSpot(e, bike) {
        let dayId = e.srcElement.dataset.id
        this.usersName = ''

        if (bike === 'a') {
          this.hasSpotA = false
          this.showSpotAForm = false
          this.daysRef.child(`${this.key}/times/${dayId}/rider_names/${bike}`).set('')
        }

        if (bike === 'b') {
          this.hasSpotB = false
          this.showSpotBForm = false
          this.daysRef.child(`${this.key}/times/${dayId}/rider_names/${bike}`).set('')
        }
      },
    },
    watch: {
      time (value) {
        if (value) {
          // TODO: Find a solution for this hack. Solves: This component's properties not
          // reseting when we toggle for new dayData and update the TimeBlock component
          this.showSpotAForm = false
          this.showSpotBForm = false
        }
      }
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

      &.disabled {
        pointer-events: none;

        .time-block__card {
          pointer-events: none;
          background-color: #c7c7c7;
          opacity: .6;
        }
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

      a:first-child {
        margin-right: 15px;
      }
    }

    .orange {
      color: #eb4e3b;
      font-style: italic;
    }
  }
</style>
