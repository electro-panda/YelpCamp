const Campground = require("../models/campground");
//to remove the images from cloudinary we are going to use the method defined in the cloudinary
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const c = await Campground.find({}).populate("author");
    res.render('campground/index', { c })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campground/new");
}

module.exports.createCamp = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Validation Error Can't Validate because details are not entered properly", 400);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData.features[0].geometry);
    // res.send("OK DONE!!")
    const c = new Campground(req.body.campground);
    c.geometry = geoData.features[0].geometry;
    c.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // for (let image of req.files) {
    //     let obj = { url: image.path, filename: image.filename }
    //     c.images.push(obj);
    // }
    c.author = req.user._id;
    await c.save();
    console.log(c);
    req.flash("success", "Successfully Created")
    res.redirect(`/campgrounds/${c._id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findById(id).populate({
        path: "reviews",   // Populate reviews
        populate: {
            path: "author"  // Nested populate for author inside reviews
        }
    }).populate("author");
    if (!c) {
        req.flash("error", "Campground Not Found!!!");
        res.redirect("/campgrounds");
    }
    res.render('campground/show', { c });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findById(id);
    res.render('campground/edit', { c });
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const c = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    c.geometry = geoData.features[0].geometry;
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        c.images.push(...imgs);
    }
    await c.save();
    if (req.body.deleteImages) {
        for (let images of req.body.deleteImages) {
            await cloudinary.uploader.destroy(images);
        }
        await c.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(c);
    }
    req.flash("success", "Successfully Updated")
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const c = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted the Campground");
    res.redirect("/campgrounds");
}