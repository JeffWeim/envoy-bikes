
<template>
  <table>
    <tr>
      <td>{{ time.time_text }}</td>
    </tr>

    <tr>
      <td v-if="time.rider_names.a && !showSpotAForm">
        {{ time.rider_names.a }}
        <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Edit</a>
      </td>
      <td v-else>
        <span v-if="!time.rider_names.a && !showSpotAForm">
          <button @click.prevent="showSpotAForm = !showSpotAForm">Reserve Spot A</button>
        </span>

        <span v-if="showSpotAForm">
          <input type="text" name="person-a" v-model="personA"/><br>
          <a :data-id="time.id" href="#" @click.prevent="reserveSpot($event, 'a')">Reserve</a>
          <a href="#" @click.prevent="showSpotAForm = !showSpotAForm">Cancel</a>
        </span>
      </td>

      <td v-if="time.rider_names.b && !showSpotBForm">
        {{ time.rider_names.b }}
        <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Edit</a>
      </td>
      <td v-else>
        <span v-if="!time.rider_names.b && !showSpotBForm">
          <button @click.prevent="showSpotBForm = !showSpotBForm">Reserve Spot B</button>
        </span>

        <span v-if="showSpotBForm">
          <input type="text" name="person-b" v-model="personB"/><br>
          <a :data-id="time.id" href="#" @click.prevent="reserveSpot($event, 'b')">Reserve</a>
          <a href="#" @click.prevent="showSpotBForm = !showSpotBForm">Cancel</a>
        </span>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'TimeBlock',
    props: [
      'time'
    ],
    data() {
      return {
        personA: '',
        personB: '',
        hasSpotA: false,
        hasSpotB: false,
        showSpotAForm: false,
        showSpotBForm: false,
      }
    },
    computed: {
      bothSpotsReserved() {
        return (this.hasSpotA && this.hasSpotB) || this.time.reserved
      },
      daysRef() {
        return this.$store.getters.daysRef
      },
      key() {
        return this.$store.getters.key
      },
      dayData() {
        return this.$store.state.home.dayData
      }
    },
    methods: {
      reserveSpot(e, spot) {
        let dayId = e.srcElement.dataset.id

        if (spot === 'a') {
          this.hasSpotA = true
          this.showSpotAForm = !this.showSpotAForm
          this.daysRef.child(this.key + '/times/' + dayId + '/' + 'rider_names/' + spot).set(this.personA)
        }

        if (spot === 'b') {
          this.hasSpotB = true
          this.showSpotBForm = !this.showSpotBForm
          this.daysRef.child(this.key + '/times/' + dayId + '/' + 'rider_names/' + spot).set(this.personB)
        }

        if (this.bothSpotsReserved) {
          this.daysRef.child(this.key + '/times/' + dayId + '/' + 'reserved/').set(true)
        }
      },
    }
  }
</script>

<style lang="scss">
  table {
    td {
      min-width: 250px;
      padding: 7px 0;
    }
  }
</style>
