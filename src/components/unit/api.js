const express = require('express')
const { getUnits, createUnit, updateUnit, removeUnit } = require('./controller')

const router = express.Router()

router.get('/', getUnits)
router.post('/', createUnit)
router.put('/:id', updateUnit)
router.delete('/:id', removeUnit)

module.exports = router
