/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

//
// Pending Routes
//
// CustomerRestaurantPage - restaurant_detail
// Orders - rest_orders_put, cust_orders_post
// Dishes - dish_create, dish_edit, dish_get_perticular

const graphql = require('graphql');

const Customer = require('../dbSchema/cust_profile');
const Restaurant = require('../dbSchema/rest_profile');
const Order = require('../dbSchema/order');

const { customerLogin, restaurantLogin } = require('../mutations/login');
const { customerSignup, restaurantSignup } = require('../mutations/signup');
const { customerUpdate, restaurantUpdate } = require('../mutations/profile');
// const { addDish, updateDish } = require('../mutations/menu');
const { createOrder, updateOrder } = require('../mutations/orders');
const { addReview } = require('../mutations/reviews');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email_id: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    dob: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    nick_name: { type: GraphQLString },
    about: { type: GraphQLString },
    join_date: { type: GraphQLString },
    favourite_restaurant: { type: GraphQLString },
    favourite_hobby: { type: GraphQLString },
    blog_url: { type: GraphQLString },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: { type: GraphQLID },
    rating: { type: GraphQLInt },
    review: { type: GraphQLString },
    create_time: { type: GraphQLString },
  }),
});

const RestDishType = new GraphQLObjectType({
  name: 'RestDish',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    ingredients: { type: GraphQLString },
    price: { type: GraphQLString },
    category: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const RestaurantType = new GraphQLObjectType({
  name: 'Restaurant',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email_id: { type: GraphQLString },
    password: { type: GraphQLString },
    location: { type: GraphQLString },
    phone: { type: GraphQLString },
    description: { type: GraphQLString },
    timings: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    delivery_method: { type: GraphQLString },
    rest_dishes: {
      type: new GraphQLList(RestDishType),
      resolve(parent, args) {
        return parent.rest_dishes;
      },
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        return parent.reviews;
      },
    },
  }),
});

// not sure about orderType
const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    status: { type: GraphQLString },
    create_time: { type: GraphQLString },
    delivery_method: { type: GraphQLString },
    dish_name: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    restaurant_id: { type: GraphQLID },
    customer_id: { type: GraphQLID },
    restaurant_name: { type: GraphQLString },
    // restaurant: {
    //   type: RestaurantType,
    //   resolve(parent, args) {
    //     return Restaurant.find((restaurant) => restaurant.id === parent._id);
    //   },
    // },
    // customer: {
    //   type: CustomerType,
    //   resolve(parent, args) {
    //     return Customer.find((customer) => customer.id === parent._id);
    //   },
    // },
  }),
});

const StatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: { customer_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const customer = await Customer.findById(args.customer_id);
        if (customer) {
          return customer;
        }
      },
    },
    restaurant: {
      type: RestaurantType,
      args: { restaurant_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const restaurant = await Restaurant.findById(args.restaurant_id);
        if (restaurant) {
          return restaurant;
        }
      },
    },

    restaurants: {
      type: new GraphQLList(RestaurantType),
      args: { input: { type: GraphQLString } },
      async resolve(parent, args) {
        const restaurants = await Restaurant.find({name: {$regex :args.input}});
        // const restaurants = await Restaurant.find();
        if (restaurants) {
          return restaurants;
        }
      },
    },

    menu: {
      type: new GraphQLList(RestDishType),
      args: { restaurant_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const restaurant = await Restaurant.findById(args.restaurant_id);
        if (restaurant) {
          const menu = restaurant.rest_dishes;
          return menu;
        }
      },
    },

    dish: {
      type: new GraphQLList(RestDishType),
      args: { restaurant_id: { type: GraphQLString }, dish_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const restaurant = await Restaurant.find({ _id: args.restaurant_id, _id });
        if (restaurant) {
          const menu = restaurant.rest_dishes;
          return menu;
        }
      },
    },

    reviews: {
      type: new GraphQLList(ReviewType),
      args: { restaurant_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const restaurant = await Restaurant.findById(args.restaurant_id);
        if (restaurant) {
          const { reviews } = restaurant;
          return reviews;
        }
      },
    },

    customerOrders: {
      type: new GraphQLList(OrderType),
      args: { customer_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const orders = await Order.find({ customer_id: args.customer_id });
        if (orders) {
          return orders;
        }
      },
    },

    restaurantOrders: {
      type: new GraphQLList(OrderType),
      args: { restaurant_id: { type: GraphQLString } },
      async resolve(parent, args) {
        const orders = await Order.find({ restaurant_id: args.restaurant_id });
        if (orders) {
          return orders;
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return customerSignup(args);
      },
    },

    addRestaurant: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
        location: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return restaurantSignup(args);
      },
    },

    customerLogin: {
      type: StatusType,
      args: {
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return customerLogin(args);
      },
    },

    restaurantLogin: {
      type: StatusType,
      args: {
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return restaurantLogin(args);
      },
    },

    customerUpdate: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        phone: { type: GraphQLString },
        dob: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        nick_name: { type: GraphQLString },
        about: { type: GraphQLString },
        favourite_restaurant: { type: GraphQLString },
        favourite_hobby: { type: GraphQLString },
        blog_url: { type: GraphQLString },
        email_id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return customerUpdate(args);
      },
    },

    restaurantUpdate: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        phone: { type: GraphQLString },
        description: { type: GraphQLString },
        timings: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        delivery_method: { type: GraphQLString },
        email_id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return restaurantUpdate(args);
      },
    },

    createOrder: {
      type: StatusType,
      args: {
        customer_id: { type: GraphQLString },
        restaurant_id: { type: GraphQLString },
        delivery_method: { type: GraphQLString },
        dish_name: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        restaurant_name: { type: GraphQLString }
      },
      async resolve(parent, args) {
        return createOrder(args);
      },
    },

    updateOrder: {
      type: StatusType,
      args: {
        order_id: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return updateOrder(args);
      },
    },

    addReview: {
      type: StatusType,
      args: {
        rating: { type: GraphQLString },
        review: { type: GraphQLString },
        restaurant_id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return addReview(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
