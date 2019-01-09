const express = require('express')
const ctrl = require('./controller')

const router = express.Router()

// Issue CRUD Operations
router.get('/', ctrl.getIssues)
router.get('/count', ctrl.getIssueCountByConditions)
router.get('/:id', ctrl.getIssueById)

router.post('/', ctrl.createIssue)

router.put('/:id', ctrl.updateIssue)
router.put('/:id/isOpen', ctrl.updateIssueStatus)
router.put('/:id/priority', ctrl.updateIssuePriority)
router.put('/:id/labels', ctrl.updateIssueLabels)
router.put('/:id/assignees', ctrl.updateIssueAssignees)

router.delete('/:id', ctrl.removeIssue)

// Reports
router.get('/reports/homepageReport', ctrl.getHomepageReport)
router.get('/reports/solversGuild', ctrl.getTopProblemSolvers)
router.get('/reports/problemResources', ctrl.getTopProblemCreators)
router.get('/reports/issuesByUsers', ctrl.getIssuesByUsersReport)

module.exports = router
