const mongoose = require('mongoose')

const labelSchema = {
  text: String,
  colorCode: String
}

const userSchema = {
  _id: String,
  name: String
}

const IssueEventSchema = {
  issueId: String,
  type: String,
  date: Date,
  comment: String,
  author: userSchema,
  labels: [labelSchema],
  users: [userSchema],
  files: [
    {
      path: String,
      filename: String,
      mimetype: String,
      originalname: String
    }
  ],
  file: Object,
  updatedAt: Date,
  updatedBy: String,
  readBy: Object
}

// readBy => { userId: readAt-(Date) }

module.exports = connection => connection.model('issueEvent', IssueEventSchema)
