const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validationOfSchema } = require("../middleware.js");
const campgrounds = require("../controllers/campground");
const multer = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage })


// All Campgrounds and creating campground
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("images"), validationOfSchema, catchAsync(campgrounds.createCamp))


//Create new Data this will go before our show page route as it might think that new is id rather then the way to render the create camp page  
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//show Update Delete
router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array("images"), validationOfSchema, catchAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

//Update the Data
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//All Campgrounds
// router.get('/', catchAsync(campgrounds.index));

//Joi it is a tricky part Kindly go through whenever want to use Section-43:461
// router.post('/', isLoggedIn, validationOfSchema, catchAsync(campgrounds.createCamp));


//Show Page
// router.get('/:id', catchAsync(campgrounds.show));


// router.put('/:id', isLoggedIn, isAuthor, validationOfSchema, catchAsync(campgrounds.edit))

//Delete the data
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
