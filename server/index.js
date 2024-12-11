require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./helper/db");
const product = require("./Model/product");
const Orders = require("./Model/Orders");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

connectDB(process.env.MONGO_DB);

app.get("/", (req, res) => {
  res.json({
    status: false,
    message: "Server is alive.",
  });
});

app.post("/api/product/add", async (req, res) => {
  try {
    let { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.json({ status: false, message: "Please fill all fields." });
    }

    let newProduct = product.create({
      name: name,
      price: price,
      image: image,
    });

    if (newProduct) {
      return res.json({ status: true, message: "Product added successfully." });
    } else {
      return res.json({ status: false, message: "Failed to add product." });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    let products = await product.find().exec();
    if (products && products.length > 0) {
      res.json({ status: true, message: "Product Found.", data: products });
    } else {
      res.json({ status: false, message: "No product found.", data: [] });
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

// Route to create a payment intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents)
      currency,
    });

    res.json({
      status: true,
      message: "Payment intent created successfully.",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

app.post("/create/order", async (req, res) => {
  try {
    let { email, products, amount } = req.body;

    if (!email || !products) {
      return res.json({ status: false, message: "Please fill all fields." });
    }

    let newOrder = await Orders.create({
      amount: amount,
      email: email,
      status: "pending",
      products: products,
    });

    if (newOrder) {
      return res.json({
        status: true,
        message: "Order created successfully.",
        data: newOrder,
      });
    } else {
      return res.json({ status: false, message: "Failed to create order." });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

app.post("/update/order", async (req, res) => {
  try {
    let { id, status,payId } = req.body;

    if (!id || !status) {
      return res.json({ status: false, message: "Please fill all fields." });
    }

    let updatedOrder = await Orders.findByIdAndUpdate(id, {
      paymentId: payId,
      status: status,
    });

    if (updatedOrder) {
      return res.json({
        status: true,
        message: "Order updated successfully.",
        data: updatedOrder,
      });
    } else {
      return res.json({ status: false, message: "Failed to update order." });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running http://127.0.0.1:${process.env.PORT}.`);
});
