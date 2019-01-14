const { channel } = require('../../amqp')
const {
  amqp: {
    queues: { bpmQueue },
    actions: { ISSUE_COMMENT }
  }
} = require('../../config')

module.exports.getIssueEvents = (req, res) => {
  const {
    repos: { issueEvents },
    user: { unit, permissions }
  } = res.locals

  let query = req.query

  if (!permissions.includes('read:all_events')) {
    query.unit = unit
  }

  issueEvents
    .find(query)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.getUnreadEventCount = (req, res) => {
  const {
    repos: { issueEvents },
    user: { _id }
  } = res.locals

  const { issueId } = req.query

  if (!issueId) {
    res.status(400).send()
    return
  }

  issueEvents
    .getUnreadEventCount({ userId: _id, issueId })
    .then(count => res.status(200).json({ count }))
    .catch(err => {
      console.log(err)
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

module.exports.markEventsRead = (req, res) => {
  const {
    repos: { issueEvents },
    user: { _id }
  } = res.locals

  const { issueId } = req.query
  console.log(_id)
  issueEvents
    .markEventsRead({ userId: _id, issueId })
    .then(res => res.status(200).json(res))
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
