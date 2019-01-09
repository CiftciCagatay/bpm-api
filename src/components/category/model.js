const mongoose = require('mongoose')
const { Schema } = mongoose

const CategorySchema = new Schema({
  text: String,
  subCategories: [{
    text: String
  }],
  unit: {
    type: Schema.Types.ObjectId,
    path: 'units'
  }
})

module.exports = connection => connection.model('category', CategorySchema)
