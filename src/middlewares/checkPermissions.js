const checkPermissions = requiredPermissions => {
  return (_, res, next) => {
    const permissions = res.locals.user.permissions
    const hasPermission = requiredPermissions.some(p => permissions.includes(p))

    if (hasPermission) {
      next()
    } else {
      res.status(401).send()
    }
  }
}

module.exports = checkPermissions
