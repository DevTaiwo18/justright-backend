const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('packSize').notEmpty().withMessage('Pack size is required'),
  body('buyingPrice').isNumeric().withMessage('Buying price must be a number'),
  body('sellingPrice').isNumeric().withMessage('Selling price must be a number'),
  body('lowStockThreshold').optional().isNumeric().withMessage('Low stock threshold must be a number')
];

router.use(protect);

router.get('/', getProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProduct);
router.post('/', productValidation, createProduct);
router.put('/:id', productValidation, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;