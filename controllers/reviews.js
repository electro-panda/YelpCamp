const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.CreateReview = async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findById(id);
    const { body, rating } = req.body.review;
    const rev = new Review({ body, rating });
    c.reviews.push(rev);
    rev.author = req.user._id;
    await rev.save()
    await c.save();
    req.flash("success", "Successfully created new review");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const c = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const rev = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted the review");
    res.redirect(`/campgrounds/${id}`);
}