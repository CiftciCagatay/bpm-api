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
      }

    if (limit === -1) {
      return IssueEvent.find(query).sort({ [orderBy]: orderDes })
    }

    return IssueEvent.find(query)
      .sort({ [orderBy]: orderDes })
      .limit(limit)
  }

  const getUnreadEventCount = ({ userId, issueId }) =>
    IssueEvent.countDocuments({ issueId, [`readBy.${userId}`]: undefined })

  const markEventsRead = ({ userId, issueId }) =>
    IssueEvent.update(
      { issueId, [`readBy.${userId}`]: undefined },
      { [`readBy.${userId}`]: new Date() }
    )

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

    Object.keys(params).forEach(key => {
      switch (key) {
        case 'issueId':
          query[key] = params[key]
          break
        default:
          break
      }
    })

    return query
  }

  return { find, getUnreadEventCount, create, update, markEventsRead, remove }
}

module.exports = model => repository(model)
