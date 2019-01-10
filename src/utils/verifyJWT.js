const jwt = require('jsonwebtoken')
const {
  jwt: { issuer }
} = require('../config')

module.exports = (token, publicKey) => {
  const verifyOptions = {
    issuer,
    algorithms: ['RS256']
  }

  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, publicKey, verifyOptions)
      resolve(payload)
    } catch (error) {
      reject(error)
    }
  })
}
