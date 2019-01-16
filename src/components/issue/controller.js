const { channel } = require('../../amqp')
const {
  amqp: {
    queues: { bpmQueue },
    actions: { ISSUE_CREATED, ISSUE_ASSIGNED, ISSUE_REOPENED, ISSUE_SOLVED }
  },
  permissions: { READ_ALL_TASKS }
} = require('../../config')

module.exports.getIssues = (req, res) => {
  const {
    repos: { issues },
    user: { unit, permissions }
  } = res.locals

  var { limit, offset, orderBy, ...rest } = req.query

  limit = parseInt(limit) || 0
  offset = parseInt(offset) || 0
  orderBy = orderBy || 'createdAt'

  let query = { limit, offset, orderBy }

  if (!permissions.includes(READ_ALL_TASKS)) {
    query.unit = unit
  }

  issues
    .find({ ...query, ...rest })
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
    repos: { issues }
  } = res.locals

  issues
    .getCount(req.query)
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
    repos: { issues },
    user: { tenantId }
  } = res.locals

  const { isOpen } = req.body

  issues
    .update(req.params.id, { isOpen })
    .then(issue => {
      // Send 'Issue Status Update' message through AMQP Channel
      const { _id, createdBy, solvedBy, unit, assignees } = issue
      const message = JSON.stringify({
        type: isOpen ? ISSUE_REOPENED : ISSUE_SOLVED,
        payload: { _id, createdBy, solvedBy, unit, assignees, tenantId }
      })

      channel.then(ch => ch.sendToQueue(bpmQueue, new Buffer(message)))

      res.status(200).send()
    })
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
    repos: { issues }
  } = res.locals

  issues
    .updateLabels(req.params.id, req.body.labels)
    .then(result => res.json(result))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error })
    })
}

module.exports.updateIssueAssignees = (req, res) => {
  const {
    repos: { issues },
    user: { _id, name, tenantId }
  } = res.locals

  issues
    .updateAssignees(req.params.id, req.body.assignees)
    .then(result => {
      const message = JSON.stringify({
        type: ISSUE_ASSIGNED,
        payload: {
          assignees: req.body.assignees,
          issueId: result._id,
          assignedBy: { _id, name },
          tenantId
        }
      })

      channel.then(ch => ch.sendToQueue(bpmQueue, new Buffer(message)))

      res.json(result)
    })
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
    repos: { issues }
  } = res.locals

  issues
    .getTotalProblemCountByUser(startDate, endDate, unit)
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
        query.units = JSON.parse(units)
      } catch (err) {
        res.status(500).send()
      }
    }
  } else {
    query.unit = user.unit
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
