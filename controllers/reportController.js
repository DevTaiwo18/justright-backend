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
    
    const todayStockIns = await StockIn.countDocuments({
      date: { $gte: today }
    });

    // Calculate total stock value
    const products = await Product.find({}, 'currentStock buyingPrice sellingPrice');
    const totalStockValue = products.reduce((sum, product) => {
      return sum + (product.currentStock * product.buyingPrice);
    }, 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        todaySales,
        todayStockIns,
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

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;
    
    let matchStage = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Group by period
    let groupBy;
    switch (period) {
      case 'weekly':
        groupBy = { 
          year: { $year: '$date' },
          week: { $week: '$date' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        break;
      default: // daily
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        };
    }

    const salesData = await StockOut.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: groupBy,
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { 
            $sum: { $multiply: ['$quantity', '$productInfo.sellingPrice'] }
          },
          totalSales: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    let matchStage = {};
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const topProducts = await StockOut.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$quantity' },
          totalSales: { $sum: 1 }
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
          totalQuantity: 1,
          totalSales: 1,
          revenue: { $multiply: ['$totalQuantity', '$productInfo.sellingPrice'] }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
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
    const { category } = req.query;
    
    let query = {};
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    const products = await Product.find(query, {
      name: 1,
      category: 1,
      currentStock: 1,
      lowStockThreshold: 1,
      buyingPrice: 1,
      sellingPrice: 1
    }).sort({ category: 1, name: 1 });

    const report = products.map(product => ({
      ...product.toObject(),
      stockValue: product.currentStock * product.buyingPrice,
      isLowStock: product.currentStock <= product.lowStockThreshold
    }));

    const summary = {
      totalProducts: products.length,
      totalStockValue: report.reduce((sum, item) => sum + item.stockValue, 0),
      lowStockItems: report.filter(item => item.isLowStock).length
    };

    res.json({
      success: true,
      data: {
        products: report,
        summary
      }
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
  getSalesReport,
  getTopSellingProducts,
  getInventoryReport
};
