'use strict'
var express         = require('express');
var logger          = require('morgan');
var path            = require('path');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

var app       = express();
var port      = process.env.PORT || 3000;
var burgerRoutes = require(path.join(__dirname, '/routes/burgers'));  // this is a directory path!!

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );

app.use(logger('dev'));
app.use( bodyParser.urlencoded({ extended: false }) );    // allows bodyParser for POST methods
app.use( bodyParser.json() );
app.use( methodOverride('_method') );                     // allows method override for PUT & DELETE methods
app.use('view engine', 'ejs');                            // automatically the root directory for views (ejs, html)


// HOMEPAGE
app.get('/', (req,res)=>res.render('pages/home'));        // this is a directory path!!










// redirect to burgers route
app.use('/burgers', burgerRoutes);

app.listen(port, ()=>console.log('LETS GET IT BOII!', port));