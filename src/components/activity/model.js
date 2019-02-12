const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
  issueId: String,
  title: String,
  explanation: String,
  location: String,

  createdAt: Date,
  createdBy: { _id: String, name: String },

  updatedAt: Date,
  updatedBy: { _id: String, name: String },

  participants: [
    {
      _id: String,
      name: String,
      waitingForResponse: {
        type: Boolean,
        default: true
      },
      attending: {
        type: Boolean,
        default: false
      }
    }
  ],

  canEdit: {
    type: Boolean,
    default: false
  },
  canInvite: {
    type: Boolean,
    default: true
  },
  canSeeParticipantList: {
    type: Boolean,
    default: true
  },

  start: Date,
  end: Date,
  allDay: {
    type: Boolean,
    default: false
  }
})

module.exports = connection => connection.model('activity', ActivitySchema)
