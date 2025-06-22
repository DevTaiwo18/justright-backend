const express = require('express');
const { body } = require('express-validator');
const { getStockIns, createStockIn } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const stockInValidation = [
  body('product').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('supplier').optional().trim(),
  body('notes').optional().trim(),
  body('date').optional().isISO8601().withMessage('Date must be valid')
];

router.use(protect);

router.get('/', getStockIns);
router.post('/', stockInValidation, createStockIn);

module.exports = router;