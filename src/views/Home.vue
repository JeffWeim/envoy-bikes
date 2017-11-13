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
        let self = this
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

        let today = `${month}-${date}-${year}`

        this.$store.dispatch('setToday', today)
        this.$store.dispatch('setPrevious', today)

        let emptyDayData = require('../data/day')
        emptyDayData.day = today

        daysRef.orderByChild('day')
          .equalTo(today)
          .on('value', snapshot => {
            let val = snapshot.val()

            if (val) {
              self.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
            }

            if (!val) {
              daysRef.push(emptyDayData)
              self.$store.dispatch('setDayData', emptyDayData)
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
