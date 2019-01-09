const {
  Types: { ObjectId }
} = require('mongoose')

const repository = Category => {
  const find = ({ unit }) => {
    let query = {}
    if (unit) query['unit'] = ObjectId(unit)

    return Category.find(query).sort({ text: 1 })
  }

  const create = props => {
    const category = new Category(props)
    return category.save()
  }

  const update = (id, props) => {
    return Category.findByIdAndUpdate(id, props)
  }

  const remove = id => {
    return Category.findByIdAndRemove(id)
  }

  const createSubCategory = (id, subCategory) => {
    return Category.findByIdAndUpdate(id, {
      $push: { subCategories: subCategory }
    })
  }

  const updateSubCategory = (_id, subCategoryId, props) => {
    return Category.update(
      { _id, 'subCategories._id': subCategoryId },
      {
        $set: { 'subCategories.$': { _id: subCategoryId, ...props } }
      }
    )
  }

  const removeSubCategory = (id, subCategoryId) => {
    return Category.findByIdAndUpdate(id, {
      $pull: { subCategories: { _id: subCategoryId } }
    })
  }

  return {
    find,
    create,
    update,
    remove,
    createSubCategory,
    updateSubCategory,
    removeSubCategory
  }
}

module.exports = model => repository(model)
