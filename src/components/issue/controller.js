const { channel } = require('../../amqp')
const {
  amqp: {
    queues: { bpmQueue },
    actions: { ISSUE_CREATED, ISSUE_ASSIGNED, ISSUE_REOPENED, ISSUE_SOLVED }
  },
  permissions: { READ_ALL_TASKS }
} = require('../../config')
const { sendNotification } = require('../../utils')

module.exports.getIssues = (req, res) => {
  const {
    repos: { issues },
    user: { _id, permissions, units }
  } = res.locals

  var { limit, offset, orderBy, ...rest } = req.query

  limit = parseInt(limit) || 0
  offset = parseInt(offset) || 0
  orderBy = orderBy || 'createdAt'

  let query = { limit, offset, orderBy }

  if (!permissions.includes(READ_ALL_TASKS)) {
    query.user = { _id, units: Object.keys(units) }
  }

  issues
    .find({ ...rest, ...query })
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.getDeadlineApproachingIssues = (req, res) => {
  const {
    repos: { issues }
  } = res.locals

  const { deadlineBefore } = req.query

  try {
    const date = new Date(deadlineBefore)

    issues
      .find({ isOpen: true, deadline: { $lte: date } })
      .then(results => res.status(200).json({ results }))
      .catch(e => {
        throw e
      })
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
}

module.exports.getIssueById = (req, res) => {
  const {
    repos: { issues }
  } = res.locals

  issues
    .findById(req.params.id)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.getIssueCountByConditions = (req, res) => {
  const {
    repos: { issues },
    user
  } = res.locals

  let { units } = req.query
  let query = req.query

  if (user.permissions.includes(READ_ALL_TASKS)) {
    if (units) {
      try {
        query.user = { units: JSON.parse(units) }
      } catch (err) {
        res.status(500).send()
      }
    }
  } else {
    query.user = { _id: user._id, units: Object.keys(user.units) }
  }

  issues
    .getCount(query)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.createIssue = (req, res) => {
  const {
    repos: { issues },
    user: { tenantId }
  } = res.locals

  issues
    .create(req.body)
    .then(result => {
      const { _id, title, unit, assignees, createdBy } = result
      const message = JSON.stringify({
        type: ISSUE_CREATED,
        payload: { _id, title, unit, assignees, createdBy, tenantId }
      })

      channel.then(ch => ch.sendToQueue(bpmQueue, new Buffer(message)))

      res.status(200).json({ result })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateIssue = (req, res) => {
  const {
    repos: { issues }
  } = res.locals

  issues
    .update(req.params.id, req.body)
    .then(results => {
      res.status(200).json({ results })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateIssueStatus = (req, res) => {
  const {
    repos: { issues, issueEvents },
    user
  } = res.locals

  const { isOpen } = req.body

  issues
    .update(req.params.id, { isOpen, solvedBy: isOpen ? null : user })
    .then(issue => {
      const { _id, title, unit, assignees } = issue

      sendNotification({
        token: req.headers.authorization,
        body: {
          message: `${user.name} ${title} işini ${
            isOpen ? '"Devam Ediyor"' : '"Tamamlandı"'
          } olarak işaretledi.`,
          payload: {
            type: isOpen ? ISSUE_REOPENED : ISSUE_SOLVED,
            issueId: _id
          },
          filters: {
            unit: unit._id,
            userIdsIn: assignees.map(({ _id }) => _id),
            userIdsNotIn: [user._id],
            tenantId: user.tenantId
          }
        }
      })

      // Create event
      return issueEvents.create({
        unitId: unit._id,
        issueId: req.params.id,
        author: user,
        date: new Date(),
        type: isOpen ? 'resolve' : 'reopen'
      })
    })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}

module.exports.updateIssuePriority = (req, res) => {
  const { priority } = req.body

  const {
    repos: { issues }
  } = res.locals

  issues
    .update(req.params.id, { priority })
    .then(result => res.json(result))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
}

module.exports.updateIssueLabels = (req, res) => {
  const {
    repos: { issues, issueEvents },
    user: { _id, name }
  } = res.locals

  issues
    .updateLabels(req.params.id, req.body.labels)
    .then(({ unit, labels }) => {
      let ids = labels.map(({ _id }) => _id)
      const addedLabels = req.body.labels.filter(
        ({ _id }) => ids.indexOf(_id) === -1
      )

      ids = req.body.labels.map(({ _id }) => _id)
      const removedLabels = labels.filter(({ _id }) => ids.indexOf(_id) === -1)

      let promises = []

      const commonProps = {
        unitId: unit._id,
        issueId: req.params.id,
        author: { _id, name },
        date: new Date()
      }

      if (addedLabels.length !== 0) {
        promises.push(
          issueEvents.create({
            ...commonProps,
            type: 'addLabel',
            labels: addedLabels
          })
        )
      }

      if (removedLabels.length !== 0) {
        promises.push(
          issueEvents.create({
            ...commonProps,
            type: 'removeLabel',
            labels: removedLabels
          })
        )
      }

      return Promise.all(promises)
    })
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
}

module.exports.updateIssueAssignees = (req, res) => {
  const {
    repos: { issues, issueEvents },
    user
  } = res.locals

  issues
    .updateAssignees(req.params.id, req.body.assignees)
    .then(({ _id, title, unit, assignees }) => {
      // Diff assignees
      let ids = assignees.map(({ _id }) => _id)
      const addedAssignees = req.body.assignees.filter(
        ({ _id }) => ids.indexOf(_id) === -1
      )

      ids = req.body.assignees.map(({ _id }) => _id)
      const removedAssignees = assignees.filter(
        ({ _id }) => ids.indexOf(_id) === -1
      )

      // Send notification to added assignees
      sendNotification({
        token: req.headers.authorization,
        body: {
          message: `${user.name} ${title} işini size atadı.`,
          payload: {
            issueId: _id,
            assignedBy: user
          },
          filters: {
            userIdsIn: addedAssignees.map(({ _id }) => _id),
            userIdsNotIn: [user._id],
            tenantId: user.tenantId
          }
        }
      })

      // Create events
      let promises = []

      const commonProps = {
        unitId: unit._id,
        issueId: req.params.id,
        author: user,
        date: new Date()
      }

      if (addedAssignees.length !== 0) {
        promises.push(
          issueEvents.create({
            ...commonProps,
            type: 'assign',
            users: addedAssignees
          })
        )
      }

      if (removedAssignees.length !== 0) {
        promises.push(
          issueEvents.create({
            ...commonProps,
            type: 'unassign',
            users: removedAssignees
          })
        )
      }

      return Promise.all(promises)
    })
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
}

module.exports.removeIssue = (req, res) => {
  const {
    repos: { issues }
  } = res.locals

  issues
    .remove(req.params.id)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.getHomepageReport = (req, res) => {
  const { startDate, endDate, unit } = req.query

  let totalCount = 0
  let openCount = 0

  const {
    repos: { issues }
  } = res.locals

  issues
    .getCountsByIsOpen(startDate, endDate, unit)
    .then(results => {
      results.forEach(result => {
        if (result._id) openCount = result.count
        totalCount += result.count
      })

      return repo.getTotalSolutionTime(startDate, endDate, unit)
    })
    .then(results => {
      let totalSolutionTime = 0

      if (results[0]) totalSolutionTime = results[0].totalSolutionTime

      res.status(200).json({ totalCount, openCount, totalSolutionTime })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.getTopProblemSolvers = (req, res) => {
  const { startDate, endDate, unit } = req.query

  const {
    repos: { issues }
  } = res.locals

  issues
    .getTotalSolutionCountByUser(startDate, endDate, unit)
    .then(results => res.status(200).json(results))
    .catch(error => res.status(500).send())
}

module.exports.getTopProblemCreators = (req, res) => {
  const { startDate, endDate, unit } = req.query

  const {
    repos: { issues },
    user
  } = res.locals

  let units = []

  if (user.permissions.includes(READ_ALL_TASKS)) {
    if (units) {
      try {
        units = JSON.parse(units)
      } catch (err) {
        res.status(500).send()
      }
    }
  } else {
    units = Object.keys(user.units)
  }

  issues
    .getTotalProblemCountByUser(startDate, endDate, units)
    .then(results => res.status(200).json(results))
    .catch(error => res.status(500).send())
}

// Hangi kullanıcıda kaç tane iş var raporu
//[{ Kullanıcı_id: [{ İş }]}, ...] şeklinde bir dizi döndürür
module.exports.getIssuesByUsersReport = (req, res) => {
  const {
    repos: { issues },
    user
  } = res.locals

  const { units } = req.query

  const query = {
    orderBy: 'createdAt',
    offset: 0,
    limit: 0,
    isOpen: 'true'
  }

  if (user.permissions.includes(READ_ALL_TASKS)) {
    if (units) {
      try {
        query.user = { units: JSON.parse(units) }
      } catch (err) {
        res.status(500).send()
      }
    }
  } else {
    query.user = { units: Object.keys(user.units) }
  }

  const projection = {
    _id: 1,
    createdAt: 1,
    title: 1,
    createdBy: 1,
    priority: 1,
    assignees: 1,
    labels: 1,
    category: 1
  }

  issues
    .find(query, projection)
    .then(issues => {
      let result = {}

      issues.map(issue => {
        issue.assignees.map(({ _id }) => {
          result[_id] ? result[_id].push(issue) : (result[_id] = [issue])
        })
      })

      res.status(200).json({ result })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
}
