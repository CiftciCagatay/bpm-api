const express = require('express')
const { checkPermissions } = require('../../middlewares')
const {
  permissions: { CREATE_UNIT }
} = require('../../config')

const {
  getUnits,
  createUnit,
  updateUnit,
  removeUnit
} = require('./controller')

const router = express.Router()

router.get('/', getUnits)
router.post('/', checkPermissions([CREATE_UNIT]), createUnit)
router.put('/:id', updateUnit)
router.delete('/:id', removeUnit)

module.exports = router
