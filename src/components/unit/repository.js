const repository = Unit => {
  const find = () => {
    return Unit.find().sort({ name: 1 })
  }

  const create = props => {
    const unit = new Unit(props)
    return unit.save()
  }

  const update = (_id, props) => {
    return Unit.findByIdAndUpdate(_id, props)
  }

  const remove = _id => {
    return Unit.findByIdAndRemove(_id)
  }

  return { find, create, update, remove }
}

module.exports = model => repository(model)
