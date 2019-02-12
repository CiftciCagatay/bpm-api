const labelModel = require('../components/label/model')
const labelRepository = require('../components/label/repository')

const issueModel = require('../components/issue/model')
const issueRepository = require('../components/issue/repository')

const issueEventModel = require('../components/issueEvent/model')
const issueEventRepository = require('../components/issueEvent/repository')

const categoryModel = require('../components/category/model')
const categoryRepository = require('../components/category/repository')

const unitModel = require('../components/unit/model')
const unitRepository = require('../components/unit/repository')

const activityModel = require('../components/activity/model')
const activityRepository = require('../components/activity/repository')

module.exports = connection => {
  return {
    labels: labelRepository(labelModel(connection)),
    issues: issueRepository(issueModel(connection)),
    issueEvents: issueEventRepository(issueEventModel(connection)),
    categories: categoryRepository(categoryModel(connection)),
    units: unitRepository(unitModel(connection)),
    activities: activityRepository(activityModel(connection))
  }
}
