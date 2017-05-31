/**
 * @swagger
 * /type:
 *   get:
 *     tags:
 *        - type
 *     description: Show error "Please use /attack or /defend"
 *     produces:
 *       - application/json
 *     responses:
 *       400:
 *         description: Show error "Please use /attack or /defend"
 * 
 * /type/attack:
 *   get:
 *     tags:
 *        - type
 *     description: Returns all offending matchups
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all offending matchups
 * 
 * /type/attack/:type:
 *   get:
 *     tags:
 *        - type
 *     description: Get the types that get (no/weak/strong) damage from the specific type
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
 *         description: types returned in a array for get no/weak/strong damage
 * 
 * /type/defend:
 *   get:
 *     tags:
 *        - type
 *     description: Returns all defending matchups with their damage multiplier
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all defending matchups with their respective damage multiplier
 *       400:
 *         description: Type not found
 * 
 * /type/defend/:type:
 *   get:
 *     tags:
 *        - type
 *     description: Get the types that do (no/weak/strong) damage to the specific type
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
 *         description: types returned in a array for do no/weak/strong damage
*/
var express = require('express');
var router = express.Router();
var offending = require('../models/offendingMatchups');
var defending = require('../models/defendingMatchups');


router.get('/', function(req, res, next) {
   var err = new Error('Bad Request');
       err.status = 400;
       err.extramessage = "Please use /attack or /defend";
       res.error = err;
   next();
});

router.get('/attack', function(req, res, next){
  res.status(200).send(offending);
});

router.get('/attack/:type', function(req, res, next){
  var type = req.params.type; 

  var result = offending.getEntry(type);

  console.log('result: ' + result);

  if(result){
    res.status(200).send(result);
  }
  else{
    var err = new Error('Not Found');
    err.status = 404;
    err.extramessage = "Type does not exist!";
    res.error = err;
    next();
  } 

});

router.get('/defend', function(req, res, next){
  res.status(200).send(defending);
});

router.get('/defend/:type', function(req,res,next){
  var type = req.params.type;

  var result = defending[type];
  
  if(result){
    res.status(200).send(result);
  }
  else{
    var err = new Error('Not Found');
    err.status = 404;
    err.extramessage = "Type does not exist!";
    res.error = err;
    next();
  }
});

module.exports = router;
