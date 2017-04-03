var express = require('express');
var router = express.Router();
var offending = require('../models/offendingMatchups');
var defending = require('../models/defendingMatchups');


router.get('/', function(req, res, next) {
   var err = new Error('Bad Request');
       err.status = 400;
       err.extramessage = "Please use /attack or /defend";
   next(err);
});

router.get('/attack', function(req, res, next){
  res.status(200).send(offending);
});

router.get('/attack/:type', function(req, res, next){
  var type = req.params.type; 

  var err = new Error('Bad Request');
  err.status = 400;
  err.extramessage = "Not yet implemented!";
  next(err);
  

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
  next(err);
  }
})






module.exports = router;
