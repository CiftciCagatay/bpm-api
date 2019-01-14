const repository = Issue => {
  const find = ({ orderBy, limit, offset, ...params }, projection = {}) => {
    const query = createQueryByParams(params)
    let sort = {}
    
    sort[orderBy] = -1

    return Issue.find(query, projection)
      .sort(sort)
      .skip(offset)
      .limit(limit)
  }

  const findById = id => {
    return Issue.findById(id)
  }

  const getCount = params => {
    const query = createQueryByParams(params)

    return Issue.aggregate([
      {
        $match: query
      },
      {
        $group: { _id: null, count: { $sum: 1 } }
      },
      {
        $project: { _id: 0 }
      }
    ])
  }

  const getById = _id => {
    return Issue.findOne({ _id })
  }

  const getUsers = _id => {
    return Issue.findOne({ _id }, { assignees: 1, createdBy: 1, _id: 0 })
  }

  const create = props => {
    const issue = new Issue({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return issue.save()
  }

  const update = (id, props) => {
    // Sorun güncellenme tarihini ekle
    let temp = { ...props, updatedAt: new Date() }

    // Eğer sorun kapatılmışsa çözüm tarihini ekle
    if (typeof props.isOpen !== 'undefined' && !props.isOpen) {
      temp.solvedAt = new Date()
    }

    return Issue.findByIdAndUpdate(id, temp)
  }

  const remove = id => {
    return Issue.findByIdAndRemove(id)
  }

  const updateLabels = (id, labels) => {
    return Issue.findByIdAndUpdate(id, {
      labels,
      updatedAt: new Date()
    })
  }

  const updateAssignees = (id, assignees) => {
    return Issue.findByIdAndUpdate(id, {
      assignees,
      updatedAt: new Date()
    })
  }

  //
  //  Reports
  //
  const getTotalSolutionTime = (startDate, endDate, unitId) => {
    let query = {}

    if (startDate || endDate) query['createdAt'] = {}

    if (startDate && new Date(startDate))
      query['createdAt']['$gte'] = new Date(startDate)

    if (endDate && new Date(endDate))
      query['createdAt']['$lte'] = new Date(endDate)

    if (unitId) query['unit._id'] = unitId

    return Issue.aggregate([
      {
        $match: {
          isOpen: false,
          ...query
        }
      },
      {
        $group: {
          _id: null,
          totalSolutionTime: {
            $sum: { $subtract: ['$solvedAt', '$createdAt'] }
          }
        }
      }
    ])
  }

  const getCountsByIsOpen = (startDate, endDate, unitId) => {
    let query = {}

    if (startDate || endDate) query['createdAt'] = {}

    if (startDate && new Date(startDate))
      query['createdAt']['$gte'] = new Date(startDate)

    if (endDate && new Date(endDate))
      query['createdAt']['$lte'] = new Date(endDate)

    if (unitId) query['unit._id'] = unitId

    return Issue.aggregate([
      {
        $match: {
          ...query
        }
      },
      {
        $group: {
          _id: '$isOpen',
          count: { $sum: 1 }
        }
      }
    ])
  }

  const getTotalSolutionCountByUser = (startDate, endDate, unitId) => {
    let query = {}

    if (startDate || endDate) query['solvedAt'] = {}

    if (startDate && new Date(startDate))
      query['solvedAt']['$gte'] = new Date(startDate)

    if (endDate && new Date(endDate))
      query['solvedAt']['$lte'] = new Date(endDate)

    if (unitId) query['unit._id'] = unitId

    return Issue.aggregate([
      {
        $match: {
          ...query,
          isOpen: false
        }
      },
      {
        $group: {
          _id: '$solvedBy',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])
  }

  const getTotalProblemCountByUser = (startDate, endDate, unitId) => {
    let query = {}

    if (startDate || endDate) query['createdAt'] = {}

    if (startDate && new Date(startDate))
      query['createdAt']['$gte'] = new Date(startDate)

    if (endDate && new Date(endDate))
      query['createdAt']['$lte'] = new Date(endDate)

    if (unitId) query['unit._id'] = unitId

    return Issue.aggregate([
      {
        $match: {
          ...query
        }
      },
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])
  }

  //
  //  Helpers
  //
  const createQueryByParams = params => {
    let query = {}

    Object.keys(params).forEach(key => {
      switch (key) {
        case 'units':
          query['unit._id'] = { $in: params[key] }
          break
        case 'unit':
        case 'createdBy':
        case 'solvedBy':
          query[`${key}._id`] = params[key]
          break
        case 'category':
        case 'subCategory':
          query[key] = params[key]
          break
        case 'priority':
          try {
            const value = parseInt(params[key], 10)
            if (value) query[key] = value
            break
          } catch (err) {
            console.log(err)
            break
          }
        case 'isOpen':
          query[key] = params[key] === 'true'
          break
        case 'search':
          const regexp = new RegExp(params[key], 'i')

          // Default filtreler
          let or = [
            { title: regexp },
            { 'category.text': regexp },
            { 'subCategory.text': regexp }
          ]

          // Eğer etiketler ayrıca belirtilmişse filtreleme
          if (!query.labels)
            or.push({ labels: { $elemMatch: { text: regexp } } })

          // Eğer görevliler ayrıca belirtilmişse filtreleme
          if (!query.assignees)
            or.push({ assignees: { $elemMatch: { name: regexp } } })

          // Eğer sorunu oluşturan ayrıca belirtilmişse filtreleme
          if (!query.createdBy) or.push({ 'createdBy.name': regexp })

          // Eğer kapalı sorunlara bakıyorsak ve sorunu çözen ayrıca belirtilmemişse filtrele
          if (!query.solvedBy && !query.isOpen)
            or.push({ 'solvedBy.name': regexp })

          const searchQuery = {
            $or: or
          }

          query = { ...query, ...searchQuery }

          break
        case 'createdAt':
          query[key] = { $gte: new Date(params[key]) }
          break
        case 'solvedAt':
          query[key] = { $lte: new Date(params[key]) }
          break
        case 'assignees':
          try {
            let arr = JSON.parse(params[key])
            query[key] = { $elemMatch: { _id: { $in: arr } } }
            break
          } catch (error) {
            console.log(error)
            break
          }
        case 'labels':
          try {
            let arr = JSON.parse(params[key])
            query[key] = { $elemMatch: { text: { $in: arr } } }
            break
          } catch (error) {
            console.log(error)
            break
          }
        default:
          break
      }
    })

    return query
  }

  return {
    find,
    findById,
    getCount,
    getById,
    getUsers,
    create,
    update,
    remove,
    updateLabels,
    updateAssignees,

    getTotalSolutionTime,
    getCountsByIsOpen,
    getTotalSolutionCountByUser,
    getTotalProblemCountByUser
  }
}

module.exports = model => repository(model)
