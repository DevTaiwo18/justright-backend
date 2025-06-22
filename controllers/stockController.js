const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Stock In Controllers
const getStockIns = async (req, res) => {
  try {
    const { page = 1, limit = 50, startDate, endDate } = req.query;
    
    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const stockIns = await StockIn.find(query)
      .populate('product', 'name category packSize')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StockIn.countDocuments(query);

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
      .populate('product', 'name category packSize');

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
    const { page = 1, limit = 50, startDate, endDate } = req.query;
    
    let query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const stockOuts = await StockOut.find(query)
      .populate('product', 'name category packSize sellingPrice')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StockOut.countDocuments(query);

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
        message: `Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`
      });
    }

    // Create stock out record
    const stockOut = await StockOut.create(req.body);

    // Update product current stock
    product.currentStock -= quantity;
    await product.save();

    const populatedStockOut = await StockOut.findById(stockOut._id)
      .populate('product', 'name category packSize sellingPrice');

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

// Batch Stock Out
const createBatchStockOut = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors.array()
      });
    }

    const { sales, date } = req.body; // sales is array of {product, quantity, saleType, notes}
    
    const results = [];
    const processingErrors = [];

    for (let sale of sales) {
      try {
        const product = await Product.findById(sale.product);
        if (!product) {
          processingErrors.push(`Product not found: ${sale.product}`);
          continue;
        }

        if (product.currentStock < sale.quantity) {
          processingErrors.push(`Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${sale.quantity}`);
          continue;
        }

        const stockOut = await StockOut.create({
          ...sale,
          date: date || new Date()
        });

        product.currentStock -= sale.quantity;
        await product.save();

        results.push(stockOut);
      } catch (error) {
        processingErrors.push(`Error processing sale: ${error.message}`);
      }
    }

    res.status(201).json({
      success: true,
      data: {
        processed: results.length,
        total: sales.length,
        sales: results
      },
      errors: processingErrors.length > 0 ? processingErrors : undefined,
      message: `${results.length} sales recorded successfully${processingErrors.length > 0 ? `, ${processingErrors.length} failed` : ''}`
    });
  } catch (error) {
    console.error('Batch stock out error:', error);
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
  createStockOut,
  createBatchStockOut
};