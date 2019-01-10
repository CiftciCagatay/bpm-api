const http = require('http')
const { authService } = require('../config')

module.exports.getPublicJWTKey = () => {
  return new Promise((resolve, reject) => {
    const options = {
      host: authService.host,
      port: authService.port,
      path: '/auth/publicKey',
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }

    const req = http.get(options, function(res) {
      let output = ''

      res.on('data', function(chunk) {
        output += chunk
      })

      res.on('end', function() {
        var obj = JSON.parse(output)

        if (!obj || !obj.publicKey) {
          reject(new Error('Couldnt fetch public JWT Key.'))
        } else {
          resolve(obj.publicKey)
        }
      })
    })

    req.on('error', function(err) {
      reject(err)
    })

    req.end()
  })
}
