<template>
  <div class="welcome">

    <div class="welcome__logo-container">
      <img src="../assets/envoy-logo.png" alt="Envoy Logo" class="welcome__logo"/>

      <img src="../assets/bike-large.svg" alt="Bike Logo" class="welcome__bike"/>
    </div>

    <div class="welcome__actions">
      <!-- <span class="welcome__actions-holder welcome__actions-holder--desktop">
        <a class="triangle triangle--previous"
             href="#"
             v-for="(day, index) in datePickerDays"
             v-if="day.isSelected && !day.isDisabled"
             :key="day.timestamp"
             @click.prevent="getPrevious(datePickerDays[index])">Previous Day</a>
      </span> -->

      <h2>Schedule for {{ formatToday(today) }}</h2>

      <!-- <span style="display: flex;">
        <span class=" welcome__actions-holder--mobile">
          <a class="triangle triangle--previous"
             href="#"
             v-for="(day, index) in datePickerDays"
             v-if="day.isSelected && !day.isDisabled"
             :key="day.timestamp"
             @click.prevent="getPrevious(datePickerDays[index - 1])">Previous Day</a>
        </span>

        <span class="welcome__actions-holder">
          <a class="triangle triangle--next"
             href="#"
             v-for="(day, index) in datePickerDays"
             v-if="day.isSelected && !day.isDisabled"
             :key="day.timestamp"
             @click.prevent="getNext(datePickerDays[index + 1])">Next Day</a>
        </span>
      </span> -->
    </div>

    <br><br>

    <datepicker :inline="true" :value="date" full-month-name="true" v-on:selected="getDate" :disabled="disabled" placeholder="Pick A Day In The Next Week..." input-class="welcome__datepicker" id="welcome__datepicker"></datepicker>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker';

  let d = new Date()
  let yesterday = new Date(d.setDate(d.getDate()))
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
    data () {
      return {
        msg: '',
        date: todaysDate,
        disabled: {
          to: yesterday,
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
      getDate(selectedDate) {
        let self = this
        let currentDate = new Date(selectedDate)
        let year = currentDate.getFullYear()
        let month = currentDate.getMonth() + 1
        let day = currentDate.getDate()

        let isWeekend = (day == 6) || (day == 0)

        if (isWeekend) {
          day += 2
        }

        if (day < 10) {
          day = `0${day}`
        }

        let newDay = `${month}/${day}/${year}`

        this.$store.dispatch('setToday', newDay)
        this.date = new Date(selectedDate)

        let emptyDayData = require('../data/day')
        emptyDayData.day = newDay

        this.daysRef.orderByChild('day')
          .equalTo(newDay)
          .on('value', snapshot => {
            let val = snapshot.val()
            if (val) {
              self.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
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
        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        let today = new Date(val)
        let year = today.getFullYear()
        let month = today.getUTCMonth()
        let day = today.getDay()
        let dayNumeric = today.getDate()

        if (dayNumeric < 10) {
          dayNumeric = `0${dayNumeric}`
        }

        return `${days[day]}, ${months[month]} ${dayNumeric}th`
      }
    },
  }
</script>

<style lang="scss">
  @import '../styles/main';

  .welcome {
    margin-bottom: 3rem;

    @media screen and (min-width: 480px) {
      margin-bottom: 0;
    }

    h1 {
      color: #eb4e3b;
      font-size: 50px;
    }

    h1, h2 {
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

    &__actions-holder {
      display: block;
      min-width: 97px;

      &--desktop {
        display: none;

        @media screen and (min-width: 480px) {
          display: block;
        }
      }

      &--mobile {
        display: block;

        @media screen and (min-width: 480px) {
          display: none;
        }
      }
    }

    .triangle {
      &--previous {
        &:after {
          content: '';
          position: absolute;
          border-right: solid 8px #eb4e3b;
          border-bottom: solid 8px transparent;
          border-top: solid 8px transparent;
          left: -20px;
          top: 3px;
        }
      }

      &--next {
        &:after {
          content: '';
          position: absolute;
          border-left: solid 8px #eb4e3b;
          border-bottom: solid 8px transparent;
          border-top: solid 8px transparent;
          right: -20px;
          top: 3px;
        }
      }
    }

    &__logo-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-self: center;
      width: 20%;
      height: 40px;
      margin: 2rem auto;
      margin-top: 6rem;

      img:first-child {
        margin-bottom: 1rem;
      }

      @media screen and (min-width: 480px) {
        flex-direction: row;

        img:first-child {
          margin-bottom: 0;
        }
      }
    }

    &__logo,
    &__bike {
      max-width: 100%;
      width: 120px;
    }
  }
</style>
