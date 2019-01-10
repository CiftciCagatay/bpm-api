module.exports = Object.assign(
  {},
  {
    service: {
      token: process.env.SERVICE_TOKEN || '',
      onPremise: process.env.ON_PREMISE || false
    }
  }
)
