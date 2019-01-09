const http = require('http')
const { service, tenantService, mongo } = require('../config')

module.exports.getTenants = () => {
  // Eğer servis on premise modda çalışıyorsa direk env den verilen mongoyu döndür
  if (service.onPremise) {
    return Promise.resolve([
      { _id: 'onPrem', databaseConnectionString: mongo.uri }
    ])
  }

  return new Promise((resolve, reject) => {
    const options = {
      host: tenantService.host,
      port: tenantService.port,
      path: '/tenants',
      method: 'GET',
      headers: {
        Authorization: service.token,
        Accept: 'application/json',
        'Content-Type': 'application(json'
      }
    }

    const req = http.get(options, function(res) {
      let output = ''

      res.on('data', function(chunk) {
        output += chunk
      })

      res.on('end', function() {
        var obj = JSON.parse(output)

        if (!obj || !obj.tenants) {
          reject(new Error('Tenants couldnt fetched.'))
        } else {
          resolve(obj.tenants)
        }
      })
    })

    req.on('error', function(err) {
      reject(err)
    })

    req.end()
  })
}
