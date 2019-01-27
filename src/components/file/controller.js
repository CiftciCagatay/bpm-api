const { permissions } = require('../../config')

module.exports.getFiles = (req, res) => {
  const {
    user,
    repos: { issueEvents }
  } = res.locals

  const { limit, orderBy, orderDes, startDate, endDate, search } = req.query

  let params = {
    fileExists: true,
    limit,
    orderBy,
    orderDes,
    startDate,
    endDate,
    search
  }

  if (!user.permissions.includes(permissions.READ_ALL_TASKS)) {
    params.units = Object.keys(user.units)
  }

  issueEvents
    .find(params)
    .then(results => res.status(200).json({ results }))
    .catch(e => {
      console.log(e)
      res.status(500).send()
    })
}
