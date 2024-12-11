const mongoose = require("mongoose");

const connectDB = (uri) => {
  try {
    if (!uri) {
      throw new Error("Please provide a valid MongoDB connection string");
    }
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { connectDB };
