const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  packSize: {
    type: String,
    required: true,
    trim: true
  },
  buyingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  currentStock: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster searches
ProductSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model('Product', ProductSchema);