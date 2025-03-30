const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.Register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        //req.login will automatically login the user on register
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to Yelp Camp");
            res.redirect('/campgrounds');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.Login = (req, res) => { 
    req.flash("success", "Welcome Back");
    let redirectUrl = res.locals.returnTo;
    if (redirectUrl == "/login") {
        redirectUrl = "/campgrounds";
    }
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye");
        res.redirect("/campgrounds");
    });
}