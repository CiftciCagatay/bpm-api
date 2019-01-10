const mongoose = require('mongoose')
const { Schema } = mongoose

const unitSchema = {
  _id: String,
  name: String
}

const labelSchema = {
  text: String,
  colorCode: String
}

const categorySchema = {
  _id: String,
  text: String
}

const userSchema = {
  _id: String,
  name: String
}

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  explanation: {
    type: String,
    required: true
  },

  isOpen: {
    type: Boolean,
    default: true
  },

  priority: {
    type: Number,
    default: 0
  },

  unit: unitSchema,
  category: categorySchema,
  subCategory: categorySchema,

  updatedAt: Date,
  updatedBy: userSchema,

  createdAt: Date,
  createdBy: userSchema,

  solvedAt: Date,
  solvedBy: userSchema,

  assignees: [userSchema],

  labels: [labelSchema],

  deadline: Date
})

module.exports = connection => connection.model('issue', IssueSchema)

