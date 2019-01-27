const mongoose = require('mongoose')
const { Schema } = mongoose

const UnitSchema = new Schema({
  name: String,
  description: String,
  createdAt: Date,
  createdBy: String,
  updatedAt: String,
  updatedBy: String,
  active: {
    type: Boolean,
    default: true
  }
})

module.exports = connection => connection.model('unit', UnitSchema)
