'use strict'
var express   = require('express');
var logger    = require('morgan');
var path      = require('path');

var app       = express();
var port = process.env.PORT || 3000;

app.use(logger('dev'));

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );


// ROUTES

// HOMEPAGE
app.get('/', dumpMethod)

// SHOW BURGERS
app.get('/burgers', dumpMethod)
app.post('/burgers', dumpMethod)

// SINGLE BURGER
app.get('/burgers/:id', dumpMethod)
app.put('/burgers/:id', dumpMethod)
app.delete('/burgers/:id', dumpMethod)

// SHOW NEW BURGER FORM
app.get('/burgers/new', dumpMethod)

// SHOW EDIT BURGER FORM
app.get('/burgers/:id/edit', dumpMethod)






app.listen(port, ()=>console.log('LETS GET IT BOII!', port));