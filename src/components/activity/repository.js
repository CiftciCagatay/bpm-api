const repository = Activity => {
  const getActivities = props => {
    let query = {}
    const { start, end, userId, attending, waitingForResponse } = props

    if (start) query.start = { $gte: start }

    if (end) query.end = { $lte: end }

    if (userId) {
      query.participants = { $elemMatch: { _id: userId } }

      if (attending)
        query.participants.$elemMatch.attending = attending == 'true'

      if (waitingForResponse)
        query.participants.$elemMatch.waitingForResponse =
          waitingForResponse == 'true'
    }

    return Activity.find(query)
  }

  const createActivity = props => {
    const activity = new Activity({ ...props, createdAt: new Date() })
    return activity.save()
  }

  const updateActivity = (_id, props) => {
    return Activity.findOneAndUpdate(
      { _id },
      { ...props, updatedAt: new Date() }
    )
  }

  const updateAttendingStatus = (activityId, userId, attending) => {
    return Activity.findOneAndUpdate(
      { _id: activityId, 'participants._id': userId },
      {
        $set: {
          'participants.$.attending': attending,
          'participants.$.waitingForResponse': false
        }
      }
    )
  }

  const addParticipants = (activityId, participants) => {
    return Activity.findOneAndUpdate(
      { _id: activityId },
      {
        $push: { participants: { $each: participants } }
      }
    )
  }

  const removeParticipants = (activityId, userIds) => {
    return Activity.findOneAndUpdate(
      { _id: activityId },
      { $pull: { participants: { _id: { $in: userIds } } } },
      { multi: true }
    )
  }

  const removeActivity = _id => {
    return Activity.findOneAndDelete({ _id })
  }

  return {
    getActivities,
    createActivity,
    updateActivity,
    updateAttendingStatus,
    addParticipants,
    removeParticipants,
    removeActivity
  }
}

module.exports = model => repository(model)
