const express = require('express')
const { checkPermissions } = require('../../middlewares')
const {
  permissions: { UPDATE_COMMENT, DELETE_COMMENT }
} = require('../../config')

const {
  getIssueEvents,
  getIssueEvent,
  createIssueEvent,
  updateIssueEvent,
  removeIssueEvent
} = require('./controller')

const router = express.Router()

router.get('/', getIssueEvents)
router.get('/:id', getIssueEvent)
router.post('/', createIssueEvent)
router.put('/:id', checkPermissions([UPDATE_COMMENT]), updateIssueEvent)
router.delete('/:id', checkPermissions([DELETE_COMMENT]), removeIssueEvent)

module.exports = router
