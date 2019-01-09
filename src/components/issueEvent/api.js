const express = require('express')
const {
  getIssueEvents,
  getUnreadEventCount,
  createIssueEvent,
  updateIssueEvent,
  markEventsRead,
  removeIssueEvent
} = require('./controller')

const router = express.Router()

router.get('/', getIssueEvents)
router.get('/unreadEventCount', getUnreadEventCount)
router.post('/', createIssueEvent)
router.put('/markEventsRead', markEventsRead)
router.put('/:id', updateIssueEvent)
router.delete('/:id', removeIssueEvent)

module.exports = router
