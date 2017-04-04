var express = require('express');
var router = express.Router();
var User = require('../models/users');

module.exports = function(app, passport) {

// =====================================
// HOME PAGE (with login links) ========
// =====================================
    // Testing if redirects work this way
    app.get('/user/auth/fb', function(req, res){
         res.redirect('/user', 301);
    });
    app.get('/user/auth/google', function(req, res){
         res.redirect('/user', 301);
    });


    app.get('/user', function(req, res){
        res.render('users', { title: "Pokemon!" });
    });


    app.get('/user/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        //res.render('login');
      console.log('komen we hier?');
        var message = req.flash('loginMessage');
        res.render('login', { message: message, title: "Local Login" }); 
    });

    // process the login form
    app.post('/user/login', passport.authenticate('local-login', {
        successRedirect : '/user/profile', // redirect to the secure profile section
        failureRedirect : '/user/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/user/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage'), title: "Local signup" });
    });

    // process the signup form
     app.post('/user/signup', passport.authenticate('local-signup', {         
        successRedirect : '/user/profile', // redirect to the secure profile section
        failureRedirect : '/user/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
     }));

        // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/user/profile', isLoggedIn, function(req, res) {
        res.render('profile', { user: req.user});
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/user');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/user');
}
