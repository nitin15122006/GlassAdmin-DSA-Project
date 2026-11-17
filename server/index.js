import express from "express";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPool, isDbConfigured } from "./db.js";
import { monthlySales, demoProducts, demoOrders, demoCustomers, demoReviews } from "./data.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 4000);
const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_USERS_FILE = path.join(SERVER_DIR, "users.json");
const DATASET_FILE = path.join(SERVER_DIR, "uploaded-dataset.json");
const JWT_SECRET = process.env.JWT_SECRET || "local-demo-secret-change-before-production";
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "12mb" }));

let localProducts = [...demoProducts];
let localOrders = [...demoOrders];
let localCustomers = [...demoCustomers];
let uploadedDataset = null;
try { uploadedDataset = JSON.parse(await readFile(DATASET_FILE, "utf8")); } catch { uploadedDataset = null; }

function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); cell = "";
      if (row.some(v => v !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim()); if (row.some(v => v !== "")) rows.push(row);
  if (rows.length < 2) throw new Error("CSV must contain a header row and at least one data row.");
  const headers = rows.shift().map(h => h.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"));
  return rows.map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}
const first = (row, names) => { for (const name of names) if (row[name] !== undefined && row[name] !== "") return row[name]; return ""; };
const number = value => { const n = Number(String(value ?? "").replace(/[$,₹£€\s]/g, "")); return Number.isFinite(n) ? n : 0; };
function getDatasetSummary() {
  if (!uploadedDataset) return null;
  const rows = uploadedDataset.rows;
  const categoryMap = new Map(), monthMap = new Map(), regionMap = new Map(), productMap = new Map(), customerMap = new Map();
  let revenue = 0, units = 0;
  const orders = rows.map((r, i) => {
    const date = first(r, ["order_date", "date", "purchase_date", "transaction_date", "created_at"]);
    const product = first(r, ["product", "product_name", "item", "item_name"]) || "Unspecified product";
    const category = first(r, ["category", "product_category", "department"]) || "Uncategorized";
    const quantity = Math.max(0, number(first(r, ["quantity", "qty", "units", "units_sold"])) || 1);
    const price = number(first(r, ["price", "unit_price", "unit_cost", "selling_price"]));
    const explicitSales = first(r, ["sales", "revenue", "amount", "total", "order_value", "total_amount"]);
    const amount = explicitSales !== "" ? number(explicitSales) : quantity * price;
    const orderId = first(r, ["order_id", "order_number", "order_code", "transaction_id"]) || `CSV-${i + 1}`;
    const customer = first(r, ["customer_name", "customer", "customer_id", "email"]) || "Unknown customer";
    const region = first(r, ["region", "state", "city", "location"]) || "Unspecified";
    revenue += amount; units += quantity;
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    regionMap.set(region, (regionMap.get(region) || 0) + amount);
    productMap.set(product, (productMap.get(product) || { name: product, category, price, stock: 0, units_sold: 0, status: "Imported" }));
    const prod = productMap.get(product); prod.units_sold += quantity; if (price) prod.price = price;
    customerMap.set(customer, (customerMap.get(customer) || { name: customer, email: customer.includes("@") ? customer : "", customer_email: customer.includes("@") ? customer : "", lifetime_value: 0, orders: 0, orders_count: 0, region, status: "Active" }));
    const cust = customerMap.get(customer); cust.lifetime_value += amount; cust.orders++; cust.orders_count = cust.orders; cust.region = region;
    let month = "Undated";
    if (date) { const parsed = new Date(date); if (!Number.isNaN(parsed.getTime())) month = parsed.toISOString().slice(0, 7); }
    monthMap.set(month, (monthMap.get(month) || 0) + amount);
    return { order_code: orderId, customer_name: customer, customer_email: customer.includes("@") ? customer : "", payment_method: first(r, ["payment_method", "payment", "method"]) || "Imported", amount, status: first(r, ["status", "order_status", "payment_status"]) || "Imported", order_date: date, product, category, quantity, region };
  });
  const monthlySales = [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({ month: month === "Undated" ? month : new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }), revenue }));
  const products = [...productMap.values()];
  const customers = [...customerMap.values()].map(c => ({ ...c, segment: c.lifetime_value >= 5000 ? "VIP" : c.orders > 1 ? "Returning" : "New" }));
  return { rows, orders, products, customers, monthlySales, categories: [...categoryMap.entries()].map(([name, sales]) => ({ name, sales })).sort((a,b)=>b.sales-a.sales), regions: [...regionMap.entries()].map(([name, sales]) => ({ name, sales })).sort((a,b)=>b.sales-a.sales), revenue, units, orderCount: rows.length, customerCount: customers.length, productCount: products.length };
}
async function saveUploadedDataset(dataset) {
  await writeFile(DATASET_FILE, JSON.stringify(dataset, null, 2), "utf8");
  uploadedDataset = dataset;
}

function signUser(user) {
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role || "admin" }, JWT_SECRET, { expiresIn: "8h" });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role || "admin" } };
}
function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Please sign in to continue." });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: "Session expired. Please sign in again." }); }
}
async function readLocalUsers() {
  try { return JSON.parse(await readFile(LOCAL_USERS_FILE, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
}
async function writeLocalUsers(users) {
  await mkdir(path.dirname(LOCAL_USERS_FILE), { recursive: true });
  await writeFile(LOCAL_USERS_FILE, JSON.stringify(users, null, 2), { encoding: "utf8", mode: 0o600 });
}
async function queryRows(sql, params = []) {
  const pool = await getPool();
  if (!pool) return null;
  const [rows] = await pool.execute(sql, params);
  return rows;
}

app.get("/api/health", async (_req, res) => {
  let db = "demo";
  if (isDbConfigured()) {
    try { await queryRows("SELECT 1"); db = "mysql"; }
    catch { db = "mysql-unavailable"; }
  }
  res.json({ ok: true, database: db, time: new Date().toISOString() });
});

app.post("/api/auth/register", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required." });
  if (name.length > 120) return res.status(400).json({ message: "Name must be 120 characters or fewer." });
  if (email.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
  try {
    const password_hash = await bcrypt.hash(password, 12);
    if (isDbConfigured()) {
      const pool = await getPool();
      try {
        const [result] = await pool.execute("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'analyst')", [name, email, password_hash]);
        return res.status(201).json(signUser({ id: result.insertId, name, email, role: "analyst" }));
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An account with this email already exists. Please sign in instead." });
        throw error;
      }
    }
    const users = await readLocalUsers();
    if (users.some(user => user.email === email) || email === "admin@example.com") return res.status(409).json({ message: "An account with this email already exists. Please sign in instead." });
    const user = { id: Date.now(), name, email, password_hash, role: "analyst", created_at: new Date().toISOString() };
    users.push(user);
    await writeLocalUsers(users);
    return res.status(201).json(signUser(user));
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(503).json({ message: isDbConfigured() ? "Could not create account. Check your MySQL connection." : "Could not save your account. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
  try {
    if (isDbConfigured()) {
      const rows = await queryRows("SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1", [email]);
      const user = rows?.[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: "Invalid email or password." });
      return res.json(signUser(user));
    }
    const users = await readLocalUsers();
    const user = users.find(item => item.email === email);
    if (user && await bcrypt.compare(password, user.password_hash)) return res.json(signUser(user));
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(503).json({ message: isDbConfigured() ? "Could not connect to MySQL. Check your .env settings." : "Could not read local accounts. Please try again." });
  }
  if (email === "admin@example.com" && password === "Admin123!") return res.json(signUser({ id: 1, name: "John Doe", email, role: "admin" }));
  return res.status(401).json({ message: "Invalid email or password. If you are new, create an account first." });
});

app.get("/api/dataset/status", auth, (_req, res) => {
  const summary = getDatasetSummary();
  res.json({ uploaded: Boolean(summary), filename: uploadedDataset?.filename || null, uploadedAt: uploadedDataset?.uploadedAt || null, rows: summary?.rows.length || 0 });
});
app.post("/api/dataset/upload", auth, async (req, res) => {
  try {
    const filename = String(req.body?.filename || "uploaded.csv").replace(/[\\/]/g, "_").slice(0, 120);
    const csv = String(req.body?.csv || "");
    if (!csv.trim()) return res.status(400).json({ message: "Choose a CSV file before uploading." });
    if (Buffer.byteLength(csv, "utf8") > 10 * 1024 * 1024) return res.status(413).json({ message: "CSV is too large. Please upload a file smaller than 10 MB." });
    const rows = parseCsv(csv);
    if (rows.length > 100000) return res.status(400).json({ message: "Maximum supported size is 100,000 data rows." });
    const sample = rows[0];
    const hasSales = ["sales", "revenue", "amount", "total", "order_value", "total_amount"].some(k => sample[k] !== undefined);
    const hasPriceQty = ["price", "unit_price", "unit_cost", "selling_price"].some(k => sample[k] !== undefined) && ["quantity", "qty", "units", "units_sold"].some(k => sample[k] !== undefined);
    if (!hasSales && !hasPriceQty) return res.status(400).json({ message: "CSV needs a Sales/Revenue/Amount column, or both Price and Quantity columns." });
    const dataset = { filename, uploadedAt: new Date().toISOString(), rows };
    await saveUploadedDataset(dataset);
    const summary = getDatasetSummary();
    return res.json({ message: `Imported ${rows.length.toLocaleString()} rows successfully. Dashboard, analytics and forecast now use this dataset.`, filename, rows: rows.length, summary: { revenue: summary.revenue, orders: summary.orderCount, products: summary.productCount, customers: summary.customerCount }, preview: rows.slice(0, 8) });
  } catch (error) { return res.status(400).json({ message: error.message || "Could not process this CSV." }); }
});
app.post("/api/dataset/reset", auth, async (_req, res) => {
  uploadedDataset = null;
  try { await writeFile(DATASET_FILE, "", "utf8"); } catch {}
  res.json({ ok: true, message: "Using built-in demo data again." });
});

app.get("/api/dashboard", auth, async (_req, res) => {
  const summary = getDatasetSummary();
  if (summary) return res.json({
    source: "uploaded", filename: uploadedDataset.filename,
    kpis: [
      { label: "Total Revenue", value: `$${summary.revenue.toLocaleString("en-US", {maximumFractionDigits:2})}`, change: "CSV data", tone: "positive" },
      { label: "Total Orders", value: summary.orderCount.toLocaleString(), change: "Imported rows", tone: "positive" },
      { label: "Customers", value: summary.customerCount.toLocaleString(), change: "Unique customers", tone: "positive" },
      { label: "Products Sold", value: summary.units.toLocaleString(), change: "Units", tone: "positive" }
    ], monthlySales: summary.monthlySales, categories: summary.categories.slice(0, 6), products: summary.products, orders: summary.orders.slice().reverse().slice(0, 8), customers: summary.customers, revenueSample: summary.revenue
  });
  const dbProducts = await queryRows("SELECT * FROM products ORDER BY units_sold DESC");
  const dbOrders = await queryRows("SELECT * FROM orders ORDER BY order_date DESC LIMIT 8");
  const dbCustomers = await queryRows("SELECT * FROM customers ORDER BY lifetime_value DESC");
  const revenue = localOrders.reduce((sum, item) => sum + Number(item.amount), 0);
  res.json({ source: "demo", kpis: [
    { label: "Total Revenue", value: "$124,563.00", change: "+12.5%", tone: "positive" },
    { label: "Total Orders", value: "3,842", change: "+8.2%", tone: "positive" },
    { label: "New Customers", value: "1,257", change: "+15.3%", tone: "positive" },
    { label: "Products Sold", value: "8,492", change: "-2.4%", tone: "negative" }
  ], monthlySales, categories: [{name:"Electronics",sales:42000},{name:"Fashion",sales:31000},{name:"Home & Living",sales:22000},{name:"Beauty",sales:18000}], products: dbProducts || localProducts, orders: dbOrders || localOrders, customers: dbCustomers || localCustomers, revenueSample: revenue });
});

app.get("/api/products", auth, async (_req, res) => {
  const summary = getDatasetSummary(); if (summary) return res.json(summary.products);
  try { const rows = await queryRows("SELECT * FROM products ORDER BY id DESC"); return res.json(rows || localProducts); }
  catch { return res.json(localProducts); }
});
app.post("/api/products", auth, async (req, res) => {
  const { name, category, price, stock, units_sold = 0 } = req.body || {};
  if (!name || !category || Number(price) < 0) return res.status(400).json({ message: "Product name, category and a valid price are required." });
  try {
    const pool = await getPool();
    if (pool) {
      const [result] = await pool.execute("INSERT INTO products (name, category, price, stock, units_sold, status) VALUES (?,?,?,?,?,?)", [name, category, Number(price), Number(stock || 0), Number(units_sold), Number(stock) > 0 ? "Active" : "Out of stock"]);
      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [result.insertId]);
      return res.status(201).json(rows[0]);
    }
  } catch (error) { return res.status(500).json({ message: error.message }); }
  const product = { id: Date.now(), name, category, price: Number(price), stock: Number(stock || 0), units_sold: Number(units_sold), status: Number(stock) > 0 ? "Active" : "Out of stock" };
  localProducts = [product, ...localProducts];
  return res.status(201).json(product);
});
app.delete("/api/products/:id", auth, async (req, res) => {
  try {
    const pool = await getPool();
    if (pool) { await pool.execute("DELETE FROM products WHERE id = ?", [req.params.id]); return res.json({ ok: true }); }
  } catch (error) { return res.status(500).json({ message: error.message }); }
  localProducts = localProducts.filter(p => String(p.id) !== String(req.params.id));
  res.json({ ok: true });
});

app.get("/api/orders", auth, async (_req, res) => {
  const summary = getDatasetSummary(); if (summary) return res.json(summary.orders);
  try { const rows = await queryRows("SELECT * FROM orders ORDER BY order_date DESC"); return res.json(rows || localOrders); }
  catch { return res.json(localOrders); }
});
app.get("/api/customers", auth, async (_req, res) => {
  const summary = getDatasetSummary(); if (summary) return res.json(summary.customers);
  try { const rows = await queryRows("SELECT * FROM customers ORDER BY lifetime_value DESC"); return res.json(rows || localCustomers); }
  catch { return res.json(localCustomers); }
});
app.get("/api/reviews", auth, (_req, res) => res.json(demoReviews));

function linearForecast(series, periods = 6) {
  const points = series.map((item, index) => ({ x: index + 1, y: Number(item.revenue) }));
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumXX = points.reduce((a, p) => a + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from({ length: periods }, (_, i) => {
    const x = n + i + 1;
    return { month: names[(x - 1) % 12], forecast: Math.max(0, Math.round(intercept + slope * x)), kind: "Forecast" };
  });
}
app.get("/api/forecast", auth, (_req, res) => { const summary = getDatasetSummary(); const history = summary?.monthlySales?.length ? summary.monthlySales : monthlySales; res.json({ history, forecast: linearForecast(history, 6), method: "Linear trend regression", source: summary ? "uploaded" : "demo", filename: uploadedDataset?.filename || null }); });

app.get("/api/analytics", auth, (_req, res) => {
  const summary = getDatasetSummary();
  if (summary) return res.json({ categories: summary.categories, segments: [{ name: "Unique customers", value: summary.customerCount }, { name: "Order rows", value: summary.orderCount }], regions: summary.regions, monthlySales: summary.monthlySales, source: "uploaded", filename: uploadedDataset.filename });
  res.json({ categories: [{ name: "Electronics", sales: 42000 }, { name: "Fashion", sales: 31000 }, { name: "Home & Living", sales: 22000 }, { name: "Beauty", sales: 18000 }, { name: "Sports", sales: 12000 }], segments: [{ name: "New", value: 32 }, { name: "Returning", value: 48 }, { name: "VIP", value: 20 }], regions: [{ name: "West", sales: 36000 }, { name: "North", sales: 29000 }, { name: "South", sales: 24000 }, { name: "East", sales: 18000 }], monthlySales, source: "demo" });
});

app.get("/api/settings", auth, (req, res) => res.json({ profile: { name: "John Doe", email: req.user.email, role: req.user.role }, preferences: { compactMode: false, notifications: true, currency: "USD" } }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
