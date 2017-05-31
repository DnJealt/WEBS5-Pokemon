var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('./models/hbsHelper');
var passport = require('passport');
var swaggerJSDoc = require('swagger-jsdoc');

var flash    = require('connect-flash');

// Connect to the database
var configDb = require('./config/database');
require('mongoose').connect(configDb.url);

var pokeapi = require('./routes/pokeapi');
var index = require('./routes/index');
var type = require('./routes/type');
var game = require('./routes/game');

var app = express();

//swagger definition
var swaggerDefinition = {
  info: {
    title: 'Webs5-Pokemon',
    version: '1.0.0',
    description: 'Battle pokemon',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js','./models/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.disable('x-powered-by');

// view engine setup
app.engine('hbs', exphbs.engine);
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


require('./routes/user.js')(app, passport);
app.use('/', index);
app.use('/matchup', type);
app.use('/pokemon', pokeapi);
app.use('/game', game);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler en fuck deze standaard shit het werkt voor geen meter.
app.use(function(req, res, next) {
  if(res.error){
    next(res.error);
  }  
  else{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);  
  }     
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  var statusCode = err.status || 500;

  // If we encounter an internal server error, set the messages manually here.
  if(statusCode === 500){
    err.extramessage = err.message;
    err.message = "Internal Server Error";
  }

  if(err.message != 'nada'){
    res.status(statusCode);
    res.render('error', {title: statusCode, statuscode: statusCode, message: err.message, extramessage: err.extramessage});
  }
  console.log('en nu?');

});

module.exports = app;
