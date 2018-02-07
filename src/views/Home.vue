<template>
  <section class="home">
    <Welcome></Welcome>
    <TimeBlock :key="time.id" v-for="time in dayData.times" :time="time"></TimeBlock>
  </section>
</template>

<script>
  import Welcome from '@/components/Welcome'
  import TimeBlock from '@/components/TimeBlock'
  import firebase from 'firebase'

  export default {
    name: 'HomeView',
    components: {
      Welcome,
      TimeBlock,
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
      },
      daysRef() {
        return this.$store.getters.daysRef
      },
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

        let today = `${month}/${date}/${year}`

        this.$store.dispatch('setToday', today)

        let emptyDayData = require('../data/day')
        emptyDayData.day = today

        this.daysRef.orderByChild('day')
          .equalTo(today)
          .on('value', snapshot => {
            let val = snapshot.val()

            if (val) {
              self.$store.dispatch('setKey', Object.keys(snapshot.val())[0])
            }

            if (!val) {
              this.daysRef.push(emptyDayData)
              self.$store.dispatch('setDayData', emptyDayData)
            } else {
              self.$store.dispatch('setDayData', val[self.key])
            }
          })
      },
      checkSession(u) {
        let user = u
        let credential
        let lastLogin = new Date(user.metadata.lastSignInTime)
        let today = new Date()

        let diff = Math.abs(lastLogin.getTime() - today.getTime())
        let diffDays = diff / (1000 * 60 * 60 * 24)

        // Automatically log people out after a week
        if (diffDays >= 7) {
          firebase.auth().signOut()
            .then(() => {
              this.$store.dispatch('setUser', null)
              localStorage.removeItem('token')
              this.$router.go('/envoy-bikes/login')
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    created() {
      this.getData()
    },
    beforeCreate() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.$store.dispatch('setUser', user)
          this.checkSession(user)
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
