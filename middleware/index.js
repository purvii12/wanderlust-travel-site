const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.isListingAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    // Check if listing exists
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    
    // Check if listing has an author
    if (!listing.author) {
      req.flash("error", "you cannot edit this listing!");
      return res.redirect(`/listings/${id}`);
    }
    
    // Check if user is authenticated
    if (!req.user) {
      req.flash("error", "You must be logged in!");
      return res.redirect("/users/login");
    }
    
    // Check if user is the author
    if (!listing.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to do that!");
      return res.redirect(`/listings/${id}`);
    }
    
    next();
  } catch (error) {
    req.flash("error", "Something went wrong!");
    return res.redirect("/listings");
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("back");
    }
    
    if (!review.author) {
      req.flash("error", "This review has no author information!");
      return res.redirect("back");
    }
    
    if (!req.user) {
      req.flash("error", "You must be logged in!");
      return res.redirect("/users/login");
    }
    
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to do that!");
      return res.redirect("back");
    }
    
    next();
  } catch (error) {
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};
