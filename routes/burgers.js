'use strict'
var express = require('express');
var burgers = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');
var methodOverride  = require('method-override');
burgers.use( methodOverride('_method') );                     // allows method override for PUT & DELETE methods

// SHOW ALL BURGERS
burgers.route('/')
  .get(db.allBurgers, (req,res)=>{                        // displays ALL burgers
    if(res.rows.length === 0){ res.redirect('/burgers/new'); }
    res.render('pages/burger_list', {data: res.rows});    
  })
  .post(db.createBurger,(req,res)=>{                      // adds new burger to database & redirects
    res.redirect('/burgers/');                            
  });

// NEW BURGER FORM
burgers.get('/new', (req,res)=>{
  res.render('pages/burger_edit', {
    data: { title: 'Create Your Special Burger!',
            burgerURL: '/burgers/',
            buttonTitle: 'Burger Me!' }
  });
});

// EDIT BURGER FORM
burgers.get('/:id/edit', (req,res)=>{
  res.render('pages/burger_edit', {
    data: { title: 'Edit Your Dream Burger!',
            burgerURL: req.params.id + '?_method=PUT',
            buttonTitle: 'Edit my Burger!' }
  });
});

// GET|EDIT|DELETE A SINGLE BURGER
burgers.route('/:id')
  .get(db.getBurgerOrder, (req,res)=>{
    res.render('pages/burger_one', {data: res.rows});    
  })
  .put(db.editBurger, (req,res)=>{                      // stores new info into specific id in database
    res.redirect(303, '/burgers/'+req.params.id);       // redirect to burgers/:id
  })
  .delete(db.removeBurger, (req,res)=>{                 // removes burger order_id from database
    console.log('deleting');
    res.redirect(303, '/burgers/');                     // redirect to show all burgers/
  });


module.exports = burgers;



