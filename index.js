require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./schema/product.js");

const app = express();
app.use(express.json());


app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product পাওয়া যায়নি" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Product ID সঠিক নয়" });
  }
});


app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product পাওয়া যায়নি" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product পাওয়া যায়নি" });
    }
    res.json({ message: "Product মুছে ফেলা হয়েছে" });
  } catch (error) {
    res.status(400).json({ message: "Product ID সঠিক নয়" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server চলছে: http://localhost:${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

startServer();