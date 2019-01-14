const express = require('express')
const { checkPermissions } = require('../../middlewares')

const {
  getLabels,
  createLabel,
  updateLabel,
  removeLabel
} = require('./controller')

const router = express.Router()

router.get('/', getLabels)
router.post('/', checkPermissions(['create:label']), createLabel)
router.put('/:id', checkPermissions(['update:label']), updateLabel)
router.delete('/:id', checkPermissions(['delete:label']), removeLabel)

module.exports = router
