const express = require('express')
const { checkPermissions } = require('../../middlewares')

const { getUnits, createUnit, updateUnit, removeUnit } = require('./controller')

const router = express.Router()

router.get('/', getUnits)
router.post('/', checkPermissions(['create:unit']), createUnit)
router.put('/:id', checkPermissions(['update:unit']), updateUnit)
router.delete('/:id', checkPermissions(['delete:unit']), removeUnit)

module.exports = router
