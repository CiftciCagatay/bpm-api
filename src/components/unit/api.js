const express = require('express')
const { checkPermissions } = require('../../middlewares')
const {
  permissions: { CREATE_UNIT, UPDATE_UNIT, DELETE_UNIT }
} = require('../../config')

const { getUnits, createUnit, updateUnit, removeUnit } = require('./controller')

const router = express.Router()

router.get('/', getUnits)
router.post('/', checkPermissions([CREATE_UNIT]), createUnit)
router.put('/:id', checkPermissions([UPDATE_UNIT]), updateUnit)
router.delete('/:id', checkPermissions([DELETE_UNIT]), removeUnit)

module.exports = router
