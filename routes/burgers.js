'use strict'
var express = require('express');
var burgers = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );
var burgerData = [];

// ROUTES

// SHOW ALL BURGERS
burgers.route('/')
  .get(db.allBurgers, (req,res)=>{
    // console.log(res.rows);
    // res.send(burgerData);
    res.render('pages/burger_list', {data: res.rows});           // displays ALL burgers
  })
  .post(db.createBurger,(req,res)=>{      //  db.addCheese, db.addTopping, 
    // burgerData.push(req.body);
    // var newID = burgerData.length-1;
    // res.redirect('/burgers/' +newID);
    // res.send(req.body);
    res.redirect('/burgers/');
  });

// NEW BURGER FORM
burgers.get('/new', (req,res)=>{
  res.render('pages/burger_edit', {
    data: {
      title: 'Create Your Special Burger!',
      burgerURL: '/burgers/',
      submitMethod: 'post'
    }
  });
});

// EDIT BURGER FORM
burgers.get('/:id/edit', (req,res)=>{
  res.render('pages/burger_edit', {
    data: {
      title: 'Edit Your Dream Burger!',
      burgerURL: '/burgers/' + req.params.id + '?_method=PUT',
      submitMethod: 'post'
    }
  });
});

// GET|EDIT|DELETE A SINGLE BURGER
burgers.route('/:id')
  .get((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);
      return;
    }
    // res.render('pages/burger_one', {data: burgerData[bID]});
    res.send(burgerData[bID]);        // display burgerData info of :id
  })
  .put((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);            
      return;
    }
    burgerData[bID] = req.body;       // stores new info into bID in burgerData
    res.redirect(303, '/burgers/'+bID);           // redirect to burgers/:id
  })
  .delete((req,res)=>{
    var bID = req.params.id;
    if(!(bID in burgerData)){         // fails silently - what does that mean????
      res.redirect(303, '/burgers/');              
      return;                         
    }
    console.log('i shouldnt be here!!!');
    burgerData.splice(bID, 1);        // start at index bID & remove 1 element      \\ wont this shift all the other indices down??
    res.redirect(303, '/burgers/');
  });



module.exports = burgers;