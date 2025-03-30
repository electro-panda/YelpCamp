const express = require("express");
//After adding mergeParams to true you will able to access the id of campground
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validationOfReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviews = require("../controllers/reviews")

//Adding on Review
router.post("/", isLoggedIn, validationOfReview, catchAsync(reviews.CreateReview));

//Deleting the review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;