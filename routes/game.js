var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = require('../models/games');

router.get('/', /*isLoggedIn,*/ function(req, res, next){

    res.render('games', { title: 'Games', user: req.user });
});

router.post('/', isLoggedIn, function(req, res, next){
    console.log(req.body.name)
    if(!req.body.name){
        var err = new Error('Do you even request bro?');
        err.status = 400;
        err.extramessage = "Please enter a game name"
        res.error = err;
        next();
    }
    else{
        console.log(req.user);
        var newGame = new Game();
        newGame.HasStarted = false;
        newGame.Name = req.body.name;
        newGame._creator = req.user;


        res.send(req.user)
    }
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;