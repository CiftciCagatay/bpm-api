const labelSchema = {
  text: String,
  colorCode: String
}

const userSchema = {
  _id: String,
  name: String
}

const IssueEventSchema = {
  issueId: {
    type: String,
    required: true
  },
  unitId: String,
  type: {
    type: String,
    required: true
  },
  date: Date,
  comment: String,
  author: userSchema,
  labels: [labelSchema],
  users: [userSchema],
  file: Object,
  updatedAt: Date,
  updatedBy: String
}

module.exports = connection => connection.model('issueEvent', IssueEventSchema)
