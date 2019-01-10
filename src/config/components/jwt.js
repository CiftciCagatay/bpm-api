const jwt = {
  issuer: process.env.JWT_ISSUER || ''
}

module.exports = Object.assign({}, { jwt })
