var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/pokemon/:pokemon', function(req, res, next) {
    var pokemon = req.params.pokemon;
    var pkmnType = {}
    // console.log('hallo: ' + req.params.pokemon);

    request('https://pokeapi.co/api/v2/pokemon/' + pokemon +'/', function(error, response, body) {
        // console.log('statusCode: ', response && response.statusCode);
        body = JSON.parse(body);
        body = body.types;

        pkmnType.slot1 = body[0].type.name;

        if (body.length == 2){
            pkmnType.slot2 = body[1].type.name;
        }

        res.send(pkmnType);

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