/**
 * @swagger
 * /pokeapi/pokemon/:pokemon:
 *   get:
 *     tags:
 *        - pokemon
 *     description: Get the types of the specific pokemon
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pokemon
 *         in: path
 *         description: String that defines the pokemon
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: types returned from specific pokemon
 * 
 * /pokeapi/types/:type:
 *   get:
 *     tags:
 *        - pokemon
 *     description: Get the types that get (no/weak/strong) damage from the specific type, Get the types that do (no/weak/strong) damage to the specific type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         in: path
 *         description: String that defines the type
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: types returned in a array for get/do no/weak/strong damage
 * 
 * /pokeapi/allpokemon:
 *   get:
 *     tags:
 *        - pokemon
 *     description: Get all the available pokemon
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: types returned in a array for get/do no/weak/strong damage
*/
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:pokemon', function(req, res, next) {
    var pkmn = req.params.pokemon;
    var pokemon = {}
    // console.log('hallo: ' + req.params.pokemon);

    request('https://pokeapi.co/api/v2/pokemon/' + pkmn +'/', function(error, response, body) {
        // console.log('statusCode: ', response && response.statusCode);
        
        // Check if we got an OK response, errors would make it crash
        if(response.statusCode > 199 && response.statusCode < 300)
        {
            body = JSON.parse(body);
            pokemon.name = body.name;
            body = body.types;

            pokemon.type1 = body[0].type.name;

            if (body.length == 2){
                pokemon.type2 = body[1].type.name;
            }

            res.send(pokemon);
        }
        else
        {
            res.send({error: pkmn + " not found"});
        }

    });
    
});

router.get('/allpokemon', function(req, res, next) {
    var allpkmn = [];
    // console.log('hello');
    
    request('https://pokeapi.co/api/v2/pokedex/1', function(error, response, body){
        // console.log('statusCode: ', response && response.statusCode);
        body = JSON.parse(body);
        body = body.pokemon_entries;
        // res.send(body[0].pokemon_species);

        for(var i = 0; i < body.length; i++)
        {
            allpkmn.push({entry_number : body[i].entry_number, name : body[i].pokemon_species.name});
        }
        res.send(allpkmn);
    });
});

router.get('/types/:type', function(req, res, next){
    var type = req.params.type;

    request('https://pokeapi.co/api/v2/type/' + type, function(error, response, body) {
        // console.log('statusCode: ', response && response.statusCode);
        body = JSON.parse(body);
        res.send(body.damage_relations);
        
    });
});

module.exports = router;