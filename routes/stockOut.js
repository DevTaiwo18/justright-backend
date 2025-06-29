const express = require('express');
const { body } = require('express-validator');
const { 
  getStockOuts, 
  createStockOut 
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const stockOutValidation = [
  body('product').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('date').optional().isISO8601().withMessage('Date must be valid')
];

router.use(protect);

router.get('/', getStockOuts);
router.post('/', stockOutValidation, createStockOut);

module.exports = router;