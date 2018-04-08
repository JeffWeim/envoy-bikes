<template>
  <section style="display: inline-flex; margin-left: 10px; align-items: center;">
    <img src="https://firebasestorage.googleapis.com/v0/b/envoy-bikes.appspot.com/o/google-calendar.png?alt=media&token=8f1ac91c-dc8c-4e46-b30f-4f6e3a4f035b" alt="Google Calendar" height="20" width="20" />
    <a style="text-decoration: none; color: #eb4e3b; margin-top: 5px;" :href="calendarUrl(calendars.google)" :class="calendarClass" target="_blank">Add to Google Calendar</a>
  </section>
</template>


<script>
export default {
  name: 'AddToCalendar',
  props: {
    /**
     * Event title.
     * @var string
     */
    title: {
      type: String,
      default: ''
    },

    /**
     * Event location.
     * @var string
     */
    location: {
      type: String,
      default: ''
    },

    /**
     * Event details.
     * @var string
     */
    details: {
      type: String,
      default: ''
    },

    /**
     * Event start.
     * @var date
     */
    start: {
      type: Date,
      default: null
    },

    /**
     * Event end.
     * @var date
     */
    end: {
      type: Date,
      default: null
    }
  },
  data() {
    return {
      /**
       * Available calendars.
       * @param object
       */
      calendars: {
        google: {
          url: 'http://www.google.com/calendar/event?action=TEMPLATE&trp=false',
          parameters(title, location, details, start, end) {
            const parameters = {
              text: title,
              location: location,
              details: details
            }

            if (start && end) {
              parameters.dates = `${start}/${end}`
            }

            return parameters
          }
        }
      }
    }
  },
  methods: {
    /**
     * Returns generated calendar url.
     *
     * @param calendar.
     */
    calendarUrl(calendar) {
      let url = this.calendars.google.url
      const parameters = this.calendars.google.parameters(
        this.formatString(this.title),
        this.formatString(this.location),
        this.formatString(this.details),
        this.formatDate(this.start),
        this.formatDate(this.end)
      )

      for (const key in parameters) {
        if (parameters.hasOwnProperty(key) && parameters[key]) {
          url += `&${key}=${parameters[key]}`
        }
      }

      return url
    },

    formatString(string) {
      return encodeURIComponent(string).replace(/%20/g, '+')
    },

    formatDate(date) {
      return date ? date.toISOString().replace(/-|:|\.\d+/g, '') : null
    }
  },
  computed: {
    calendarClass() {
      return ['vue-add-to-calendar', `google-calendar`]
    }
  }
}
</script>
