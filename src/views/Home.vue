<template>
  <section class="home">
    <welcome></welcome>
    <TimeBlock :key="time.id" v-for="time in dayData.times" :time="time"></TimeBlock>
  </section>
</template>

<script>
  import Welcome from '@/components/Welcome'
  import TimeBlock from '@/components/TimeBlock'
  import firebase from 'firebase'

  let config = {
    apiKey: "AIzaSyBjWk3yrbx8H0vKuRm_lbMseFp8ZwqKsjo",
    authDomain: "envoy-bikes.firebaseapp.com",
    databaseURL: "https://envoy-bikes.firebaseio.com",
    projectId: "envoy-bikes",
    storageBucket: "envoy-bikes.appspot.com",
    messagingSenderId: "411868926692"
  }

  let app = firebase.initializeApp(config)
  let db = app.database()
  let daysRef = db.ref('days')
  let userRef = db.ref('users')

  export default {
    name: 'HomeView',
    components: {
      Welcome,
      TimeBlock,
    },
    firebase: {
      days: db.ref('days'),
      users: db.ref('users')
    },
    computed: {
      dayData() {
        return this.$store.getters.dayData
      },
      key() {
        return this.$store.getters.key
      },
      today() {
        return this.$store.getters.today
      }
    },
    methods: {
      getData() {
        let today = new Date()
        var day = today.getDay();
        var isWeekend = (day == 6) || (day == 0);
        let dd

        if (isWeekend) {
          dd = today.getDate() + 2
        } else {
          dd = today.getDate()
        }

        let self = this
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()

        if (dd < 10) {
          dd = `0${dd}`
        }

        if (mm < 10) {
          mm = `0${mm}`
        }

        today = `${mm}/${dd}/${yyyy}`
        this.$store.dispatch('setToday', today)
        this.$store.dispatch('setPrevious', today)

        let emptyDayData = require('../data/day')
        emptyDayData.day = today

        daysRef.orderByChild('day')
          .equalTo(today)
          .on('value', snapshot => {
            let val = snapshot.val()

            if (val) {
              this.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
            }

            if (!val) {
              daysRef.push(emptyDayData)
              this.$store.dispatch('setDayData', emptyDayData)
            } else {
              self.$store.dispatch('setDayData', val[self.key])
            }
          })
      },
    },
    created() {
      this.$store.dispatch('setDaysReference', daysRef)
      this.$store.dispatch('setUsersReference', userRef)
      this.getData()
    },
    beforeCreate() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('setUser', user)
        }
      })
    },
  }
</script>

<style lanf="scss">
  .home {
    width: 100%;
    max-width: 990px;
    margin: 0 auto;
    text-align: center;
    display: block;
    margin-bottom: 5rem;
    position: relative;
  }
</style>
