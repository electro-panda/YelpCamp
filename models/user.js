const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//this will add on password feild which will also see that username are unique
//Adds Username & Password Fields Automatically
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);