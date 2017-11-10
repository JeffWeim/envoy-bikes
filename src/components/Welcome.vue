<template>
  <div class="welcome">

    <div class="welcome__logo-container">
      <img src="../assets/envoy-logo.png" alt="Envoy Logo" class="welcome__logo"/>

      <img src="../assets/bike-large.svg" alt="Bike Logo" class="welcome__bike"/>
    </div>

    <div class="welcome__actions">
      <span class="welcome__actions-holder welcome__actions-holder--desktop">
        <a class="triangle triangle--previous" v-if="additional !== 0" href="#" @click.prevent="getPrevious">Previous Day</a>
      </span>

      <h2>Schedule for {{ formatToday(today) }}</h2>

      <span style="display: flex;">
        <span class=" welcome__actions-holder--mobile">
          <a class="triangle triangle--previous" v-if="additional !== 0" href="#" @click.prevent="getPrevious">Previous Day</a>
        </span>

        <span class="welcome__actions-holder">
          <a class="triangle triangle--next" v-if="additional < 7" href="#" @click.prevent="getNext">Next Day</a>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data () {
      return {
        msg: '',
        additional: 0
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
      },
      previousDay() {
        return this.$store.getters.previous
      }
    },
    methods: {
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
      },
      getNext() {
        let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        let day = currentDate.getDay() + this.additional
        let isWeekend = (day == 6) || (day == 0)

        if (isWeekend) {
          this.additional += 2
        }

        this.$store.dispatch('setPrevious', this.today)
        let self = this
        let dd = currentDate.getDate() + this.additional
        let mm = currentDate.getMonth() + 1
        let yyyy = currentDate.getFullYear()

        if (dd < 10) {
          dd = `0${dd}`
        }

        if (mm < 10) {
          mm = `0${mm}`
        }

        let tomorrow = `${mm}/${dd}/${yyyy}`
        let emptyDayData = require('../data/day')
        emptyDayData.day = tomorrow

        this.$store.dispatch('setToday', tomorrow)

        this.daysRef.orderByChild('day')
          .equalTo(tomorrow)
          .on('value', snapshot => {
            let val = snapshot.val()
            if (val) {
              this.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
            }

            if (!val) {
              this.daysRef.push(emptyDayData)
              this.$store.dispatch('setDayData', emptyDayData)
            } else {
              self.$store.dispatch('setDayData', val[self.key])
            }
          })

        this.additional += 1
      },
      getPrevious() {
        let currentDate = new Date(this.today)
        let prevDay = currentDate.getDay() - 1
        let isWeekend = (prevDay == 6) || (prevDay == 0)
        let buffer1 = 1
        let buffer2 = 2

        if (isWeekend) {
          buffer1 += 2
          buffer2 += 2
          this.additional -= 2
        }

        let self = this
        let dd = currentDate.getDate() - buffer1
        let ddTwoPrevious = currentDate.getDate() - buffer2
        let mm = currentDate.getMonth() + 1
        let yyyy = currentDate.getFullYear()

        if (dd < 10) {
          dd = `0${dd}`
        }

        if (ddTwoPrevious < 10) {
          ddTwoPrevious = `0${ddTwoPrevious}`
        }

        if (mm < 10) {
          mm = `0${mm}`
        }

        let previousDay = `${mm}/${dd}/${yyyy}`
        let twoPreviousDays = `${mm}/${ddTwoPrevious}/${yyyy}`

        this.$store.dispatch('setToday', previousDay)
        this.$store.dispatch('setPrevious', twoPreviousDays)

        this.daysRef.orderByChild('day')
          .equalTo(previousDay)
          .on('value', snapshot => {
            let val = snapshot.val()

            if (val) {
              this.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
              self.$store.dispatch('setDayData', val[self.key])
            }
          })

        this.additional -= 1
      }
    }
  }
</script>

<style scoped lang="scss">
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

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
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

      @media screen and (min-width: 480px) {
        flex-direction: row;
      }
    }

    &__logo,
    &__bike {
      max-width: 100%;
      width: 120px;
    }
  }
</style>
