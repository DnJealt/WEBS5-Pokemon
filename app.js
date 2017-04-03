var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');

 var flash    = require('connect-flash');

// Connect to the database
var configDb = require('./config/database');
require('mongoose').connect(configDb.url);

var types = require('./routes/types');
var pokeapi = require('./routes/pokeapi');

var app = express();
app.disable('x-powered-by');

// view engine setup
app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'webs5eindopdraggie' })); // session secret
app.use(passport.initialize());
require('./config/passport')(passport);
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./routes/index.js')(app, passport);
app.use('/matchup', types);
app.use('/pokeapi', pokeapi);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  
    if(!err){
      err = new Error('Not Found');
      err.status = 404;
    }
    next(err);  
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  res.render('error', {statuscode: err.status, message: err.message, extramessage: err.extramessage});
});

module.exports = app;
