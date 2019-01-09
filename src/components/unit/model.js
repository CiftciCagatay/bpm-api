const mongoose = require('mongoose')
const { Schema } = mongoose

const UnitSchema = new Schema({
  name: String
})

module.exports = connection => connection.model('unit', UnitSchema)
