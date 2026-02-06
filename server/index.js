require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { init, runAsync, getAsync, allAsync } = require("./db");

const app = express();
const port = process.env.PORT || 4000;

init();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "ecom-admin backend running" });
});

// Products
app.get("/api/products", async (req, res) => {
  const rows = await allAsync("SELECT * FROM products ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/products/:id", async (req, res) => {
  const row = await getAsync("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json(row);
});

app.post("/api/products", async (req, res) => {
  const { name, sku, price = 0, stock = 0 } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });
  const result = await runAsync(
    "INSERT INTO products (name, sku, price, stock) VALUES (?, ?, ?, ?)",
    [name, sku || null, price, stock]
  );
  const row = await getAsync("SELECT * FROM products WHERE id = ?", [
    result.id,
  ]);
  res.status(201).json(row);
});

app.put("/api/products/:id", async (req, res) => {
  const { name, sku, price, stock } = req.body || {};
  const existing = await getAsync("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);
  if (!existing) return res.status(404).json({ error: "Product not found" });
  const next = {
    name: name ?? existing.name,
    sku: sku ?? existing.sku,
    price: price ?? existing.price,
    stock: stock ?? existing.stock,
  };
  await runAsync(
    "UPDATE products SET name = ?, sku = ?, price = ?, stock = ? WHERE id = ?",
    [next.name, next.sku, next.price, next.stock, req.params.id]
  );
  const row = await getAsync("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);
  res.json(row);
});

app.delete("/api/products/:id", async (req, res) => {
  const result = await runAsync("DELETE FROM products WHERE id = ?", [
    req.params.id,
  ]);
  if (!result.changes) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
});

// Users
app.get("/api/users", async (req, res) => {
  const rows = await allAsync("SELECT * FROM users ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/users/:id", async (req, res) => {
  const row = await getAsync("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  if (!row) return res.status(404).json({ error: "User not found" });
  res.json(row);
});

app.post("/api/users", async (req, res) => {
  const { name, email, role = "staff" } = req.body || {};
  if (!name || !email)
    return res.status(400).json({ error: "name and email are required" });
  try {
    const result = await runAsync(
      "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
      [name, email, role]
    );
    const row = await getAsync("SELECT * FROM users WHERE id = ?", [
      result.id,
    ]);
    res.status(201).json(row);
  } catch (err) {
    if (String(err.message || "").includes("UNIQUE"))
      return res.status(409).json({ error: "email already exists" });
    throw err;
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { name, email, role } = req.body || {};
  const existing = await getAsync("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  if (!existing) return res.status(404).json({ error: "User not found" });
  const next = {
    name: name ?? existing.name,
    email: email ?? existing.email,
    role: role ?? existing.role,
  };
  await runAsync(
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [next.name, next.email, next.role, req.params.id]
  );
  const row = await getAsync("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  res.json(row);
});

app.delete("/api/users/:id", async (req, res) => {
  const result = await runAsync("DELETE FROM users WHERE id = ?", [
    req.params.id,
  ]);
  if (!result.changes) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true });
});

// Orders
app.get("/api/orders", async (req, res) => {
  const rows = await allAsync("SELECT * FROM orders ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/orders/:id", async (req, res) => {
  const row = await getAsync("SELECT * FROM orders WHERE id = ?", [
    req.params.id,
  ]);
  if (!row) return res.status(404).json({ error: "Order not found" });
  res.json(row);
});

app.post("/api/orders", async (req, res) => {
  const { order_number, status = "pending", total = 0 } = req.body || {};
  if (!order_number)
    return res.status(400).json({ error: "order_number is required" });
  const result = await runAsync(
    "INSERT INTO orders (order_number, status, total) VALUES (?, ?, ?)",
    [order_number, status, total]
  );
  const row = await getAsync("SELECT * FROM orders WHERE id = ?", [
    result.id,
  ]);
  res.status(201).json(row);
});

app.put("/api/orders/:id", async (req, res) => {
  const { order_number, status, total } = req.body || {};
  const existing = await getAsync("SELECT * FROM orders WHERE id = ?", [
    req.params.id,
  ]);
  if (!existing) return res.status(404).json({ error: "Order not found" });
  const next = {
    order_number: order_number ?? existing.order_number,
    status: status ?? existing.status,
    total: total ?? existing.total,
  };
  await runAsync(
    "UPDATE orders SET order_number = ?, status = ?, total = ? WHERE id = ?",
    [next.order_number, next.status, next.total, req.params.id]
  );
  const row = await getAsync("SELECT * FROM orders WHERE id = ?", [
    req.params.id,
  ]);
  res.json(row);
});

app.delete("/api/orders/:id", async (req, res) => {
  const result = await runAsync("DELETE FROM orders WHERE id = ?", [
    req.params.id,
  ]);
  if (!result.changes) return res.status(404).json({ error: "Order not found" });
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
