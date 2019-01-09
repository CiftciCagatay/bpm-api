const mongoose = require('mongoose')

const createConnection = uri =>
  mongoose.createConnection(uri, {
    useNewUrlParser: true
  })

module.exports.createDatabaseConnections = createDatabaseConnections = tenants => {
  let connections = tenants.map(({ databaseConnectionString }) =>
    createConnection(databaseConnectionString)
  )

  return Promise.all(connections)
}
