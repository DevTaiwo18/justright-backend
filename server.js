// server.js
const app = require('./app');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
