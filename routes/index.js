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




module.exports = router;
