const express = require('express');
const { body } = require('express-validator');
const { loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], loginUser);

router.get('/profile', protect, getProfile);

module.exports = router;