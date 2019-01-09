const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { getSession } = require('./utils')
const { service } = require('./config')

// Routes
const issuesRoute = require('./components/issue/api')
const issueEventsRoute = require('./components/issueEvent/api')
const categoriesRoute = require('./components/category/api')
const unitsRoute = require('./components/unit/api')
const labelsRoute = require('./components/label/api')
const filesRoute = require('./components/file/api')

const startServer = ({ port, repos }) => {
  return new Promise((resolve, reject) => {
    if (!port) {
      reject(new Error('Server needs an available port!'))
    }

    if (!repos) {
      reject(new Error('Server needs connected repos for tenants!'))
    }

    const app = express()

    app.use('/', bodyParser.json())
    app.use('/', cors())
    app.use('/files', express.static('/files'))

    // Authorization
    // Eğer servis on premise çalışıyorsa direk tüm repoları ilet
    // Bulutta çalışıyorsa tenantId e göre doğru olan repoları ilet
    app.use('/', (req, res, next) => {
      getSession(req.headers.authorization)
        .then(payload => {
          if (!payload || !payload.type) {
            reject(new Error('InvalidJWT'))
          } else if (payload.type === 'USER_TOKEN') {
            res.locals.user = payload
            res.locals.repos = service.onPremise
              ? repos
              : repos[payload.tenantId]
            next()
          } else if (payload.type === 'SERVICE_TOKEN' && req.query.tenantId) {
            res.locals.user = req.query
            res.locals.repos = service.onPremise
              ? repos
              : repos[req.query.tenantId]
            next()
          } else {
            reject(new Error('InvalidJWT'))
          }
        })
        .catch(err => {
          console.log(err)
          res.status(401).send()
        })
    })

    app.use('/issues', issuesRoute)
    app.use('/issueEvents', issueEventsRoute)
    app.use('/categories', categoriesRoute)
    app.use('/units', unitsRoute)
    app.use('/labels', labelsRoute)
    app.use('/files', filesRoute)

    app.listen(port, () => resolve(app))
  })
}

module.exports = Object.assign({}, { startServer })
