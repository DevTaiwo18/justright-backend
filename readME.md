<!-- 
File Stucture:
/*
just-right-inventory/
├── package.json
├── .env
├── server.js
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── StockIn.js
│   └── StockOut.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── stockIn.js
│   ├── stockOut.js
│   └── reports.js
├── middleware/
│   └── auth.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── stockController.js
│   └── reportController.js
└── utils/
    └── helpers.js
*/

// =================
// Setup Instructions
// =================

/*
SETUP INSTRUCTIONS:

1. Install dependencies:
   npm install express mongoose bcryptjs jsonwebtoken express-validator cors dotenv

2. Create .env file with your MongoDB connection string:
   MONGODB_URI=mongodb://localhost:27017/just-right-inventory
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000

3. Create admin user (run this script once):
   Create a file called createAdmin.js:
*/

// createAdmin.js - Run this once to create admin user
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      password: 'admin123', // Change this password!
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

/*
4. Run the admin creation script:
   node createAdmin.js

5. Start the server:
   npm run dev (for development with nodemon)
   npm start (for production)

6. Test the API:
   The server will run on <http://localhost:5000>

   API Endpoints:
   - POST /api/auth/login - Login
   - GET /api/auth/profile - Get user profile
   - GET /api/products - Get all products
   - POST /api/products - Create product
   - GET /api/products/low-stock - Get low stock products
   - POST /api/stock-in - Add stock
   - POST /api/stock-out - Record sale
   - POST /api/stock-out/batch - Record multiple sales
   - GET /api/reports/dashboard - Dashboard stats
   - GET /api/reports/sales - Sales report
   - GET /api/reports/top-selling - Top selling products
   - GET /api/reports/inventory - Inventory report

7. Sample requests:

   Login:
   POST /api/auth/login
   {
     "username": "admin",
     "password": "admin123"
   }

   Create Product:
   POST /api/products
   Headers: Authorization: Bearer <token>
   {
     "name": "Coca Cola",
     "category": "Drinks",
     "packSize": "35cl",
     "buyingPrice": 100,
     "sellingPrice": 150,
     "supplier": "Coca Cola Nigeria",
     "lowStockThreshold": 10
   }

   Add Stock:
   POST /api/stock-in
   Headers: Authorization: Bearer <token>
   {
     "product": "product_id_here",
     "quantity": 50,
     "supplier": "Coca Cola Nigeria",
     "notes": "Weekly stock delivery"
   }

   Record Sale:
   POST /api/stock-out
   Headers: Authorization: Bearer <token>
   {
     "product": "product_id_here",
     "quantity": 5,
     "saleType": "retail",
     "notes": "End of day sales"
   }

   Batch Sales:
   POST /api/stock-out/batch
   Headers: Authorization: Bearer <token>
   {
     "sales": [
       {
         "product": "product_id_1",
         "quantity": 3,
         "saleType": "retail"
       },
       {
         "product": "product_id_2",
         "quantity": 2,
         "saleType": "wholesale"
       }
     ],
     "date": "2024-01-15T10:00:00Z"
   }

8. Database Collections:
   - users: Store admin credentials
   - products: Store product information
   - stockins: Store incoming stock records
   - stockouts: Store sales/outgoing stock records

9. Key Features Implemented:
   ✅ JWT Authentication
   ✅ Product Management (CRUD)
   ✅ Stock In/Out tracking
   ✅ Automatic stock calculation
   ✅ Low stock alerts
   ✅ Batch sales recording
   ✅ Dashboard statistics
   ✅ Sales reports
   ✅ Inventory reports
   ✅ Top selling products
   ✅ Input validation
   ✅ Error handling
   ✅ Pagination
   ✅ Search and filtering

10. Security Features:
    ✅ Password hashing with bcrypt
    ✅ JWT token authentication
    ✅ Input validation and sanitization
    ✅ Protected routes
    ✅ Error handling without exposing sensitive data

This backend is production-ready and includes all the features mentioned in your requirements. 
*/ -->
