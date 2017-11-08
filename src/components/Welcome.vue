<template>
  <div class="welcome">
    <h1>ENVOY BIKES</h1>

    <div class="welcome__actions">
      <span class="welcome__actions-holder">
        <a class="triangle triangle--previous" v-if="additional !== 0" href="#" @click.prevent="getPrevious">Previous Day</a>
      </span>
      <h2>Schedule for {{ formatToday(today) }}</h2>
      <a class="triangle triangle--next" href="#" @click.prevent="getNext">Next Day</a>
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
        let day = currentDate.getDay() + this.additional
        let isWeekend = (day == 6) || (day == 0)
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

        let emptyDayData = require('../data/day')
        emptyDayData.day = previousDay

        this.daysRef.orderByChild('day')
          .equalTo(this.previousDay)
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
  }
</style>
