const amqp = {
  uri: process.env.AMQP_URI || '',
  queues: {
    bpmQueue: 'bpm'
  },
  actions: {
    ISSUE_CREATED: 'ISSUE_CREATED',
    ISSUE_SOLVED: 'ISSUE_SOLVED',
    ISSUE_ASSIGNED: 'ISSUE_ASSIGNED',
    ISSUE_COMMENT: 'ISSUE_COMMENT',
    ISSUE_REOPENED: 'ISSUE_REOPENED'
  }
}

module.exports = Object.assign({}, { amqp })
