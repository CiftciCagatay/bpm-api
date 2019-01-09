module.exports = Object.assign(
  {},
  {
    authService: {
      host: process.env.AUTH_SERVICE_HOST || '',
      port: process.env.AUTH_SERVICE_PORT || 5000
    }
  }
)
