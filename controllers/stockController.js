const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Stock In Controllers
const getStockIns = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const stockIns = await StockIn.find()
      .populate('product', 'name category')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StockIn.countDocuments();

    res.json({
      success: true,
      data: stockIns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get stock ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createStockIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { product: productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create stock in record
    const stockIn = await StockIn.create(req.body);

    // Update product current stock
    product.currentStock += quantity;
    await product.save();

    const populatedStockIn = await StockIn.findById(stockIn._id)
      .populate('product', 'name category');

    res.status(201).json({
      success: true,
      data: populatedStockIn,
      message: 'Stock added successfully'
    });
  } catch (error) {
    console.error('Create stock in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Stock Out Controllers
const getStockOuts = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const stockOuts = await StockOut.find()
      .populate('product', 'name category sellingPrice')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StockOut.countDocuments();

    res.json({
      success: true,
      data: stockOuts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get stock outs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createStockOut = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { product: productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if sufficient stock available
    if (product.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Available: ${product.currentStock}, Requested: ${quantity}`
      });
    }

    // Create stock out record
    const stockOut = await StockOut.create(req.body);

    // Update product current stock
    product.currentStock -= quantity;
    await product.save();

    const populatedStockOut = await StockOut.findById(stockOut._id)
      .populate('product', 'name category sellingPrice');

    res.status(201).json({
      success: true,
      data: populatedStockOut,
      message: 'Sale recorded successfully'
    });
  } catch (error) {
    console.error('Create stock out error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getStockIns,
  createStockIn,
  getStockOuts,
  createStockOut
};