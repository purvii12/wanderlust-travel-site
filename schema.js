const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required."
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required."
  }),
  image: Joi.string().allow("", null).uri().messages({
    "string.uri": "Image must be a valid URL."
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number.",
    "number.min": "Price must be at least 0.",
    "any.required": "Price is required."
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required."
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required."
  })
});
const reviewSchema = Joi.object({
  comment: Joi.string().required().messages({
    "string.empty": "Comment is required."
  }),
  rating: Joi.number().required().min(1).max(5).messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating cannot exceed 5.",
    "any.required": "Rating is required."
  })
}).unknown(true);

module.exports = { listingSchema , reviewSchema };
