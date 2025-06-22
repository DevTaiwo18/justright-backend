// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
 

app.use(cors({
  origin: ['http://localhost:5173', 'https://justright-frontend.vercel.app'], // Add all frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Body parsing middleware
app.use(express.json());

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/stock-in', require('./routes/stockIn'));
app.use('/api/stock-out', require('./routes/stockOut'));
app.use('/api/reports', require('./routes/reports'));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Just Right Inventory API is running!' });
});

module.exports = app;
