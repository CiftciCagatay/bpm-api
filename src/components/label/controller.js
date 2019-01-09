module.exports.getLabels = (req, res, next) => {
  const {
    repos: { labels }
  } = res.locals

  labels
    .find(req.query)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.createLabel = (req, res, next) => {
  const {
    repos: { labels }
  } = res.locals

  labels
    .create(req.body)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateLabel = (req, res, next) => {
  const {
    repos: { labels }
  } = res.locals

  labels
    .update(req.params.id, req.body)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.removeLabel = (req, res, next) => {
  const {
    repos: { labels }
  } = res.locals

  labels
    .remove(req.params.id)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}
