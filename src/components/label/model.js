const mongoose = require('mongoose')
const { Schema } = mongoose

const LabelSchema = new Schema({
  text: String,
  colorCode: String,
  unit: {
    type: Schema.Types.ObjectId,
    path: 'units'
  }
})

module.exports = connection => connection.model('label', LabelSchema)
