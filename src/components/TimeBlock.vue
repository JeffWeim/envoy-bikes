
<template>
  <section class="time-block">
    <div class="time-block__time">
      <p>{{ time.time_text }}</p>
    </div>

    <div class="time-block__reservations" :class="{ disabled: isDisabled }">
      <!-- Card A -->
      <div class="time-block__card time-block__card--a">
        <span v-if="!time.rider_names.a.name" class="time-block__card-letter time-block__card-letter--a">1</span>
        <span v-else class="time-block__card-img-container"><img class="time-block__card-img" :src="userPhoto" alt="User Photo" /></span>

        <p class="time-block__card-name">{{ time.rider_names.a.name }}</p>

        <span v-if="!time.rider_names.a.name">
          <button :data-id="time.id" @click.prevent="toggleModal($event, 'a')">Reserve Bike 1</button>
        </span>
        <span v-else>
          <p class="time-block__card-reserved--a" v-if="time.rider_names.a.uid !== userUid">Reserved</p>
          <a :data-id="time.id" href="#" @click.prevent="deleteSpot($event, 'a')" v-else>Delete <br> Reservation</a>
        </span>
      </div>

      <!-- Card B -->
      <div class="time-block__card time-block__card--b">
        <span v-if="!time.rider_names.b.name" class="time-block__card-letter time-block__card-letter--b">2</span>
        <span v-else class="time-block__card-img-container"><img class="time-block__card-img" :src="userPhoto" alt="User Photo" /></span>

        <p class="time-block__card-name">{{ time.rider_names.b.name }}</p>

        <span v-if="!time.rider_names.b.name">
          <button :data-id="time.id" @click.prevent="toggleModal($event, 'b')">Reserve Bike 2</button>
        </span>
        <span v-else>
          <p class="time-block__card-reserved--b" v-if="time.rider_names.b.uid !== userUid">Reserved</p>
          <a :data-id="time.id" href="#" @click.prevent="deleteSpot($event, 'b')" v-else>Delete <br> Reservation</a>
        </span>
      </div>
    </div>

    <span class="time-block__calendar-link" :class="{ 'show': showCalendarLink }">
      <AddToCalendar title="Bike Reservation" location="34 Tesla, Irvine, CA 92618" :start="new Date(start)" :end="new Date(end)" details="Bike">
      </AddToCalendar>
    </span>

    <!-- Modal -->
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Wait!</h3>

      <a slot="close" href="#" class="modal__close" @click.prevent="showModal = false"></a>

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
const Modal = () => import('@/components/Modal')
const AddToCalendar = () => import('@/components/AddToCalendar')

export default {
  name: 'TimeBlock',
  props: ['time'],
  components: {
    Modal,
    AddToCalendar
  },
  data() {
    return {
      showModal: false,
      bike: '',
      event: undefined,
      userUid: this.$store.getters.user.uid,
      usersName: this.$store.getters.user.displayName,
      userPhoto: this.time.rider_names.a.photo || this.$store.getters.user.photoURL
    }
  },
  computed: {
    showCalendarLink() {
      return (
        (this.time.rider_names.b.uid === this.userUid ||
          this.time.rider_names.a.uid === this.userUid) &&
        (this.time.rider_names.b || this.time.rider_names.a)
      )
    },
    start() {
      return `${this.dayData.day} ${this.time.hour_begin}:${this.time.minutes_begin}`
    },
    end() {
      return `${this.dayData.day} ${this.time.hour_end}:${this.time.minutes_end}`
    },
    id() {
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

      return (
        parseInt(`${this.time.hour_end}${this.time.minutes_end}`) < parseInt(`${hour}${minutes}`) &&
        future < now
      )
    }
  },
  methods: {
    toggleModal(e, bike) {
      this.bike = bike
      this.event = e

      if (localStorage.getItem('signedWaiver') !== 'true') {
        this.showModal = !this.showModal
      } else {
        this.showModal = false
        this.reserveSpot()
      }
    },
    reserveSpot() {
      if (localStorage.getItem('signedWaiver') !== 'true') {
        this.showModal = !this.showModal
      }

      let timeBlockId = this.event.srcElement.dataset.id
      localStorage.setItem('signedWaiver', true)

      this.daysRef
        .child(`${this.key}/times/${timeBlockId}/rider_names/${this.bike}/name`)
        .set(this.$store.getters.user.displayName)
      this.daysRef
        .child(`${this.key}/times/${timeBlockId}/rider_names/${this.bike}/uid`)
        .set(this.userUid)
      this.daysRef
        .child(`${this.key}/times/${timeBlockId}/rider_names/${this.bike}/photo`)
        .set(this.userPhoto)
      this.daysRef.child(`${this.key}/contains_reservations/`).set(true)
    },
    deleteSpot(e, bike) {
      let timeBlockId = e.srcElement.dataset.id
      this.usersName = ''

      this.daysRef.child(`${this.key}/times/${timeBlockId}/rider_names/${bike}/name`).set('')
      this.daysRef.child(`${this.key}/times/${timeBlockId}/rider_names/${bike}/uid`).set('')
      this.daysRef.child(`${this.key}/times/${timeBlockId}/rider_names/${bike}/photo`).set('')
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
  margin-bottom: 30px;
  position: relative;

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
    z-index: 10;

    @media screen and (min-width: 768px) {
      max-width: 1000px;
    }

    &.disabled {
      pointer-events: none;

      .time-block__card {
        pointer-events: none;
        background-color: #c7c7c7;
        opacity: 0.6;
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
    margin: 0 10px;
  }

  &__card-img-container {
    position: relative;
    top: 10px;

    &:after {
      content: url('../assets/bike.svg');
      position: absolute;
      height: 25px;
      width: 25px;
      top: -18px;
      left: 5px;
    }
  }

  &__card-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    position: relative;
    top: 3px;
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

  &__card-reserved {
    &--a {
      color: #ef4f78;
    }

    &--b {
      color: #558de1;
    }
  }

  &__calendar-link {
    position: absolute;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 350ms ease;
    bottom: 0;
    z-index: 1;

    &.show {
      opacity: 1;
      transform: translateY(30px);
    }
  }

  .orange {
    color: #eb4e3b;
    font-style: italic;
  }
}
</style>
