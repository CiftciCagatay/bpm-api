const jwt = {
  secret: process.env.JWT_SECRET || ''
}

module.exports = Object.assign({}, { jwt })
