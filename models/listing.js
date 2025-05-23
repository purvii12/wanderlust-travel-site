const mongoose = require("mongoose");
const Review = require("./reviews");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Make this required
  }
});

module.exports = mongoose.model("Listing", listingSchema);