const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const Product = require('../models/Product');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$currentStock', '$lowStockThreshold'] }
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = await StockOut.countDocuments({
      date: { $gte: today }
    });

    // Calculate total stock value
    const products = await Product.find({}, 'currentStock buyingPrice');
    const totalStockValue = products.reduce((sum, product) => {
      return sum + (product.currentStock * product.buyingPrice);
    }, 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        todaySales,
        totalStockValue
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await StockOut.aggregate([
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          name: '$productInfo.name',
          category: '$productInfo.category',
          totalQuantity: 1
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Top selling products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({}, {
      name: 1,
      category: 1,
      currentStock: 1,
      lowStockThreshold: 1,
      buyingPrice: 1,
      sellingPrice: 1
    }).sort({ name: 1 });

    const report = products.map(product => ({
      name: product.name,
      category: product.category,
      currentStock: product.currentStock,
      lowStockThreshold: product.lowStockThreshold,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      isLowStock: product.currentStock <= product.lowStockThreshold
    }));

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getTopSellingProducts,
  getInventoryReport
};