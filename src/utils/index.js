const { getTenants } = require('./getTenants')
const { getPublicJWTKey } = require('./getPublicJWTKey')
const createRepositoriesForTenant = require('./createRepositoriesForTenant')
const verifyJWT = require('./verifyJWT')
const { sendNotification } = require('./sendNotification')

module.exports = Object.assign(
  {},
  {
    getTenants,
    getPublicJWTKey,
    verifyJWT,
    createRepositoriesForTenant,
    sendNotification
  }
)
