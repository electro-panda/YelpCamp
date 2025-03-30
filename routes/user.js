const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const passport = require("passport");
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users")

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.Register))

router.route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), users.Login)

// router.get("/register", users.renderRegister);

// router.post("/register", catchAsync(users.Register));

// router.get("/login", users.renderLogin)

// router.post("/login", storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), users.Login)

router.get("/logout", users.logout)

module.exports = router;
