<template>
  <div class="welcome">
    <h1>ENVOY BIKES</h1>

    <div class="welcome__actions">
      <span class="welcome__actions-holder">
        <a class="triangle triangle--previous" v-if="additional !== 0" href="#" @click.prevent="getPrevious">Previous Day</a>
      </span>
      <h2>Schedule for {{ today }}</h2>
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
      getNext() {
        this.$store.dispatch('setPrevious', this.today)
        let self = this
        let currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
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
        let self = this
        let currentDate = new Date(this.today)
        let dd = currentDate.getDate() - 1
        let ddPrevious = currentDate.getDate() - 2
        let mm = currentDate.getMonth() + 1
        let yyyy = currentDate.getFullYear()

        if (dd < 10) {
          dd = `0${dd}`
        }

        if (ddPrevious < 10) {
          ddPrevious = `0${ddPrevious}`
        }

        if (mm < 10) {
          mm = `0${mm}`
        }

        let previousDay = `${mm}/${dd}/${yyyy}`
        let twoPreviousDays = `${mm}/${ddPrevious}/${yyyy}`

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
      align-items: center
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
