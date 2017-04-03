var express = require('express');
var router = express.Router();

var https = require('https');



router.get('/:type', function(req, res, next){
    var type = req.params.type;
    //res.send(type);

    var pokeapiget = {
        host: 'pokeapi.co',
        port: 443,
        path: '/api/v2/type/' + type + '/',
        method : 'GET'
    };

    console.info('Options prepared:');
    console.info(pokeapiget);
    console.info('Do the GET call');

    var reqGet = https.request(pokeapiget, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);
        
        res.on('data', function(d){
            console.info('GET result: \n');
            process.stdout.write(d);
            console.info('\n\nCall completed');
        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
});










module.exports = router;