const { channel } = require('../../amqp')
const {
  amqp: {
    queues: { bpmQueue },
    actions: { ISSUE_COMMENT }
  },
  permissions: { READ_ALL_TASKS }
} = require('../../config')

module.exports.getIssueEvents = (req, res) => {
  const {
    repos: { issueEvents },
    user: { unit, permissions }
  } = res.locals

  let query = req.query

  if (!permissions.includes(READ_ALL_TASKS)) {
    query.unitId = unit
  }

  issueEvents
    .find(query)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.createIssueEvent = (req, res) => {
  const {
    repos: { issueEvents, issues }
  } = res.locals

  const { tenantId } = res.locals.user

  issueEvents
    .create(req.body)
    .then(result => {
      issues.update(req.body.issueId, {}).catch(err => console.log(err))

      // Yorum yapıldı mesajını AMQP kanalından ilet
      if (result.type === 'comment') {
        const { author, comment, issueId } = result
        const message = JSON.stringify({
          type: ISSUE_COMMENT,
          payload: { author, comment, issueId, tenantId }
        })

        channel.then(ch => ch.sendToQueue(bpmQueue, new Buffer(message)))
      }

      res.status(200).json({ result })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateIssueEvent = (req, res) => {
  const {
    repos: { issueEvents }
  } = res.locals

  issueEvents
    .update(req.params.id, req.body)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.removeIssueEvent = (req, res) => {
  const {
    repos: { issueEvents }
  } = res.locals

  issueEvents
    .remove(req.params.id)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}
