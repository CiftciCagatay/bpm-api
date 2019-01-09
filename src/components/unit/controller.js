module.exports.getUnits = (req, res) => {
  const { repos: { units } } = res.locals

  units
    .find(req.query)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.createUnit = (req, res) => {
  const { repos: { units } } = res.locals

  units
    .create(req.body)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateUnit = (req, res) => {
  const { repos: { units } } = res.locals

  units
    .update(req.params.id, req.body)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.removeUnit = (req, res) => {
  const { repos: { units } } = res.locals

  units
    .remove(req.params.id)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}
