const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const ctrl = require('./controller')

const router = express.Router()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/files')
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

const upload = multer({ storage })

router.get('/', ctrl.getFiles)

router.post('/', upload.array('uploads', 5), function(req, res) {
  res.status(200).json(req.files)
})

module.exports = router