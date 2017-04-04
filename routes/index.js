var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
    if(req.isAuthenticated()){
        res.render('index', {title: "Home", user: req.user});
    }
    else{
        res.render('index', {title: "Home"});
    }   
});

// No other method is allowed to reach the homepage
router.all('/', function(req, res, next){
    var err = new Error('Method not allowed');
    err.status = 405;
    err.extramessage = "Dafuq u doing bro?";
    res.error = err;
    next();
});


module.exports = router;
