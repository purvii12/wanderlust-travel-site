const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new");
  },

  createListing: async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.author = req.user._id;
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();
    req.flash("success", "Successfully created new listing!");
    res.redirect(`/listings/${listing._id}`);
  },

  showListing: async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  },

  renderEditForm: async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { listing });
  },

  updateListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${listing._id}`);
  },

  deleteListing: async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
  }
};
