const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

// Listings routes
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

router.get("/new", (req, res) => {
  res.render("listings/new", { 
    error: req.query.error || "",
    csrfToken: req.csrfToken()
  });
});

router.post("/", validateListing, wrapAsync(async (req, res) => {
  const { image, ...rest } = req.body;
  const newListing = new Listing({ ...rest, image: { url: image } });
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
}));

router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/show", { listing });
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { listing });
}));

router.post("/:id", validateListing, wrapAsync(async (req, res) => {
  const { image, ...rest } = req.body;
  await Listing.findByIdAndUpdate(req.params.id, { ...rest, image: { url: image } });
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${req.params.id}`);
}));

router.post("/:id/delete", wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;
