<template>
  <section class="home">

    <welcome :date="today"></welcome>

    <TimeBlock :key="time.id" v-for="time in dayData.times" :time="time"></TimeBlock>

  </section>
</template>

<script>
  import Welcome from '@/components/Welcome'
  import TimeBlock from '@/components/TimeBlock'
  import Firebase from 'firebase'

  let config = {
    apiKey: "AIzaSyBjWk3yrbx8H0vKuRm_lbMseFp8ZwqKsjo",
    authDomain: "envoy-bikes.firebaseapp.com",
    databaseURL: "https://envoy-bikes.firebaseio.com",
    projectId: "envoy-bikes",
    storageBucket: "envoy-bikes.appspot.com",
    messagingSenderId: "411868926692"
  }

  let app = Firebase.initializeApp(config)
  let db = app.database()
  let daysRef = db.ref('days')

  export default {
    name: 'HomeView',
    components: {
      Welcome,
      TimeBlock,
    },
    firebase: {
      days: db.ref('days')
    },
    data() {
      return {
        today: ''
      }
    },
    computed: {
      dayData() {
        return this.$store.state.home.dayData
      },
      key() {
        return this.$store.getters.key
      }
    },
    methods: {
      getData() {
        let self = this
        let today = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()

        if (dd < 10) {
          dd = `0${dd}`
        }

        if (mm < 10) {
          mm = `0${mm}`
        }

        today = `${mm}/${dd}/${yyyy}`
        this.today = today

        let emptyDayData = require('../data/day')
        emptyDayData.day = today

        this.$firebaseRefs.days.orderByChild('day')
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
      }
    },
    created() {
      this.getData()

      this.$store.dispatch('setDaysReference', this.$firebaseRefs.days)
    }
  }
</script>

<style scoped></style>
