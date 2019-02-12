const getActivities = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const { user } = res.locals

  activities
    .getActivities({ userId: user._id, ...req.query })
    .then(activities => res.status(200).json({ activities }))
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const createActivity = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const { user } = res.locals
  const props = req.body

  activities
    .createActivity({ ...props, createdBy: user })
    .then(result => res.status(200).json({ result }))
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const updateActivity = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const { user } = res.locals
  const props = req.body
  const activityId = req.params.id

  activities
    .updateActivity(activityId, { ...props, updatedBy: user })
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const updateAttendingStatus = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const { user } = res.locals
  const { attending } = req.body
  const activityId = req.params.id

  activities
    .updateAttendingStatus(activityId, user._id, attending)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const addParticipants = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const { users } = req.body
  const activityId = req.params.id

  activities
    .addParticipants(activityId, users)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const removeParticipants = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const activityId = req.params.id
  const userIds = JSON.parse(req.params.userIds)

  activities
    .removeParticipants(activityId, userIds)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

const removeActivity = (req, res) => {
  const {
    repos: { activities }
  } = res.locals

  const activityId = req.params.id

  activities
    .removeActivity(activityId)
    .then(() => res.status(200).send())
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  updateAttendingStatus,
  addParticipants,
  removeParticipants,
  removeActivity
}
