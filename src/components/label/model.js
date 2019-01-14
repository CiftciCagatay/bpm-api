const mongoose = require('mongoose')
const { Schema } = mongoose

const LabelSchema = new Schema({
  text: String,
  colorCode: String,
  description: String,
  unit: String
})

module.exports = connection => connection.model('label', LabelSchema)
