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


router.post('/delete/:id', isAdmin, function(req, res, next){
    var id = req.params.id;
    if(id){
        Game.findByIdAndRemove(id, function(error, document){
            if(error){
                console.log(error);
                next();
            }
            else{
                res.redirect('/game');
            }
        });
        
    }

    
});

router.post('/put/:id', isLoggedIn, function(req, res, next){
    var id = req.params.id;
    console.log('Voor findbyid: ' + id);
    if(id){
        // Game._challenger = req.user;
        // Game.find({id}).update
        
        Game.findByIdAndUpdate(id, { $set: { _challenger: req.user}}, { new: true}, function(err, gameupdate) {
            if (err) return handleError(err);
            res.send(gameupdate);
            console.log('in findbyid: ' + id);
        });
        
    };
    console.log('na findbyid: ' + id);
});

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

// route middleware to make sure a user is logged in
function isAdmin(req, res, next) {
    console.log(req.user)
    if(req.user){
        if(req.user.role == 'admin');{
            return next();
        }
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;