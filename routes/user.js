/**
 * @swagger
 * /user/user:
 *   get:
 *     tags:
 *       - user
 *     description: Get all the pokemon from the user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: pokemons returned
 * 
 * /user/user/login:
 *   get:
 *     tags:
 *       - user
 *     description: Gets the login page
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: login page returned
 * 
 *   post:
 *     tags:
 *       - user
 *     description: Jelte?
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: passport.authentication
 *         description: authentication of the login
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       201:
 *         description: Jelte?
 * 
 * /user/user/signup:
 *   get:
 *     tags:
 *       - signup
 *     description: Gets the signup page
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: signup page returned
 * 
 *   post:
 *     tags:
 *       - signup
 *     description: Crate user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: passport.authentication
 *         description: authentication of the signup
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       201:
 *         description: User created
 *       500:
 *         description: Internal server error user not created
 * 
 * /user/user/auth/google:
 *   get:
 *     tags:
 *       - google
 *     description: Jelte?
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: passport.authentication
 *         description: authentication of google
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       200:
 *         description: Jelte?
 * 
 * /user/user/auth/google/callback:
 *   get:
 *     tags:
 *       - google
 *     description: login via google
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: passport.authentication
 *         description: authentication of google
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       200:
 *         description: Goes to user page
 */
var express = require('express');
var router = express.Router();
var User = require('../models/users');

module.exports = function(app, passport) {

// =====================================
// USER PAGE ===========================
// =====================================
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
    // GOOGLE ==============================
    // =====================================
      app.get('/user/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

       app.get('/user/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/user/profile',
                    failureRedirect : '/user/'
            }));

    // =====================================
    // FACEBOOK ============================
    // =====================================
    // route for facebook authentication and login
    app.get('/user/auth/fb', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/user/auth/fb/callback',
        passport.authenticate('facebook', {
            successRedirect : '/user/profile',
            failureRedirect : '/user'
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
    app.get('/user/logout', function(req, res) {
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
