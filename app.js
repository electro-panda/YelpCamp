//When we deply our code then we are running our code in production
//its saying if we are not in production mode as for now we are in development mode then require this package
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//Now we will be able to access
// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");
const user = require("./routes/user");
const { storeReturnTo } = require("./middleware")

const dbUrl=process.env.url || 'mongodb://127.0.0.1:27017/yelp-camp';
const Secret=process.env.secret || "thisisalsoasecret";

//requiring another security package helmet that helps to keep our code safe
const helmet=require("helmet");     

//Using mongo-Sanitize to prevent mongo injection
const mongoSanitize=require("express-mongo-sanitize");

//two methods to implement passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const MongoStore = require('connect-mongo');    

const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const campgrounds = require("./routes/campground")
const reviews = require("./routes/review")

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];

const fontSrcUrls=[
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com"
];

// imgSrc: [
//     // all your other existing code
    
//     // add this:
//     "https://api.maptiler.com/",
// ],

//this will enable all the 11 middleware and you won't need to enable them solely
app.use(
    helmet.contentSecurityPolicy({
        directives:{
            defaultSrc:[],
            connectSrc:["'self'",...connectSrcUrls],
            scriptSrc:["'unsafe-inline'","'self'",...scriptSrcUrls],
            styleSrc:["'self'","'unsafe-inline'",...styleSrcUrls],
            workerSrc:["'self'","blob:"],
            objectSrc:[],
            imgSrc:[
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbrfbgob0/",//t  his should be the match of your cloudinary account
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
                "https://cdn-icons-png.flaticon.com/512/2767/2767146.png",
                "https://cdn-icons-png.flaticon.com/512/159/159604.png"
            ],
            fontSrc:["'self'",...fontSrcUrls],
        },
    })
  );app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connection open");
    })
    .catch(e => {
        console.log("Error Found" + e);
    })

const store = MongoStore.create({
        mongoUrl: dbUrl,//in production that should be your mongoAtlas Url
        touchAfter: 24 * 60 * 60,//After a particular period of time session will be updated every time user refreshes a page we can limit the period of time if the data has been changed if not then don't save continuously
        crypto: {
            secret: Secret
        }
    });

//If there is any error this will run
store.on("error",function(e){
    console.log("Session store error:",e);
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Adding on the styles and javascript
app.use(express.static(path.join(__dirname, 'public')))

//This will remove the prohibited character like $ and all 
//you can replace the character rather moving them entirely
app.use(mongoSanitize({
    replaceWith:'_'
}))


//Adding on session
const sessionConfig = {
    store,//defines where the session data will be stored 
    secret: Secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //You can add on the default name for the session on the web so that other person or hacker won't use it for their benefit
        name:'default',
        //This ensure that our cookies are only accessible through http not through javascripts and all
        httpOnly: true,
        //while deplying its necessary till that it isn't
        //secure:true, this will add on the security hence out data will only be accessible through https and will break our code as our local host is not secured and we will not be able to login 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

//Configuring passport
app.use(passport.initialize());
app.use(passport.session());
//authenticate serializer are already in the passport 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//tells how do we store the user in session
passport.deserializeUser(User.deserializeUser());//tells how do we retrieve user in session

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//Authentication route
app.use("/", user)

//Home
app.get('/', (req, res) => {
    res.render("home")
});

//Campground route  
app.use("/campgrounds", campgrounds)


//Review route
app.use("/campgrounds/:id/review", storeReturnTo, reviews);




//For the pages that don't exist
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

//Error Handling
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    //Other then that you can pass err directly 
    if (!err.message) {
        err.message = "Something Went Wrong!!!"
    }
    res.status(status).render("error", { status, err });
    // res.status(status).render("error", { message, status, stock });
})

app.listen(3000, (req, res) => {
    console.log("Listening on 3000");
});