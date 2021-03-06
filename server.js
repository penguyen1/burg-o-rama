pry  = require('pryjs');
'use strict'
var express         = require('express');
var logger          = require('morgan');
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

var db        = require('./db/pg');           // links server.js to pg.js
var app       = express();
var port      = process.env.PORT || 3000;
var burgerRoutes = require(path.join(__dirname, '/routes/burgers'));  // this is a directory path!!

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );

app.use(logger('dev'));
app.use( bodyParser.urlencoded({ extended: false }) );    // allows bodyParser for POST methods
app.use( bodyParser.json() );
app.use( methodOverride('_method') );                     // allows method override for PUT & DELETE methods
app.set('views', './views');                              // automatically the root directory for views (ejs, html)
app.set('view engine', 'ejs');                            
app.use(express.static(path.join(__dirname, 'public')));  // static route to public




// HOMEPAGE route
app.get('/', (req,res)=>res.render('pages/home', {data: 'Welcome to Burger-o-Rama!'}));        // this is a directory path!!

// redirect to burgers route
app.use('/burgers', burgerRoutes);

app.listen(port, ()=>console.log('LETS GET IT BOII!', port));