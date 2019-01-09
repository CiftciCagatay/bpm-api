module.exports.getCategories = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .find(req.query)
    .then(result => {
      // Sort subcategories of all categories
      result.map(cat => cat.subCategories.sort(compareFunction))
      res.status(200).json({ result })
    })
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.createCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .create(req.body)
    .then(result => res.status(200).json({ result }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .update(req.params.id, req.body)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.removeCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .remove(req.params.id)
    .then(results => res.status(200).json({ results }))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.addSubCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .createSubCategory(req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.updateSubCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .updateSubCategory(req.params.id, req.params.subCategoryId, req.body)
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

module.exports.removeSubCategory = (req, res) => {
  const {
    repos: { categories }
  } = res.locals

  categories
    .removeSubCategory(req.params.id, req.params.subCategoryId)
    .then(result => res.status(200).json(result))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
}

// Altkategorileri harf sırasına sokarken getCategories de kullanılıyor
const compareFunction = function(a, b) {
  if (a.text > b.text) return 1

  if (a.text < b.text) return -1

  return 0
}
