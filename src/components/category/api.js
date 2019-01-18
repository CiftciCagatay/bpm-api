const express = require('express')
const { checkPermissions } = require('../../middlewares')
const {
  permissions: { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY }
} = require('../../config')

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
router.post('/', checkPermissions([CREATE_CATEGORY]), createCategory)
router.put('/:id', checkPermissions([UPDATE_CATEGORY]), updateCategory)
router.delete('/:id', checkPermissions([DELETE_CATEGORY]), removeCategory)

// SubCategories
router.post('/:id/subCategories', addSubCategory)
router.put(
  '/:id/subCategories/:subCategoryId',
  checkPermissions([UPDATE_CATEGORY]),
  updateSubCategory
)
router.delete(
  '/:id/subCategories/:subCategoryId',
  checkPermissions([DELETE_CATEGORY]),
  removeSubCategory
)

module.exports = router
