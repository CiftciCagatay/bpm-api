module.exports = Object.assign({}, {
  tenantService: {
    host: process.env.TENANT_SERVICE_HOST || '',
    port: process.env.TENANT_SERVICE_PORT || 5000
  }
})