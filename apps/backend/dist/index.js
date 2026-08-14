// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
var app = express();
var port = process.env.PORT || 4e3;
var allowedOrigin = process.env.ALLOWED_FRONTEND_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    credentials: true
  })
);
app.use(express.json());
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "odhvica-backend-api",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/v1/catalogue", (req, res) => {
  const { category, search } = req.query;
  const mockProducts = [
    {
      id: "prod_kantha_01",
      title: "Handcrafted Kantha Quilted Jacket",
      slug: "handcrafted-kantha-jacket",
      price: "14500.00",
      currency: "INR",
      category: "Jackets",
      status: "published"
    },
    {
      id: "prod_kimono_02",
      title: "Block-Printed Artisan Kimono",
      slug: "block-printed-artisan-kimono",
      price: "12000.00",
      currency: "INR",
      category: "Outerwear",
      status: "published"
    }
  ];
  let filtered = mockProducts;
  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
  }
  res.json({
    success: true,
    data: filtered,
    meta: { count: filtered.length }
  });
});
if (process.env.NODE_ENV !== "test") {
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`[Odhvica Backend API] Running on port ${port}`);
  });
}
var index_default = app;
export {
  index_default as default
};
