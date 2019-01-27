import { permissions } from '../../config'

module.exports.canUpdateUnit = (req, res, next) => {
  const unitId = req.params.id
  const {
    user: { units, permissions: userPermissions }
  } = res.locals

  if (!userPermissions.includes(permissions.UPDATE_UNIT) && !units[unitId]) {
    res.status(401).send()
  } else {
    next()
  }
}
