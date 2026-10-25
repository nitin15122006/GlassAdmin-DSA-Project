# GlassAdmin — E-Commerce Sales Forecasting & Customer Insights

A ready-to-run React + Tailwind dashboard with eight application pages, charts, a Node/Express API, JWT login, optional MySQL persistence, CSV export, and a basic linear-regression forecast.

## Requirements
- Node.js 18+ (recommended 20 LTS)
- npm
- Optional: MySQL 8+

## Run it
1. Extract the ZIP and open the project folder in VS Code.
2. Open the terminal in that folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env`.
5. Start both frontend and backend:
   ```bash
   npm run dev
   ```
6. Open http://localhost:5173

### Demo login
- Email: `admin@example.com`
- Password: `Admin123!`

The demo account is enabled in demo mode when MySQL is not configured. For a real deployment, configure MySQL and create a user with a bcrypt password hash. Do not use demo credentials or the example JWT secret in production.

## MySQL setup (optional)
1. Start MySQL.
2. Run `database/schema.sql` in MySQL Workbench.
3. Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.
4. Restart `npm run dev`.

When the database is configured, the API reads/writes products, orders and customers through MySQL. To seed initial rows, run `database/seed.sql` after `schema.sql`. Create a user record using a bcrypt hash (see below).

### Generate a password hash
Run:
```bash
node -e "import('bcryptjs').then(async b => console.log(await b.hash('ChangeMe123!', 10)))"
```
Insert the output into the `users.password_hash` field, with your preferred email and name.

## Pages
1. Dashboard
2. Products
3. Orders
4. Customers
5. Analytics
6. Sales Forecast
7. Reviews
8. Settings

## Notes
- All displayed business data is sample/demo data unless connected to your own database.
- Forecasting is an illustrative linear trend model for a student project, not a guarantee of future sales.
- Login is suitable for local development demonstration. Add HTTPS, rate limiting, secure cookies, validation, and production secrets before deployment.
- Charts use Recharts; the UI uses Tailwind and Lucide icons.


## Import your own CSV dataset

1. Start the app with `npm install` then `npm run dev`.
2. Sign in or create an account. Open **Dataset Upload** from the sidebar.
3. Upload `sample-ecommerce-dataset.csv` or your own CSV file.
4. The Dashboard, Analytics, Products, Orders, Customers and Sales Forecast pages will use the uploaded data. A new upload replaces the currently active dataset.
5. The uploaded dataset is stored locally in `server/uploaded-dataset.json`. To return to sample demo data, choose **Reset to demo data** on Dataset Upload.

### Supported CSV columns

Required for revenue: `Sales` / `Revenue` / `Amount`, or both `Price` and `Quantity`. Recommended columns include `Order Date`, `Order ID`, `Customer Name`, `Product`, `Category`, `Region`, and `Status`. Common aliases such as `Date`, `Product Name`, `Qty`, `Unit Price`, `Total`, `State`, and `City` are also supported. Files are limited to 10 MB and 100,000 rows.

### DSA concepts to explain

- **Hash-map aggregation:** one-pass grouping of rows into monthly, category, region, product and customer totals (average O(n)).
- **Sorting:** ranking category and regional sales (O(k log k) for k groups).
- **Linear regression:** least-squares trend line fitted to monthly revenue to estimate the next six periods.

The forecasting feature is an educational baseline, not financial advice. Validate data quality and model error before relying on predictions.
