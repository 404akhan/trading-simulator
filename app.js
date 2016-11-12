var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// route files
var routes = require('./routes/index');

// init app
var app = express();
app.use(cors());

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);

// set port
app.set('port', (process.env.PORT || 3001));

// run server
app.listen(app.get('port'), function() {
  console.log('Server started on port: ' + app.get('port'));
});