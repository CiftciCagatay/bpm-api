const { jwt } = require('./components/jwt')
const { server } = require('./components/server')
const { amqp } = require('./components/amqp')
const { tenantService } = require('./components/tenant-service')
const { authService } = require('./components/auth-service')
const { service } = require('./components/service')
const mongo = require('./components/mongo')
const permissions = require('./components/permissions')
const notifications = require('./components/notification-service')

module.exports = Object.assign(
  {},
  {
    jwt,
    server,
    amqp,
    tenantService,
    authService,
    service,
    mongo,
    permissions,
    notifications
  }
)
