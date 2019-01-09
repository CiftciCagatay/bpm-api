const { getTenants } = require('./getTenants')
const { getSession } = require('./getSession')
const createRepositoriesForTenant = require('./createRepositoriesForTenant')

module.exports = Object.assign(
  {},
  { getTenants, getSession, createRepositoriesForTenant }
)
