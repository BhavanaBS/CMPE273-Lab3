/* eslint-disable no-plusplus */
// import the require dependencies
const express = require('express');
const util = require('util');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passwordHash = require('password-hash');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
};

const uploadDir = path.join(__dirname, '/resources/uploads/');
const defaultUserImage = path.join(__dirname, '/resources/images/profile.png');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bhavana-${file.originalname}`);
  },
});

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: imageFilter,
}).single('image');

// const cookieParser = require('cookie-parser');
const cors = require('cors');

const mysqlConnection = require('./config/db_connection.js');
// const mysqlPool = require('./config/db_conn_pool.js');

app.set('view engine', 'ejs');

// use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_bhavana_yelp_app_mysql',
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

const dbConnection = util.promisify(mysqlConnection.query).bind(mysqlConnection);

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Restaurant Login
app.post('/restaurants/login', (req, res) => {
  console.log('Inside Restaurant Login POST Request');
  console.log('Req Body : ', req.body);

  dbConnection('SELECT id, password FROM `rest_profile` WHERE `email_id` = ?', [req.body.email_id], async (error, results) => {
    try {
      console.log('Result from database : ', results);
      if (results.length === 1) {
        console.log('Verify Password');
        if (passwordHash.verify(req.body.password, results[0].password)) {
          console.log('Restaurant logged in with email id : ', req.body.email_id);
          res.cookie('cookie', 'yelpUser', { maxAge: 900000, httpOnly: false, path: '/' });
          req.session.restaurant_id = results[0].id;
          res.status(200).json({ id: results[0].id });
        } else {
          console.log('No restaurant email found');
          res.writeHead(401, {
            'Content-Type': 'application/json',
          });
          res.end('Unauthorized Login');
        }
      } else {
        console.log('No restaurant email found');
        res.writeHead(401, {
          'Content-Type': 'application/json',
        });
        res.end('Unauthorized Login');
      }
    } catch (err) {
      console.log('Inside Catch with error :', err);
      res.writeHead(401, {
        'Content-Type': 'application/json',
      });
      res.end('Unauthorized Login');
    }
  });
});

// Create Restaurant
app.post('/restaurants', (req, res) => {
  console.log('Inside Restaurant SignUp POST Request');
  console.log('Req Body : ', req.body);
  const hashedPassword = passwordHash.generate(req.body.password);
  const createRestaurantPost = {
    name: req.body.name, email_id: req.body.email_id, password: hashedPassword, location: req.body.location,
  };
  dbConnection('INSERT INTO rest_profile SET ?',
    createRestaurantPost, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json({ id: results.insertId });
      }
      if (error) {
        console.error('Error Creating the Restaurant : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Creation Failed! ', error.message);
      }
    });
});

// Get Restaurant
app.get('/restaurants/:id', (req, res) => {
  console.log('Get Restaurant');
  dbConnection('SELECT * FROM `rest_profile` WHERE `id` = ?', [req.params.id],
    (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results[0]);
      }
      if (error) {
        console.error('Error Fetching the Restaurant for id: ', req.params.id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Fetch Failed! ', error.message);
      }
    });
});

// Update Restaurant
app.put('/restaurants/:id', (req, res) => {
  const modifyRestaurantPut = {
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    description: req.body.description,
    timings: req.body.timings,
    delivery_method: req.body.delivery_method,
    map_location: req.body.map_location,
  };

  console.log('Update Restaurant');
  dbConnection('UPDATE `rest_profile` SET ? WHERE `id` = ?',
    [modifyRestaurantPut, req.params.id],
    (error, result) => {
      if (error) {
        console.error('Error Fetching the Restaurant for id: ', req.params.id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Update Failed! ', error.message);
      } if (result) {
        dbConnection('SELECT * FROM `rest_profile` WHERE `id` = ?', [req.params.id],
          (error1, results1) => {
            if (results1) {
              console.log(results1);
              res.status(200).json(results1[0]);
            }
            if (error1) {
              res.status(500).end('Restaurant Update Failed! ');
            }
          });
      }
    });
});

// Get Restaurant on search
app.get('/restaurants', (req, res) => {
  let search;
  if (req.query.search) {
    search = `%${req.query.search}%`;
  } else {
    search = '%%';
  }

  console.log('Get Restaurant on search of: ', search);
  dbConnection('SELECT * FROM rest_profile WHERE id IN (SELECT distinct(r.id) FROM `rest_profile` r LEFT OUTER JOIN `rest_dishes` d ON r.id = d.rest_id WHERE (r.name LIKE ? OR r.location LIKE ? OR d.name LIKE ? OR r.delivery_method LIKE ?))',
    [search, search, search, search],
    (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results);
      }
      if (error) {
        console.error('Error Fetching the restaurants for search: ', search, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Fetching the restaurants for search Failed! ', error.message);
      }
    });
});

// Customer Login
app.post('/customers/login', (req, res) => {
  console.log('Inside Customer Login POST Request');
  console.log('Req Body : ', req.body);

  dbConnection('SELECT id, password FROM `cust_profile` WHERE `email_id` = ?', [req.body.email_id], async (error, results) => {
    console.log('Result from database : ', results);
    if (results.length === 1) {
      if (passwordHash.verify(req.body.password, results[0].password)) {
        console.log('Customer logged in with email id : ', req.body.email_id);
        res.cookie('cookie', 'yelpUser', { maxAge: 900000, httpOnly: false, path: '/' });
        req.session.customer_id = results[0].id;
        res.status(200).json({ id: results[0].id });
      } else {
        console.log('No Customer email found');
        res.writeHead(401, {
          'Content-Type': 'application/json',
        });
        res.end('Unauthorized Login');
      }
    } else {
      console.log('No Customer email found');
      res.writeHead(401, {
        'Content-Type': 'application/json',
      });
      res.end('Unauthorized Login');
    }
  });
});

// Create Customer
app.post('/customers', (req, res) => {
  console.log('Inside Customer SignUp POST Request');
  console.log('Req Body : ', req.body);
  const hashedPassword = passwordHash.generate(req.body.password);
  const createCustomerPost = { name: req.body.name, email_id: req.body.email_id, password: hashedPassword };
  dbConnection('INSERT INTO cust_profile SET ?',
    createCustomerPost, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json({ id: results.insertId });
      }
      if (error) {
        console.error('Error Creating the Customer : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Customer Creation Failed! ', error.message);
      }
    });
});

// Get Customers
app.get('/customers/:id', (req, res) => {
  console.log('Get Customer');
  dbConnection('SELECT * FROM `cust_profile` WHERE `id` = ?', [req.params.id],
    (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results[0]);
      }
      if (error) {
        console.error('Error Fetching the Customer for id: ', req.params.id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Customer Creation Failed! ', error.message);
      }
    });
});

// Update Customer About Profile
app.put('/customers/profile/:id', (req, res) => {
  const modifyCustomerPut = {
    name: req.body.name,
    dob: req.body.dob,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    nick_name: req.body.nick_name,
    about: req.body.about,
    favourite_restaurant: req.body.favourite_restaurant,
    favourite_hobby: req.body.favourite_hobby,
    blog_url: req.body.blog_url,
    phone: req.body.phone,
  };

  console.log('Update Customer');
  dbConnection('UPDATE `cust_profile` SET ? WHERE `id` = ?', [modifyCustomerPut, req.params.id],
    (error, results) => {
      console.log('Update Customer');
      if (error) {
        console.error('Error Updating the Customer for id: ', req.params.id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Customer Update Failed! ', error.message);
      } if (results) {
        res.status(200);
        res.end('Update Successful');
      }
    });
});

// Get Dishes of a restaurant
app.get('/restaurants/:rest_id/dishes', (req, res) => {
  console.log("Get Restaurant's Dishes");
  dbConnection('SELECT * FROM `rest_dishes` WHERE `rest_id` = ?', [req.params.rest_id],
    (error, results) => {
      if (error) {
        console.error('Error Fetching the Restaurant Dishes for id: ', req.params.rest_id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Menu Fetch Failed! ', error.message);
      }
      if (results) {
        console.log(results);
        res.status(200).json(results);
      }
    });
});

// create a Dish for a restaurant
app.post('/restaurants/:rest_id/dishes', (req, res) => {
  console.log('Create a Dish for a restaurant');
  console.log('Req Body : ', req.body);
  const createRestaurantPost = {
    rest_id: req.params.rest_id,
    name: req.body.name,
    ingredients: req.body.ingredients,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
  };
  dbConnection('INSERT INTO rest_dishes SET ?',
    createRestaurantPost, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json({ id: results.insertId });
      }
      if (error) {
        console.error('Error Creating a Restaurant Dish : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Dish Creation Failed! ', error.message);
      }
    });
});

// Get a Dish of a restaurant
app.get('/restaurants/:rest_id/dishes/:dish_id', (req, res) => {
  console.log("Get Restaurant's Dish");
  dbConnection('SELECT * FROM `rest_dishes` WHERE `rest_id` = ? AND `id` = ? ', [req.params.rest_id, req.params.dish_id],
    (err, results) => {
      if (err) {
        console.error('Error fetching the dish for id: ', req.params.rest_id, err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Dish Delete Failed! ', err.message);
      } else if (results && results.length === 1) {
        res.status(200).json(results[0]);
      } else {
        res.writeHead(404, {
          'Content-Type': 'application/json',
        }).end();
      }
    });
});

// Update restaurant dish
app.put('/restaurants/:rest_id/dishes/:dish_id', (req, res) => {
  console.log('Update a Dish for a restaurant', req.params.rest_id, req.params.dish_id);
  console.log('Req Body : ', req.body);

  dbConnection('SELECT * FROM `rest_dishes` WHERE `id` = ? AND `rest_id` = ?',
    [req.params.dish_id, req.params.rest_id],
    (error, result) => {
      console.log(result);
      if (result && result.length === 1) {
        const currentDish = result[0];
        const updateRestaurantDish = {
          name: req.body.name || currentDish.name,
          ingredients: req.body.ingredients || currentDish.ingredients,
          price: req.body.price || currentDish.price,
          description: req.body.description || currentDish.description,
          category: req.body.category || currentDish.category,
        };
        dbConnection('UPDATE `rest_dishes` SET ? WHERE `id` = ? AND `rest_id` = ?',
          [updateRestaurantDish, req.params.dish_id, req.params.rest_id],
          (errors, results) => {
            if (results) {
              console.log(results);
              res.status(200).end();
            }
            if (errors) {
              console.error('Error Updating a Restaurant Dish : ', errors);
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end('Restaurant Dish Update Failed! ', errors.message);
            }
          });
      } else {
        res.status(404).end();
      }
      if (error) {
        console.error('Error Fetching the Restaurant Dishes for id: ', req.params.rest_id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Menu Fetch Failed! ', error.message);
      }
    });
});

// Delete a Dish of a restaurant
app.delete('/restaurants/:rest_id/dishes/:dish_id', (req, res) => {
  console.log("Delete Restaurant's Dishes");
  dbConnection('DELETE FROM `rest_dishes` WHERE `rest_id` = ? AND `id` = ? ', [req.params.rest_id, req.params.dish_id],
    (err, result) => {
      if (err) {
        console.error('Error Deleting the Restaurant Dish for id: ', req.params.rest_id, err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Restaurant Dish Delete Failed! ', err.message);
      } if (result) {
        if (result.affectedRows === 0) {
          res.status(404);
        } else {
          res.status(200);
        }
        res.end();
      }
      console.log(`Number of records deleted: ${result.affectedRows}`);
    });
});

// Add a Customer review
app.post('/customers/:cust_id/reviews', (req, res) => {
  console.log('Create a Review for a restaurant');
  console.log('Req Body : ', req.body);
  const createReviewPost = {
    cust_id: req.params.cust_id,
    rating: req.body.rating,
    review: req.body.review,
    rest_id: req.body.rest_id,
  };
  dbConnection('INSERT INTO reviews SET ?',
    createReviewPost, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).end();
      }
      if (error) {
        console.error('Error Creating a Restaurant Dish : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Adding a Review Failed! ', error.message);
      }
    });
});

// Get all reviews for a restaurant
app.get('/restaurants/:rest_id/reviews', (req, res) => {
  console.log('Fetch all Reviews for a restaurant');
  console.log('Req Body : ', req.body);
  dbConnection('SELECT * FROM reviews WHERE rest_id = ?',
    req.params.rest_id, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results);
      }
      if (error) {
        console.error('Error Fetching all Reviews for a restaurant : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Fetching all Reviews for a restaurant Failed! ', error.message);
      }
    });
});

// Create a order
app.post('/orders', (req, res) => {
  console.log('Create an order');
  console.log('Req body: ', req.body);

  const createOrder = {
    cust_id: req.body.cust_id,
    rest_id: req.body.rest_id,
    status: 'NEW',
    delivery_method: req.body.delivery_method,
  };
  mysqlConnection.beginTransaction((err) => {
    if (err) {
      console.error('Error Creating an Order : ', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end('Order Creation Failed! ', err.message);
    }

    dbConnection('INSERT INTO orders SET ?',
      [createOrder], (error, result) => {
        if (error) {
          console.error('Error Creating an Order : ', error);
          res.writeHead(500, {
            'Content-Type': 'application/json',
          });
          res.end('Order Creation Failed! ', error.message);
        }

        if (result) {
          console.log(result.insertId);
          const orderId = result.insertId;
          const dishesInOrder = []; let
            dishToAdd;
          for (let i = 0; i < req.body.dishes.length; i++) {
            dishToAdd = [
              orderId,
              req.body.dishes[i].id,
              req.body.dishes[i].dish_quantity,
            ];
            dishesInOrder.push(dishToAdd);
          }

          dbConnection('INSERT INTO order_dishes (order_id, dish_id, quantity) VALUES ?',
            [dishesInOrder], (error1) => {
              if (error1) {
                console.error('Error Creating an Order : ', error1);
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                res.end('Order Creation Failed! ', error1.message);
              }

              mysqlConnection.commit((err1) => {
                if (err1) {
                  mysqlConnection.rollback(() => {
                    console.error('Error Creating an Order : ', err1);
                    res.writeHead(500, {
                      'Content-Type': 'application/json',
                    });
                    res.end('Order Creation Failed! ', err1.message);
                  });
                }
                res.status(200).json({ orderId });
              });
            });
        }
      });
  });
});

// Update Order status
app.put('/orders/:order_id', (req, res) => {
  console.log('Update Order status');
  console.log('Req body: ', req.body);

  const updateStatus = {
    status: req.body.status,
  };

  dbConnection('UPDATE `orders` SET ? WHERE `id` = ?',
    [updateStatus, req.params.order_id],
    (error, results) => {
      if (error) {
        console.error('Error Updating Order status for Order id: ', req.params.order_id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Updating Order status Failed! ', error.message);
      } if (results) {
        console.log(results);
        res.status(200).end();
      }
    });
});

// Get Orders placed by a customer
app.get('/customers/:cust_id/orders', (req, res) => {
  console.log('Fetch all orders placed by a customer');
  dbConnection('SELECT o.id,o.cust_id, o.rest_id, rp.name as \'rest_name\', o.status, '
  + 'o.create_time, o.delivery_method, od.dish_id, rd.name as \'dish_name\', od.quantity, '
  + 'rd.price FROM yelp_schema.orders o '
  + 'LEFT JOIN yelp_schema.order_dishes od ON o.id = od.order_id '
  + 'LEFT JOIN yelp_schema.rest_dishes rd ON od.dish_id = rd.id '
  + 'LEFT JOIN yelp_schema.rest_profile rp ON o.rest_id = rp.id '
  + 'WHERE (o.cust_id = ?);',
  req.params.cust_id, (error, results) => {
    if (results) {
      console.log(results);
      // res.status(200).json(results);
      // let unique_order_ids = [...new Set(data.map(item => item.id))];

      const orders = new Map();
      for (let i = 0; i < results.length; i++) {
        const orderEntry = results[i];
        if (orders.has(orderEntry.id)) {
          orders.get(orderEntry.id).dishes.push({
            name: orderEntry.dish_name,
            id: orderEntry.dish_id,
            quantity: orderEntry.quantity,
            price: orderEntry.price,
          });
        } else {
          const order = {
            id: orderEntry.id,
            cust_id: orderEntry.cust_id,
            rest_id: orderEntry.rest_id,
            rest_name: orderEntry.rest_name,
            status: orderEntry.status,
            delivery_method: orderEntry.delivery_method,
            create_time: orderEntry.create_time,
            dishes: [{
              name: orderEntry.dish_name,
              id: orderEntry.dish_id,
              quantity: orderEntry.quantity,
              price: orderEntry.price,
            }],
          };
          console.log('Order: ', order);
          orders.set(orderEntry.id, order);
        }
      }
      console.log(orders);
      res.status(200).json([...orders.values()]);
    }

    if (error) {
      console.error('Error Fetching Customer Order History : ', error);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end('Fetching Reviews Failed! ', error.message);
    }
  });
});

// Get Order history of a restaurant
app.get('/restaurants/:rest_id/orders', (req, res) => {
  console.log('Fetch all orders placed by a customer');
  dbConnection('SELECT o.id,o.rest_id, o.cust_id, cp.name as \'cust_name\', o.status, '
  + 'o.create_time, o.delivery_method, od.dish_id, rd.name as \'dish_name\', od.quantity, rd.price, '
  + 'cp.phone as \'cust_phone\', cp.email_id as \'cust_email_id\', cp.city as \'cust_city\', '
  + 'cp.state as \'cust_state\', cp.country as \'cust_country\', cp.dob as \'cust_dob\', '
  + 'cp.about as \'cust_about\', cp.join_date as \'cust_join_date\', cp.blog_url  as \'cust_blog_url\' '
  + 'FROM yelp_schema.orders o '
  + 'LEFT JOIN yelp_schema.order_dishes od ON o.id = od.order_id '
  + 'LEFT JOIN yelp_schema.rest_dishes rd ON od.dish_id = rd.id '
  + 'LEFT JOIN yelp_schema.cust_profile cp ON o.cust_id = cp.id '
  + 'WHERE (o.rest_id = ?);',
  req.params.rest_id, (error, results) => {
    if (results) {
      console.log(results);
      // res.status(200).json(results);
      // let unique_order_ids = [...new Set(data.map(item => item.id))];

      const orders = new Map();
      for (let i = 0; i < results.length; i++) {
        const orderEntry = results[i];
        if (orders.has(orderEntry.id)) {
          orders.get(orderEntry.id).dishes.push({
            name: orderEntry.dish_name,
            id: orderEntry.dish_id,
            quantity: orderEntry.quantity,
            price: orderEntry.price,
          });
        } else {
          let address = null;
          if (orderEntry.cust_city && orderEntry.cust_state && orderEntry.cust_country) {
            address = (`${orderEntry.cust_city}, ${orderEntry.cust_state}, ${orderEntry.cust_country}`);
          }
          const order = {
            id: orderEntry.id,
            rest_id: orderEntry.rest_id,
            cust_id: orderEntry.cust_id,
            cust_name: orderEntry.cust_name,
            cust_phone: orderEntry.cust_phone,
            cust_email_id: orderEntry.cust_email_id,
            cust_address: address,
            cust_dob: orderEntry.cust_dob,
            cust_about: orderEntry.cust_about,
            cust_join_date: orderEntry.cust_join_date,
            cust_blog_url: orderEntry.cust_blog_url,
            status: orderEntry.status,
            delivery_method: orderEntry.delivery_method,
            create_time: orderEntry.create_time,
            dishes: [{
              name: orderEntry.dish_name,
              id: orderEntry.dish_id,
              quantity: orderEntry.quantity,
              price: orderEntry.price,
            }],
          };
          console.log('Order: ', order);
          orders.set(orderEntry.id, order);
        }
      }
      console.log(orders);
      res.status(200).json([...orders.values()]);
    }

    if (error) {
      console.error('Error Fetching Restaurant Orders : ', error);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end('Fetching Restaurant Orders Failed! ', error.message);
    }
  });
});

// Create an event
app.post('/events', (req, res) => {
  console.log('Create an event POST Request');
  console.log('Req body: ', req.body);

  const createOrder = {
    rest_id: req.body.rest_id,
    name: req.body.name,
    description: req.body.description,
    time: req.body.time,
    date: req.body.date,
    location: req.body.location,
    hashtags: req.body.hashtags,
  };

  dbConnection('INSERT INTO events SET ?',
    createOrder, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json({ id: results.insertId });
      }
      if (error) {
        console.error('Error Creating an Event : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Event Creation Failed! ', error.message);
      }
    });
});

// Get all event
app.get('/events', (req, res) => {
  console.log('Get event method');
  dbConnection('SELECT * FROM `events` ORDER BY date, time ASC;',
    (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results);
      }
      if (error) {
        console.error('Error Fetching the event : ', req.params.event_id, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Event Fetch Failed! ', error.message);
      }
    });
});

// Register for an event
app.post('/customers/:cust_id/events', (req, res) => {
  console.log('Register for an event POST Request');
  console.log('Req body: ', req.body);

  const createOrder = {
    event_id: req.body.event_id,
    cust_id: req.params.cust_id,
  };

  dbConnection('INSERT INTO event_registrations SET ?',
    createOrder, (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).end();
      }
      if (error) {
        console.error('Error Registering to an Event : ', error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Event Registering Failed! ', error.message);
      }
    });
});

// Get all customer registered events
app.get('/customers/:cust_id/events', (req, res) => {
  console.log('Get all customer registered events');
  dbConnection('SELECT * FROM events e LEFT JOIN event_registrations er '
  + 'ON e.id = er.event_id where er.cust_id = ?;', [req.params.cust_id],
  (error, results) => {
    if (results) {
      console.log(results);
      res.status(200).json(results);
    }
    if (error) {
      console.error('Error Fetching the event registered by a customer : ', req.params.cust_id, error);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end('Registered Event Fetch Failed! ', error.message);
    }
  });
});

// Get all restaurant created events
app.get('/restaurants/:rest_id/events', (req, res) => {
  console.log('Get all restaurant created events');

  dbConnection('SELECT e.id, e.name, e.rest_id, e.description, e.time, e.date, e.location, e.hashtags, er.cust_id, cp.name as \'cust_name\', '
  + 'cp.phone as \'cust_phone\', cp.email_id as \'cust_email_id\', cp.city as \'cust_city\', cp.state as \'cust_state\', '
  + 'cp.country as \'cust_country\', cp.dob as \'cust_dob\', cp.about as \'cust_about\', cp.join_date as \'cust_join_date\', cp.blog_url  as \'cust_blog_url\' '
  + 'FROM yelp_schema.events e '
  + 'LEFT JOIN yelp_schema.event_registrations er ON e.id = er.event_id '
  + 'LEFT JOIN yelp_schema.cust_profile cp ON er.cust_id = cp.id '
  + 'WHERE (e.rest_id = ?) ORDER BY e.date, e.time ASC ;',
  req.params.rest_id, (error, results) => {
    if (results) {
      console.log(results);
      const events = new Map();
      for (let i = 0; i < results.length; i++) {
        const eventEntry = results[i];
        let address = null;
        if (eventEntry.cust_city && eventEntry.cust_state && eventEntry.cust_country) {
          address = (`${eventEntry.cust_city}, ${eventEntry.cust_state}, ${eventEntry.cust_country}`);
        }
        if (events.has(eventEntry.id)) {
          events.get(eventEntry.id).participants.push({
            cust_name: eventEntry.cust_name,
            cust_id: eventEntry.cust_id,
            cust_phone: eventEntry.cust_phone,
            cust_email_id: eventEntry.cust_email_id,
            cust_about: eventEntry.cust_about,
            cust_address: address,
            cust_dob: eventEntry.cust_dob,
            cust_blog_url: eventEntry.cust_blog_url,
            cust_join_date: eventEntry.cust_join_date,
          });
        } else {
          const event = {
            event_id: eventEntry.id,
            name: eventEntry.name,
            rest_id: eventEntry.rest_id,
            description: eventEntry.description,
            time: eventEntry.time,
            date: eventEntry.date,
            location: eventEntry.location,
            hashtags: eventEntry.hashtags,
            participants: eventEntry.cust_id === null ? [] : [{
              cust_name: eventEntry.cust_name,
              cust_id: eventEntry.cust_id,
              cust_phone: eventEntry.cust_phone,
              cust_email_id: eventEntry.cust_email_id,
              cust_address: address,
              cust_dob: eventEntry.cust_dob,
              cust_blog_url: eventEntry.cust_blog_url,
              cust_join_date: eventEntry.cust_join_date,
              cust_about: eventEntry.cust_about,
            }],
          };
          console.log('Event: ', event);
          events.set(eventEntry.id, event);
        }
      }
      console.log(events);
      res.status(200).json([...events.values()]);
    }

    if (error) {
      console.error('Error Fetching Restaurant Events : ', error);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end('Fetching Restaurant Events Failed! ', error.message);
    }
  });
});

// Get Event on search
app.get('/events/search', (req, res) => {
  console.log('Get Event on search', req.query);
  let search;
  if (req.query.search) {
    search = `%${req.query.search}%`;
  } else {
    search = '%%';
  }

  console.log('Get Restaurant on search of: ', search);
  dbConnection('SELECT * FROM events WHERE id IN (SELECT distinct(e.id) FROM events e WHERE e.name LIKE ?);',
    [search],
    (error, results) => {
      if (results) {
        console.log(results);
        res.status(200).json(results);
      }
      if (error) {
        console.error('Error Fetching the events for search: ', search, error);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Fetching the events for search Failed! ', error.message);
      }
    });
});

// Images of restaurant
app.post('/restaurants/:rest_id/images', (req, res) => {
  console.log('Upload Image!');
  uploadImage(req, res, (err) => {
    if (!err) {
      console.log('Images of restaurant POST Request');
      console.log('Req filename: ', req.file);

      const insertImage = {
        rest_id: req.params.rest_id,
        picture: fs.readFileSync(uploadDir + req.file.filename),
      };

      dbConnection('INSERT INTO rest_pictures SET ?',
        insertImage, (error, results) => {
          if (results) {
            res.status(200).json({
              image_id: results.insertId,
            });
          }
          if (error) {
            console.error('Error saving Images of restaurant : ', error);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end('Images of restaurant Save Failed! ', error.message);
          }
        });
    }
  });
});

// Get all ImageIds of restaurant
app.get('/restaurants/:rest_id/images/', (req, res) => {
  dbConnection('SELECT id FROM rest_pictures WHERE rest_id = ?;',
    [req.params.rest_id],
    (error, results) => {
      if (!error) {
        res.status(200).json(results.map((pic) => pic.id));
      } else {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Fetching the images for search Failed! ', error.message);
      }
    });
});

// Fetch image by id
app.get('/restaurants/:rest_id/images/:rest_image_id', (req, res) => {
  dbConnection('SELECT * FROM rest_pictures WHERE id = ? AND rest_id = ?;',
    [req.params.rest_image_id, req.params.rest_id],
    (error, results) => {
      if (results[0]) {
        // eslint-disable-next-line no-buffer-constructor
        const buf = new Buffer(results[0].picture, 'binary');
        res.status(200).end(buf);
      } else {
        res.writeHead(404, {
          'Content-Type': 'application/json',
        });
        res.end(`No image found for imageId ${req.params.rest_image_id}`);
      }
      if (error) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(`Image retrieval failed for image-id ${req.params.rest_image_id}`);
      }
    });
});

// Images of dish
app.post('/dishes/:dish_id/images', (req, res) => {
  console.log('Upload Image!');
  uploadImage(req, res, (err) => {
    if (!err) {
      console.log('Images of dish POST Request');
      console.log('Req filename: ', req.file);

      const insertImage = {
        dish_id: req.params.dish_id,
        picture: fs.readFileSync(uploadDir + req.file.filename),
      };

      dbConnection('INSERT INTO dish_pictures SET ?',
        insertImage, (error, results) => {
          if (results) {
            console.log('Success saving Images of a Dish');
            res.status(200).json({
              image_id: results.insertId,
            });
          }
          if (error) {
            console.error('Error saving Images of a Dish : ', error);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end('Images of Dish Save Failed! ', error.message);
          }
        });
    }
  });
});

// Get all ImageIds of restaurant
app.get('/dishes/:dish_id/images/', (req, res) => {
  dbConnection('SELECT id FROM dish_pictures WHERE dish_id = ?;',
    [req.params.dish_id],
    (error, results) => {
      if (!error) {
        res.status(200).json(results.map((pic) => pic.id));
      } else {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end('Fetching the images for dish Failed! ', error.message);
      }
    });
});

app.get('/dishes/:dish_id/images/:dish_image_id', (req, res) => {
  dbConnection('SELECT * FROM dish_pictures WHERE id = ? AND dish_id = ?;',
    [req.params.dish_image_id, req.params.dish_id],
    (error, results) => {
      if (results && results[0]) {
        // eslint-disable-next-line no-buffer-constructor
        const buf = new Buffer(results[0].picture, 'binary');
        res.status(200).end(buf);
      } else {
        res.writeHead(404, {
          'Content-Type': 'application/json',
        });
        res.end(`No image found for imageId ${req.params.dish_image_id}`);
      }
      if (error) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(`Image retrieval failed for image-id ${req.params.dish_image_id}`);
      }
    });
});

// Profile picture of customer
app.patch('/customers/:cust_id/images', (req, res) => {
  console.log('Upload Image!');
  uploadImage(req, res, (err) => {
    if (!err) {
      console.log('Images of customer POST Request');
      console.log('Req filename: ', req.file);

      const insertImage = {
        profile_picture: fs.readFileSync(uploadDir + req.file.filename),
      };

      dbConnection('UPDATE `cust_profile` SET ? WHERE `id` = ?',
        [insertImage, req.params.cust_id], (error, results) => {
          if (results) {
            res.status(200).end('Successfully Updated Profile Image');
          }
          if (error) {
            console.error('Error saving Profile Picture of customer : ', error);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end('Profile Picture of customer Save Failed! ', error.message);
          }
        });
    }
  });
});

// Get Profile picture of customer
app.get('/customers/:cust_id/images', (req, res) => {
  dbConnection('SELECT profile_picture FROM `cust_profile` WHERE id = ?;',
    req.params.cust_id,
    (error, results) => {
      console.log(results);
      if (results && results[0] && (results[0].profile_picture !== null)) {
        // eslint-disable-next-line no-buffer-constructor
        const buf = new Buffer(results[0].profile_picture, 'binary');
        res.status(200).end(buf);
      } else {
        res.sendFile(defaultUserImage);
      }
      if (error) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(`Image retrieval failed for image-id ${req.params.cust_id}`);
      }
    });
});

// start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');
