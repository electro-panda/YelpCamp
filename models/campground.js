const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


//We can also request the cloudinary transformation api to request the change in the pixel of image by creating the virtual property
const Images = new Schema({
    url: String,
    filename: String
})

//w_200 will transform the images into 200 px and then transfer
//virtual is used because it ensures that we are not storing the data on our database rather then we are deriving it when called
Images.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };//its virtuals not virtual remember

const CampgroundSchema = new Schema({
    title: String,
    images: [Images],
    geometry: {
        type: {
            type: String,//Don't do location:{type:String} because location is an object
            enum: ["Point"],//Type can only be point remember
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<a href="campgrounds/${this._id}"><img style="width:150px;height=50px;" src=${this.images[0].url}></a><br><a href="campgrounds/${this._id}">${this.title}</a><p>${this.location}</p>`;   
})

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (!doc) {
        console.log("No document found for deletion.");
        return; // Prevents errors if no campground was found
    }

    if (doc.reviews && doc.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);