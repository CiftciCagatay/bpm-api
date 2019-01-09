const express = require('express')
const {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,
  addSubCategory,
  updateSubCategory,
  removeSubCategory
} = require('./controller')

const router = express.Router()

//Categories
router.get('/', getCategories)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', removeCategory)

// SubCategories
router.post('/:id/subCategories', addSubCategory)
router.put('/:id/subCategories/:subCategoryId', updateSubCategory)
router.delete('/:id/subCategories/:subCategoryId', removeSubCategory)

module.exports = router
