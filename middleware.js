const { campgroundSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    } else {
        res.locals.returnTo = req.session.returnTo = req.originalUrl;  // ✅ Always save requested URL
    }
    next();
};


//We are gonna validate the schema now through the use of middleware
module.exports.validationOfSchema = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const c = await Campground.findById(id);
    if (!c.author.equals(req.user._id)) {
        req.flash("error", "You can't Edit this!!!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validationOfReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const rev = await Review.findById(reviewId);
    if (!rev.author.equals(req.user._id)) {
        req.flash("error", "You can't delete this Review!!!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
