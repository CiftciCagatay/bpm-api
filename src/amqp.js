const amqp = require('amqplib/callback_api')
const {
  amqp: {
    uri,
    queues: { bpmQueue }
  }
} = require('./config')

let channel = null

const createConnection = () =>
  new Promise((resolve, reject) => {
    amqp.connect(
      uri,
      (err, conn) => {
        if (err) {
          reject(err)
        } else {
          resolve(conn)
        }
      }
    )
  })

const createChannel = conn =>
  new Promise((resolve, reject) => {
    conn.createChannel((err, ch) => {
      if (err) {
        reject(err)
      } else {
        console.log('AMQP Channel asserted.')
        ch.assertQueue(bpmQueue, { durable: false })
        resolve(ch)
      }
    })
  })

module.exports.channel = createConnection().then(createChannel)
