'use strict'
var express = require('express');
var burgers = express.Router();

var dumpMethod = (req,res)=>res.send( req.method + " burgers!" );
var burgerData = [];

// ROUTES

// SHOW BURGERS
burgers.route('/')
  .get( (req,res)=>{
    // res.send(burgerData);
    res.render('pages/burger_list', {data: burgerData});           // displays ALL burgers
  })
  .post( (req,res)=>{
    burgerData.push(req.body);
    var newID = burgerData.length-1;
    res.redirect('/burgers/' +newID);
  });

// SHOW NEW BURGER FORM
burgers.get('/new', (req,res)=>{
  res.render('pages/burger_edit', {
    data: {
      title: 'Create Your Special Burger!',
      burgerURL: '/burgers/',
      submitMethod: 'post'
    }
  });
});

// SHOW EDIT BURGER FORM
burgers.get('/:id/edit', (req,res)=>{
  res.render('pages/burger_edit', {
    data: {
      title: 'Change Up Your Dream Burger!',
      burgerURL: '/burgers/' + req.params.id + '?_method=PUT',
      submitMethod: 'post'
    }
  });
});

// SINGLE BURGER
burgers.route('/:id')
  .get((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);
      return;
    }
    res.render('pages/burger_one', {data: burgerData[bID]});
    // res.send(burgerData[bID]);        // display burgerData info of :id
  })
  .put((req,res)=>{
    var bID = req.params.id;          // store :id in bID
    if(!(bID in burgerData)){         // check for error
      res.sendStatus(404);            
      return;
    }
    burgerData[bID] = req.body;       // stores new info into bID in burgerData
<<<<<<< HEAD
    res.redirect('/burgers/'+bID);    // redirect to burgers/:id
=======
    res.redirect(303, '/burgers/'+bID);           // redirect to burgers/:id
>>>>>>> c3b91b02e82b466b5ecdea7fc56fb9ad2be3cada
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