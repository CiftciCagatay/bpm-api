module.exports = {
  host: process.env.NOTIFICATION_SERVICE_HOST || '',
  port: process.env.NOTIFICATION_SERVICE_PORT || 5000,
  path: process.env.NOTIFICATION_SERVICE_ISSUES_PATH || 'notifications'
}
