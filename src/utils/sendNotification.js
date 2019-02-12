const {
  notifications: { host, port, path }
} = require('../config')

const http = require('http')

module.exports.sendNotification = ({ token, body }) => {
  return new Promise((resolve, _) => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token
    }

    const options = {
      host,
      port,
      path: `/${path}`,
      method: 'POST',
      headers
    }

    const req = http.request(options, () => {
      resolve()
    })

    req.write(JSON.stringify(body))

    req.on('error', err => {
      console.log(err)
    })

    req.end()
  })
}
