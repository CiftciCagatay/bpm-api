const {
  Types: { ObjectId }
} = require('mongoose')

const repository = Label => {
  const find = ({ unit }) => {
    let query = unit ? { unit: ObjectId(unit) } : {}
    return Label.find(query).sort({ text: 1 })
  }
  
  const create = props => {
    const label = new Label(props)
    return label.save()
  }
  
  const update = (_id, props) => {
    return Label.findByIdAndUpdate(_id, props)
  }
  
  const remove = _id => {
    return Label.findByIdAndRemove(_id)
  }
  
  return Object.assign({}, { find, create, update, remove })
}

module.exports = model => repository(model)
