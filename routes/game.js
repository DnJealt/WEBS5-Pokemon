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
        saveGame(req, res, next);
        res.end();
        // // workaround for error handler
        // var err = new Error('nada');
        // err.status = 200;
        // res.error = err;
        // next();
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
        // Game._challenger = req.user;
        // Game.find({id}).update
        pkmns.creator = Math.floor((Math.random() * 721) + 1 );
        pkmns.challenger = Math.floor((Math.random() * 721) + 1 );
        
        Game.findByIdAndUpdate(id, { $set: { _challenger: req.user}}, { new: true}, function(err, gameupdate) {
            if (err) return handleError(err);
            res.send(gameupdate);
            console.log('in findbyid: ' + id);
            res.redirect('/game');
            // <script src="/socket.io/socket.io.js"></script>
            // var socket = io.connect('http://localhost');
                // io.emit('refresh');
        });
        
    };
    console.log('na findbyid: ' + id);
});

function saveGame(req, res, next){
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
            socket.gameAdded(game);
            // return;
            // res.redirect('/game');
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