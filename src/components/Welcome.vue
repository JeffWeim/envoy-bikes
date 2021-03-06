<template>
  <div class="welcome">
    <div class="welcome__logo-container">
      <img style="max-width: 120px;" src="../assets/envoy-logo.png" alt="Envoy Logo" class="welcome__logo"/>

      <img src="../assets/bike-large.svg" alt="Bike Logo" class="welcome__bike"/>
    </div>

    <div class="welcome__actions">
      <h2>Schedule for {{ formatToday(today) }}</h2>
    </div>

    <br><br>

    <datepicker :inline="true" :value="date" :full-month-name="true" v-on:selected="dateSelected" :disabled="disabled" placeholder="Pick A Day In The Next Week..." input-class="welcome__datepicker" id="welcome__datepicker"></datepicker>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

let d = new Date()
let weekFromNow = new Date(d.setDate(d.getDate() + 7))

let currentDate = new Date()
let year = currentDate.getFullYear()
let month = currentDate.getMonth() + 1
let day = currentDate.getDay()
let date = currentDate.getDate()

if (day === 6) {
  date += 2
}

if (day === 0) {
  date += 1
}

let todaysDate = new Date(`${month}-${date}-${year}`)

export default {
  name: 'Welcome',
  components: {
    Datepicker
  },
  data() {
    return {
      msg: '',
      editName: '',
      date: todaysDate,
      disabled: {
        to: todaysDate,
        from: weekFromNow,
        days: [6, 0]
      }
    }
  },
  computed: {
    daysRef() {
      return this.$store.getters.daysRef
    },
    today() {
      return this.$store.getters.today
    },
    key() {
      return this.$store.getters.key
    }
  },
  methods: {
    dateSelected(selectedDate) {
      let self = this
      let currentDate = new Date(selectedDate)
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth() + 1
      let day = currentDate.getDate()

      let newDay = `${month}/${day}/${year}`

      this.$store.dispatch('setToday', newDay)
      this.date = new Date(selectedDate)

      let emptyDayData = require('../data/day')
      emptyDayData.day = newDay

      this.daysRef
        .orderByChild('day')
        .equalTo(newDay)
        .on('value', snapshot => {
          let val = snapshot.val()
          if (val) {
            self.$store.dispatch('setKey', Object.keys(val)[0])
          }

          if (!val) {
            self.daysRef.push(emptyDayData)
            self.$store.dispatch('setDayData', emptyDayData)
          } else {
            self.$store.dispatch('setDayData', val[self.key])
          }
        })
    },
    formatToday(val) {
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]

      let today = new Date(val)
      let year = today.getFullYear()
      let month = today.getUTCMonth()
      let day = today.getDay()
      let dayNumeric = today.getDate()
      let appendix

      if (dayNumeric >= 4) {
        appendix = 'th'
      }

      if (dayNumeric === 1 || dayNumeric === 21 || dayNumeric === 31) {
        appendix = 'st'
      }

      if (dayNumeric === 2 || dayNumeric === 22) {
        appendix = 'nd'
      }

      if (dayNumeric === 3 || dayNumeric === 23) {
        appendix = 'rd'
      }

      this.$store.dispatch(
        'setTodayString',
        `${days[day]}, ${months[month]} ${dayNumeric}${appendix}`
      )

      return `${days[day]}, ${months[month]} ${dayNumeric}${appendix}`
    }
  }
}
</script>

<style lang="scss">
.welcome {
  margin-bottom: 3rem;

  @media screen and (min-width: 480px) {
    margin-bottom: 0;
  }

  h1 {
    color: #eb4e3b;
    font-size: 50px;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  a {
    color: #eb4e3b;
    text-decoration: none;
    position: relative;
    font-weight: bold;
  }

  &__actions {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    @media screen and (min-width: 480px) {
      flex-direction: row;
    }

    h2 {
      margin-bottom: 0;
    }
  }

  &__logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    margin-top: 6rem;
    max-width: 220px;
    max-height: 100%;

    img:first-child {
      margin-bottom: 1rem;
    }

    @media screen and (min-width: 480px) {
      max-height: 40px;
      flex-direction: row;

      img:first-child {
        margin-bottom: 0;
      }
    }
  }

  &__logo {
    width: 120px;
    margin: 0 auto;
  }

  &__bike {
    max-width: 35%;

    @media screen and (min-width: 480px) {
      max-width: 25%;
      margin-right: 20px;
    }
  }

  &__datepicker {
    width: 100%;
    max-width: 230px;
    border: 1px solid #eb4e3b;
    background: transparent;
    padding: 7px 7px;
    border-radius: 5px;
    color: #eb4e3b;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 15px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
  }

  .vdp-datepicker {
    margin-bottom: 3rem;

    > div {
      display: block;
      margin: 0 auto;
    }

    &__calendar {
      position: absolute;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .vdp-datepicker__calendar {
    width: 100%;
    max-width: 450px;

    .cell:not(.blank):not(.disabled).day:hover {
      border: 1px solid #eb4e3b;
    }

    .cell {
      height: 45px;

      &.selected {
        background: #eb4e3b;

        &:hover {
          background: #eb4e3b;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
