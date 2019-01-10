const { getTenants } = require('./getTenants')
const { getPublicJWTKey } = require('./getPublicJWTKey')
const createRepositoriesForTenant = require('./createRepositoriesForTenant')
const verifyJWT = require('./verifyJWT')

module.exports = Object.assign(
  {},
  { getTenants, getPublicJWTKey, verifyJWT, createRepositoriesForTenant }
)
