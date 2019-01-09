const http = require('http')
const { authService } = require('../config')

module.exports.getSession = token => {
  return new Promise((resolve, reject) => {
    const options = {
      host: authService.host,
      port: authService.port,
      path: `/sessions`,
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const req = http.get(options, function(res) {
      let output = ''

      res.on('data', function(chunk) {
        output += chunk
      })

      res.on('end', function() {
        var obj = JSON.parse(output)

        if (!obj) {
          reject(new Error('Session couldnt fetched.'))
        } else {
          resolve(obj)
        }
      })
    })

    req.on('error', function(err) {
      reject(err)
    })

    req.end()
  })
}
