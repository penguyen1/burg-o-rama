var pg                = require('pg');
var connectionString  = "postgres://PeterNguyen:pita@localhost/burger";


function addTopping(order_id, toppings) {
  pg.connect(connectionString, function(err,client,done){
    if(err) { return console.error('error fetching client from pool', err); }

    for(var i in toppings){
      client.query('INSERT INTO toppings_orders_join(order_id,topping_id) VALUES($1,$2);',[order_id, toppings[i]],
        function(err, result) {
          done();
          if(err) { return console.error('error running query', err); }
      });
    }
  });
}

function addCheese(order_id, cheeses) {
  pg.connect(connectionString, function(err,client,done){
    if(err) { return console.error('error fetching client from pool', err); }

    for(var i in cheeses){
      client.query('INSERT INTO cheeses_orders_join(order_id,cheese_id) VALUES($1,$2);',[order_id, cheeses[i]],
        function(err, result) {
          done();
          if(err) { return console.error('error running query', err); }
      });
    }
  });
}

function createBurger(req,res,next){
  var name = req.body.name;
  var meat = req.body.meat;
  var temperature = req.body.temperature;
  var buns = req.body.buns;
  var cheeses = req.body.cheeses;           // possible array
  var extras = req.body.extras;             // possible array

  pg.connect(connectionString, function(err,client,done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    var query = client.query("INSERT INTO orders(name,meat_id,bun_id,doneness) VALUES($1,$2,$3,$4);", [name,meat,buns,temperature], 
      function(err, results){
        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
    var id = client.query("SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1;", 
      function(err, results){
        var order_num = results.rows[0].order_id;
        addCheese(order_num, cheeses);                // adds cheeses
        addTopping(order_num, extras);                // adds toppings

        done();
        if(err){ return console.error('error running query', err); }
        next();
    });
  })
}

function allBurgers(req,res,next){
  pg.connect(connectionString, function(err,client,done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

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

module.exports.createBurger = createBurger;
module.exports.allBurgers = allBurgers;





