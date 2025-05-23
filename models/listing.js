// models/listing.js (Optimized)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
      set: v => v || "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
    },
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
});

module.exports = mongoose.model("Listing", listingSchema);
