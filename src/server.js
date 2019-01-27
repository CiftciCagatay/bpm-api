const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { verifyJWT, getPublicJWTKey } = require('./utils')

// Routes
const issuesRoute = require('./components/issue/api')
const issueEventsRoute = require('./components/issueEvent/api')
const categoriesRoute = require('./components/category/api')
const unitsRoute = require('./components/unit/api')
const labelsRoute = require('./components/label/api')
const filesRoute = require('./components/file/api')

const startServer = ({ port, repos }) => {
  if (!port) {
    return Promise.reject(new Error('Server needs an available port!'))
  }

  if (!repos) {
    return Promise.reject(new Error('Server needs connected repos!'))
  }

  const app = express()
  let publicJWTKey = ''

  app.use('/', bodyParser.json())
  app.use('/', cors())
  app.use('/files', express.static('/files'))

  // Authorization
  app.use('/', (req, res, next) => {
    verifyJWT(req.headers.authorization, publicJWTKey)
      .then(payload => {
        res.locals.user = payload
        res.locals.repos = repos[payload.tenantId]
        next()
      })
      .catch(() => res.status(401).send())
  })

  app.use('/issues', issuesRoute)
  app.use('/issueEvents', issueEventsRoute)
  app.use('/categories', categoriesRoute)
  app.use('/units', unitsRoute)
  app.use('/labels', labelsRoute)
  app.use('/files', filesRoute)

  return getPublicJWTKey().then(key => {
    publicJWTKey = key
    app.listen(port)
  })
}

module.exports = Object.assign({}, { startServer })
