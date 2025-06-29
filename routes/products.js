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

// Updated validation for simplified schema
const productValidation = [
  body('name').notEmpty().trim().withMessage('Product name is required'),
  body('category').notEmpty().trim().withMessage('Category is required'),
  body('buyingPrice').isNumeric().withMessage('Buying price must be a number').isFloat({ min: 0 }).withMessage('Buying price must be positive'),
  body('sellingPrice').isNumeric().withMessage('Selling price must be a number').isFloat({ min: 0 }).withMessage('Selling price must be positive'),
  body('currentStock').optional().isInt({ min: 0 }).withMessage('Current stock must be a positive integer'),
  body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Low stock threshold must be a positive integer')
];

const updateProductValidation = [
  body('name').optional().notEmpty().trim().withMessage('Product name cannot be empty'),
  body('category').optional().notEmpty().trim().withMessage('Category cannot be empty'),
  body('buyingPrice').optional().isNumeric().withMessage('Buying price must be a number').isFloat({ min: 0 }).withMessage('Buying price must be positive'),
  body('sellingPrice').optional().isNumeric().withMessage('Selling price must be a number').isFloat({ min: 0 }).withMessage('Selling price must be positive'),
  body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Low stock threshold must be a positive integer')
];

router.use(protect);

router.get('/', getProducts);
router.post('/', productValidation, createProduct);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProductValidation, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;