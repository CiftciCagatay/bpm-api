const express = require('express')
const { checkPermissions } = require('../../middlewares')
const {
  permissions: { CREATE_LABEL, UPDATE_LABEL, DELETE_LABEL }
} = require('../../config')

const {
  getLabels,
  createLabel,
  updateLabel,
  removeLabel
} = require('./controller')

const router = express.Router()

router.get('/', getLabels)
router.post('/', checkPermissions([CREATE_LABEL]), createLabel)
router.put('/:id', checkPermissions([UPDATE_LABEL]), updateLabel)
router.delete('/:id', checkPermissions([DELETE_LABEL]), removeLabel)

module.exports = router
