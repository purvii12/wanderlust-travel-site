const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  
  const review = new Review(req.body);
  listing.reviews.push(review);
  await Promise.all([review.save(), listing.save()]);
  
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

router.post("/:reviewId/delete", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
