const express = require('express')
const ctrl = require('./controller')

const router = express.Router()

router.get('/', ctrl.getActivities)

router.post('/:id/participants', ctrl.addParticipants)
router.post('/', ctrl.createActivity)

router.put('/:id/attending', ctrl.updateAttendingStatus)
router.put('/:id', ctrl.updateActivity)

router.delete('/:id/participants', ctrl.removeParticipants)
router.delete('/:id', ctrl.removeActivity)

module.exports = router
