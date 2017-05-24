/**
 * @swagger
 * /game:
 *   get:
 *     tags:
 *       - games
 *     description: Get all games
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isLoggedIn
 *         description: Checking if a user is logged in
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       200:
 *         description: games returned
 * 
 *   post:
 *     tags:
 *       - games
 *     description: Creates a game
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isLoggedIn
 *         description: Checking if a user is logged in
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       201:
 *         description: game created
 *       500:
 *         description: Internal server error game not created
 * 
 * /game/delete:
 *     tags:
 *       - games
 *     description: Deletes a game
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isAdmin
 *         description: Checking if the user is an admin
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       200:
 *         description: game deleted
 *       500:
 *         description: Internal server error game not deleted
 * 
 * /game/join:
 *     tags:
 *       - games
 *     description: user can join a game
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isLoggedIn
 *         description: Checking if a user is logged in
 *         in: body
 *         required: true
 *         type: boolean
 *     responses:
 *       200:
 *         description: game joined
 *       500:
 *         description: Internal server error game is not joined
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = require('../models/games');
var send = require('../models/headerAccept');
var socket = require('../config/socket')();

router.get('/', isLoggedIn, function(req, res, next){
    
    var query = Game.find({});
    query.then(data => {
        // Initiate accept header middleware
        req.page = 'games';
        req.pagetitle = 'Games';
        req.data = data;
        send.response(req, res);
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
        saveGame(req, res);
        // res.end();
    }
});


router.post('/delete', isAdmin, function(req, res, next){
    var id = req.body.id;
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

router.post('/:id/join', isLoggedIn, function(req, res, next){
    var id = req.params.id;
    var pkmns;
    console.log('Voor findbyid: ' + id);
    if(id){
       Game.findById(id, function(error, response){
            if(error){
                req.data = {error: "Game not found"};
                req.page = "games"
                req.pagetitle = "Games"
                req.message = "Game not found"
                send.response(req, res);
            }
            else{
                // an == operator does not suffice because of the MongoDB ObjectID custom type, therefore use equals
                if(response._creator._id.equals(req.user._id)){
                    req.data = {error: "cannot join your own game"};
                    req.page = "games"
                    req.pagetitle = "Games"
                    req.message = "Cannot join your own game"
                    send.response(req, res);
                }
                else{
                    response._challenger = req.user;
                    response.save();
                    res.redirect('/game');
                }
            }
        });
    }
});

function saveGame(req, res){
    var newGame = new Game();   
    newGame.HasStarted = false;
    newGame.Name = req.body.name;
    newGame._creator = req.user;
    newGame.Created = new Date();
    console.log("Saves game");            
    newGame.save(function(error, game){
        if(error){
            res.status(400);
            req.page = 'games';
            req.pagetitle = 'Games';
            req.message = "Name is already taken!";
            req.data = {error: "name is already taken"};
            send.response(req, res);
        }
        else{
            // We're saved!
            // socket.gameAdded(game);
            // return;
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

// route middleware to make sure a user is admin
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