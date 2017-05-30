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
var async = require('async');
var request = require('request');
var simulator = require('../models/simulator');

var protocol;
var host;

var countPokemon = 721;

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

    // Fetch the protocol and host for dynamic URLs
    protocol = req.protocol;
    host = req.get('host');

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
                // An == operator does not suffice because of the MongoDB ObjectID custom type, therefore use .equals()
                if(response._creator._id.equals(req.user._id)){
                    req.data = {error: "cannot join your own game"};
                    req.page = "games"
                    req.pagetitle = "Games"
                    req.message = "Cannot join your own game"
                    send.response(req, res);
                }
                else{
                    // All good, we can join now
                    response._challenger = req.user; 

                    // Generate 2 random pokemon IDs
                    const ids = [
                        Math.floor((Math.random() * countPokemon) + 1 ),
                        Math.floor((Math.random() * countPokemon) + 1 )
                    ];

                    // Make sure that the async requests are waited on
                    async.map(ids, getPokemon, function(err, result){
                        if (err){
                            res.send({error: err});
                        } 
                        response.creatorPokemon = result[0];
                        response.challengerPokemon = result[1];
                        response.save();
                        res.redirect('/game');
                    });                   
                }
            }
        });
    }
});

// Start, AKA simulate
router.post('/:id/start', isLoggedIn, function(req, res, next){
    var id = req.params.id;

    var outcome = {
        status: "",
        winner: null,
        loser: null       
    };
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
                // Do two fights, compare the result
                var fight1 = simulator.simulate(response.creatorPokemon, response.challengerPokemon);
                var fight2 = simulator.simulate(response.challengerPokemon, response.creatorPokemon); // Other way around this time

                if(fight1 == fight2){
                    outcome.status = "draw";
                }
                else if(fight1 > fight2){
                    outcome.status = response.creatorPokemon.name + " wins!";
                    outcome.winner = response._creator;
                    outcome.loser = response._challenger;
                }
                else if(fight1 < fight2){
                    outcome.status = response.challengerPokemon.name + " wins!";
                    outcome.winner = response._challenger;
                    outcome.loser = response._creator;
                }

                res.send(outcome);
            }
    })};
       
});

router.get('/simulate', function(req, res, next){
    var testpokemon1 = {
        name: "Meowth",
        type1: "normal"        
    }

    var testpokemon2 = {
        name: "Aggron",
        type1: "rock",
        type2: "steel"
    }

    // Do two fights, compare the result
    var fight1 = simulator.simulate(testpokemon1,testpokemon2);
    var fight2 = simulator.simulate(testpokemon2,testpokemon1); // Other way around

    if(fight1 == fight2){
        res.send("its a draw");
    }
    else if(fight1 > fight2){
        res.send("pokemon 1 won!");
    }
    else if(fight1 < fight2){
        res.send("pokemon 2 won!");
    }

});

function getPokemon(id, callback){
    // Pulled the const part from StackOverflow
    const options = {
        url: protocol + '://' + host + '/pokemon/' + id,
        json: true,
        method: "GET" //not really required, GET is default
    };
    request(options,
    function(err,res,body){
        callback(err, body);
    });   
}

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
            socket.gameAdded(game);
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