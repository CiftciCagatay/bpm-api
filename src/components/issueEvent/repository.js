const repository = IssueEvent => {
  const find = params => {
    const query = createQueryByParams(params)

    const orderBy = params.orderBy || 'date'
    const orderDes = params.orderDes || -1
    let limit = 20

    if (params.limit)
      try {
        limit = parseInt(params.limit)
      } catch (err) {
        console.log(err)
        limit = -1
      }

    if (limit === -1) {
      return IssueEvent.find(query).sort({ [orderBy]: orderDes })
    }

    return IssueEvent.find(query)
      .sort({ [orderBy]: orderDes })
      .limit(limit)
  }

  const findById = _id => {
    return IssueEvent.findById(_id)
  }

  const create = props => {
    const issueEvent = new IssueEvent({ ...props, date: new Date() })
    return issueEvent.save()
  }

  const update = (_id, props) => {
    return IssueEvent.findByIdAndUpdate(_id, props)
  }

  const remove = _id => {
    return IssueEvent.findByIdAndRemove(_id)
  }

  const createQueryByParams = params => {
    let query = {}
    let userPermissionOr = []
    let or = []

    Object.keys(params).forEach(key => {
      if (params[key]) {
        switch (key) {
          case 'user':
            const user = params[key]
            userPermissionOr.push({ unitId: { $in: user.units } })
            break

          case 'unitId':
          case 'issueId':
            query[key] = params[key]
            break

          case 'units':
            query['unitId'] = { $in: params[key] }
            break

          case 'fileExists':
            query.file = { $exists: params[key] }
            break

          case 'startDate':
            if (query.date) {
              query.date = { ...query.date, $gte: params[key] }
            } else {
              query.date = { $gte: params[key] }
            }
            break

          case 'endDate':
            if (query.date) {
              query.date = { ...query.date, $lte: params[key] }
            } else {
              query.date = { $lte: params[key] }
            }
            break

          case 'search':
            const regexp = new RegExp(params[key], 'i')

            // Default filtreler
            or = [
              ...or,
              { comment: regexp },
              { 'author.name': regexp },
              { 'file.originalname': regexp }
            ]
            break

          default:
            break
        }
      }
    })

    if (or.length !== 0) {
      query.$or = or
    }

    if (userPermissionOr.length !== 0) {
      query = { $and: [{ $or: userPermissionOr }, query] }
    }

    return query
  }

  return { find, findById, create, update, remove }
}

module.exports = model => repository(model)
