const { createDatabaseConnections } = require('./src/database')
const { startServer } = require('./src/server')
const { getTenants, createRepositoriesForTenant } = require('./src/utils')
const {
  server: { port },
  service
} = require('./src/config')

console.log(`Starting with ${service.onPremise ? 'on premise' : 'cloud'} mode...`)

getTenants()
  .then(async tenants => {
    // Create db connections for each tenant
    let connections = await createDatabaseConnections(tenants)

    // Create repository with each connection
    let repos = {}
    connections.map((connection, index) => {
      repos = {
        ...repos,
        [tenants[index]._id]: createRepositoriesForTenant(connection)
      }
    })

    if (service.onPremise) {
      repos = repos[tenants[0]._id]
    }

    return startServer({ port, repos })
  })
  .then(() => console.log(`Application listening on port ${port}...`))
  .catch(error => console.log(error))
