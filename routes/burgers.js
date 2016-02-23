'use strict'
var express = require('express');
var burgers = express.Router();

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );
var burgerData = [];

// ROUTES

// SHOW BURGERS
burgers.route('/')
  .get((req,res)=>{
    console.log('redirected!');                         //   \\ testing redirect
    res.send(burgerData);           // displays ALL burgers
  })
  .post((req,res)=>{
    burgerData.push(req.body);
    var newID = burgerData.length-1;
    res.redirect('/burgers/' +newID);
  });

// SINGLE BURGER
burgers.route('/:id')
  .get((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);
      return;
    }
    res.send(burgerData[bID]);        // display burgerData info of :id
  })
  .put((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);            
      return;
    }
    burgerData[bID] = req.body;       // stores new info into bID in burgerData
    res.redirect('/burgers/'+bID);    // redirect to burgers/:id
  })
  .delete((req,res)=>{
    var bID = req.params.id;
    if(!(bID in burgerData)){         // fails silently
      res.redirect('/burgers/');                                         // does this redirect us??!?!
      return;                         
    }
    console.log('i shouldnt be here!!!');
    burgerData.splice(bID, 1);        // start at index bID & remove 1 element      \\ wont this shift all the other indices down??
    res.redirect('/burgers/');
  });

// SHOW NEW BURGER FORM
burgers.get('/new', dumpMethod);

// SHOW EDIT BURGER FORM
burgers.get('/:id/edit', dumpMethod);


module.exports = burgers;