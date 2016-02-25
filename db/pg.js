var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/burger";

function addToppings(order_id, toppings) {
  pg.connect(connectionString, function(err,client,done){
    if(err) { return console.error('error fetching client from pool', err); }

    // iterates through (multiple) toppings & adds to toppings_orders_join
    for(var i in toppings){
      client.query('INSERT INTO toppings_orders_join(order_id,topping_id) VALUES($1,$2);',[order_id, toppings[i]], 
        function(err, results) {
          done();
          if(err) { return console.error('error running query', err); }
      })
    }
  })
}

function addCheeses(order_id, cheeses) {
  pg.connect(connectionString, function(err,client,done){
    if(err) { return console.error('error fetching client from pool', err); }

    // iterates through (multiple) cheeses & adds to cheeses_orders_join
    for(var i in cheeses){
      client.query('INSERT INTO cheeses_orders_join(order_id,cheese_id) VALUES($1,$2);',[order_id, cheeses[i]],
        function(err, results) {
          done();
          if(err) { return console.error('error running query', err); }
      })
    }
  })
}

// deletes all entries in cheeses_orders_join & toppings_orders_join with order_id
function removeExtras(order_id){
  pg.connect(connectionString, function(err,client,done){
    if(err) { return console.error('error fetching client from pool', err); }

    // deletes any existing rows in cheeses_orders_join with order_id
    client.query('DELETE FROM cheeses_orders_join WHERE order_id=($1);', [order_id],
      function(err,results){
        done();
        if(err) { return console.error('error running query', err); }
      });

    // deletes any existing rows in toppings_orders_join with order_id
    client.query('DELETE FROM toppings_orders_join WHERE order_id=($1);', [order_id], 
      function(err,results){
        done();
        if(err) { return console.error('error running query', err); }
      });
  });
}

// new burger order info from form
function createBurger(req,res,next){                          
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err}); }

    // adds new burger entry to orders table
    var query = client.query("INSERT INTO orders(name,meat_id,bun_id,doneness) VALUES($1,$2,$3,$4);", 
      [req.body.name, req.body.meat, req.body.buns, req.body.temperature], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });

    // gets most recently added order_id from orders
    var id = client.query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;", 
      function(err, results){
        var order_num = results.rows[0].order_id;
        addCheeses(order_num, req.body.cheeses);                // adds cheeses
        addToppings(order_num, req.body.extras);                // adds toppings
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  })
}

// updated burger order info from form
function editBurger(req,res,next){     
  var ID = +(req.params.id);                         
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err});  }

    // updates orders of order_id info
    var query = client.query("UPDATE orders SET name=($1), meat_id=($2), bun_id=($3), doneness=($4) WHERE order_id=($5);", 
      [req.body.name, req.body.meat, req.body.buns, req.body.temperature, ID], 
      function(err, results){
        removeExtras(req.params.id);                                // removes any existing cheeses & toppings
        addCheeses(ID, req.body.cheeses);                // adds cheeses
        addToppings(ID, req.body.extras);                // adds toppings
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  });
}

// queries for all burger orders from database
function allBurgers(req,res,next){                            
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err}); }

    var query = client.query("SELECT * FROM orders;", 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        if(results.rows.length === 0){ res.status(204).json({ success: true, data: 'no content'}); } 
        res.rows = results.rows;
        next();
    })
  });
}

// queries for a burger order from database
function getBurgerOrder(req,res,next){      
  var ID = +(req.params.id);                   
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err});  }

    var query = client.query("SELECT * FROM orders WHERE order_id=($1);", [ID], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        if(results.rows.length === 0){ res.status(204).json({ success: true, data: 'no content'}); } 
        res.rows = results.rows;
        next();
    })
  });
}

// removes burger (order_id) from database
function removeBurger(req,res,next){
  var ID = +(req.params.id); 
  pg.connect(connectionString, function(err,client,done){
    if(err){  done();
              return res.status(500).json({ success: false, data: err});  }

    // removeExtras(ID);    // removes any existing cheeses & toppings
    var query = client.query("DELETE FROM orders WHERE order_id=($1);", [ID], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        next();
    })
  });
}

module.exports.createBurger = createBurger;
module.exports.editBurger = editBurger;
module.exports.allBurgers = allBurgers;
module.exports.getBurgerOrder = getBurgerOrder;
module.exports.removeBurger = removeBurger;





