var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = require('../models/games');

router.get('/', isLoggedIn, function(req, res, next){
    
    var query = Game.find({});
    query.then(data => {
        res.render('games', { title: 'Games', user: req.user, games: data, challenger: req.challenger });
    });
    
});

router.post('/', isLoggedIn, function(req, res, next){
    if(!req.body.name){
        var err = new Error('Do you even request bro?');
        err.status = 400;
        err.extramessage = "Please enter a game name"
        res.error = err;
        next();
    }
    else{
        saveGame(req, res)        
    }
});

router.put('/', isLoggedIn, function(req, res, next){
    
})

function saveGame(req, res){
    var newGame = new Game();   
    newGame.HasStarted = false;
    newGame.Name = req.body.name;
    newGame._creator = req.user;
    newGame.Created = new Date();
                
    newGame.save(function(error){
        if(error){
            res.status(400);
            res.render('games', { title: 'Games', user: req.user, message: "Name is already taken!"});
        }
        else{
            // We're saved!
            res.redirect('/game');
        }
    });
}


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