const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema");
const { isLoggedIn, isListingAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const listings = require("../controllers/listings");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg);
  }
  next();
};

router.route("/")
  .get(wrapAsync(listings.index))
  .post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listings.createListing)
  );

router.get("/new", isLoggedIn, listings.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listings.showListing))
  .put(
    isLoggedIn,
    isListingAuthor,
    upload.single('image'),
    validateListing,
    wrapAsync(listings.updateListing)
  )
  .delete(
    isLoggedIn,
    isListingAuthor,
    wrapAsync(listings.deleteListing)
  );

router.get("/:id/edit",
  isLoggedIn,
  isListingAuthor,
  wrapAsync(listings.renderEditForm)
);

module.exports = router;
