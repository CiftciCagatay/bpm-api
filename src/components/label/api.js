const express = require('express')
const {
  getLabels,
  createLabel,
  updateLabel,
  removeLabel
} = require('./controller')

const router = express.Router()

router.get('/', getLabels)
router.post('/', createLabel)
router.put('/:id', updateLabel)
router.delete('/:id', removeLabel)

module.exports = router
