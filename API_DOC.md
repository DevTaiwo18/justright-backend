<!-- Just Right Inventory API Documentation
🔐 Auth Endpoints

    POST /api/auth/login — Authenticate user, returns JWT

    GET /api/auth/profile — Get current user (requires Bearer token)

📦 Product Endpoints

    GET /api/products — List all products

    GET /api/products/:id — Get product by ID

    POST /api/products — Create a product

    PUT /api/products/:id — Update product

    DELETE /api/products/:id — Delete product

📥 Stock In Endpoints

    GET /api/stock-in — List stock-in records (supports pagination & date filtering)

    POST /api/stock-in — Add stock to inventory

📤 Stock Out Endpoints

    GET /api/stock-out — List stock-out records (supports pagination & date filtering)

    POST /api/stock-out — Remove stock from inventory

    POST /api/stock-out/batch — Batch stock out (multiple items in one request)

📊 Reports Endpoints

    GET /api/reports/summary — Get summary report

    GET /api/reports/low-stock — Get products low on stock

    GET /api/reports/stock-movement — Combined view of in/out movement -->