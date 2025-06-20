const Listing = require("../models/listing");
const Review = require("../models/reviews");


module.exports = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new");
  },

  createListing: async (req, res) => {
    try {
      const geoData = await geocoder.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send();

      const coordinates = geoData.body.features[0].geometry.coordinates;

      const listing = new Listing(req.body.listing);
      listing.geometry = {
        type: "Point",
        coordinates: coordinates
      };
      listing.author = req.user._id;

      if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
      }

      await listing.save();
      req.flash("success", "Successfully created new listing!");
      res.redirect(`/listings/${listing._id}`);
    } catch (e) {
      console.error("Create listing error:", e);
      req.flash("error", "Failed to create listing. Please check your inputs.");
      res.redirect("/listings/new");
    }
  },

  showListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate({
          path: "reviews",
          populate: { path: "author" }
        })
        .populate("author");

      if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
      }

      res.render("listings/show", {
        listing,
        mapToken: process.env.MAPBOX_TOKEN,
        _csrf: req.csrfToken(),
        success: req.flash("success"),
        error: req.flash("error")
      });
    } catch (e) {
      req.flash("error", "Error loading listing details");
      res.redirect("/listings");
    }
  },

  renderEditForm: async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  },

  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
      
      if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
      }
      
      req.flash("success", "Successfully updated listing!");
      res.redirect(`/listings/${listing._id}`);
    } catch (e) {
      console.error("Update listing error:", e);
      req.flash("error", "Failed to update listing.");
      res.redirect(`/listings/${req.params.id}/edit`);
    }
  },

  deleteListing: async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
  }
};
// In controllers/listings.js
index: async (req, res) => {
  let query = {};
  
  // Search by location
  if (req.query.location) {
    query.$or = [
      { location: { $regex: req.query.location, $options: 'i' } },
      { country: { $regex: req.query.location, $options: 'i' } },
      { title: { $regex: req.query.location, $options: 'i' } }
    ];
  }
  
  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
  }
  
  const allListings = await Listing.find(query);
  res.render("listings/index", { allListings });
}
