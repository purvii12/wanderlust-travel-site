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
  },
  category: {
  type: String,
  enum: ['beach', 'mountain', 'city', 'countryside', 'all'],
  default: 'all'
  }

});

module.exports = mongoose.model("Listing", listingSchema);