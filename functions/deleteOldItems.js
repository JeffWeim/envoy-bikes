// 1. Old Data Cleanup
admin.initializeApp(functions.config().firebase)

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 172800000 // 48 Hours in milliseconds.

/**
 * This database triggered function will check for child nodes that are older than the
 * cut-off time. Each child needs to have a `timestamp` attribute.
 */
exports.deleteOldItems = functions.database.ref('/days/{pushId}')
  .onWrite(event => {
    if (!event.data.previous.exists()) { // only run once
      const ref = event.data.ref.parent // reference to the items
      const now = Date.now()
      const cutoff = now - CUT_OFF_TIME
      const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff)

      return oldItemsQuery.once('value')
        .then(snapshot => {
          // create a map with all children that need to be removed
          const updates = {}

          snapshot.forEach(child => {
            updates[child.key] = null
          })

          // execute all updates in one go and return the result to end the function
          // return ref.update(updates)
        })
    }
  })
