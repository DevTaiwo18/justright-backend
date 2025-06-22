const express = require('express');
const { body } = require('express-validator');
const { 
  getStockOuts, 
  createStockOut, 
  createBatchStockOut 
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const stockOutValidation = [
  body('product').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('saleType').optional().isIn(['retail', 'wholesale']).withMessage('Sale type must be retail or wholesale'),
  body('notes').optional().trim(),
  body('date').optional().isISO8601().withMessage('Date must be valid')
];

const batchStockOutValidation = [
  body('sales').isArray({ min: 1 }).withMessage('Sales array is required'),
  body('sales.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('sales.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('sales.*.saleType').optional().isIn(['retail', 'wholesale']),
  body('date').optional().isISO8601().withMessage('Date must be valid')
];

router.use(protect);

router.get('/', getStockOuts);
router.post('/', stockOutValidation, createStockOut);
router.post('/batch', batchStockOutValidation, createBatchStockOut);

module.exports = router;