const express = require('express');
const { 
  getDashboardStats,
  getTopSellingProducts,
  getInventoryReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/top-selling', getTopSellingProducts);
router.get('/inventory', getInventoryReport);

module.exports = router;