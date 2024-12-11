const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [productSchema],
});

module.exports = mongoose.model("Order", orderSchema);
