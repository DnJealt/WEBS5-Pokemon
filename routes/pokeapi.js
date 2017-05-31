/**
 * @swagger
 * /pokemon/:pokemon:
 *   get:
 *     tags:
 *        - pokemon
 *     description: Get the name and types of the specific pokemon
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pokemon id
 *         in: path
 *         description: Int that defines the pokemon id
 *         required: true
 *         type: int
 *       - name: pokemon name
 *         in: path
 *         description: String that defines the pokemon name
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: name and types returned from specific pokemon
 *       400:
 *         description: Only name or id is required, it will not work with both name and id
*/
var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/:pokemon', function(req, res, next) {
    var pkmn = req.params.pokemon;
    var pokemon = {}

    request('https://pokeapi.co/api/v2/pokemon/' + pkmn +'/', function(error, response, body) {
        // console.log('statusCode: ', response && response.statusCode);
        
        // Check if we got an OK response, errors would make it crash
        if(response.statusCode >= 200 && response.statusCode < 300)
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