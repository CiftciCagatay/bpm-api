module.exports = Object.assign({}, { 
  service: {
    token: process.env.SERVICE_TOKEN || '',
    onPremise: JSON.parse(process.env.ON_PREMISE) || false
  }
})