const graphql = require('graphql');

const Customer = require("../dbSchema/cust_profile");
const Restaurant = require("../dbSchema/rest_profile");
const Order = require("../dbSchema/order");

const { customerLogin, restaurantLogin } = require('../mutations/login');
const { customerSignup, restaurantSignup } = require('../mutations/signup');
const { customerUpdate, restaurantUpdate } = require('../mutations/profile');
// const { addDish, updateDish } = require('../mutations/dishes');
// const { createOrder, updateOrder } = require('../mutations/dishes');
// const { addReview } = require('../mutations/reviews');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
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
        blog_url: { type: GraphQLString }
    })
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
            }
        },
        reviews: {
            type: new GraphQLList(ReviewType),
            resolve(parent, args) {
                return parent.reviews;
            }
        }
    })
});

const ReviewType = new GraphQLObjectType({
    name: 'Review',
    fields: () => ({
        id: { type: GraphQLID },
        rating: { type: GraphQLInt },
        review: { type: GraphQLString },
        create_time: { type: GraphQLString }
    })
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
        delivery_method: { type: GraphQLString },
        restaurant: { 
            type: RestaurantType,
            resolve(parent, args) {
                return Restaurant.find(restaurant => restaurant.id === parent._id);
            }
         },
        customer: {
            type: CustomerType,
            resolve(parent, args) {
                return Customer.find(customer => customer.id === parent._id);
            }
        }
    })
});

const RestDishType = new GraphQLObjectType({
    name: 'RestDish',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        ingredients: { type: GraphQLString },
        price: { type: GraphQLInt },
        category: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});

const StatusType = new GraphQLObjectType({
    name: 'Status',
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: { customer_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let customer = await Customer.findById(args.customer_id);
                if (customer) {
                    return customer;
                }
            }
        },
        restaurant: {
            type: RestaurantType,
            args: { restaurant_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let restaurant = await Restaurant.findById(args.restaurant_id);
                if (restaurant) {
                    return restaurant;
                }
            }
        },
// Check if i can write restaurant search query here
        // restaurants: {
        //     type: new GraphQLList(RestaurantType),
        //     args: { input: { type: GraphQLString } },
        //     async resolve(parent, args) {
        //         return restaurantSearch(args);
        //     }
        // },


// mano
        // owner: {
        //     type: UserType,
        //     args: { user_id: { type: GraphQLString } },
        //     async resolve(parent, args) {
        //         let user = await User.findById(args.user_id);
        //         if (user) {
        //             return user;
        //         }
        //     }
        // },
        // menu: {
        //     type: new GraphQLList(MenuSectionType),
        //     args: { user_id: { type: GraphQLString } },
        //     async resolve(parent, args) {
        //         let user = await User.findById(args.user_id);
        //         if (user) {
        //             let sections = user.restaurant.menu_sections;
        //             return sections;
        //         }
        //     }
        // },
        // restaurants: {
        //     type: new GraphQLList(RestaurantType),
        //     args: { input: { type: GraphQLString } },
        //     async resolve(parent, args) {
        //         let owners = await User.find({ is_owner: true });
        //         let restaurants = owners.map(owner => owner.restaurant);
        //         return restaurants;
        //     }
        // },
        // menu_sections: {
        //     type: new GraphQLList(MenuSectionType),
        //     args: { user_id: { type: GraphQLString } },
        //     async resolve(parent, args) {
        //         let user = await User.findById(args.user_id);
        //         return user.restaurant.menu_sections;
        //     }
        // }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: StatusType,
            args: {
                name: { type: GraphQLString },
                email_id: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return customerSignup(args);
            }
        },

        addRestaurant: {
            type: StatusType,
            args: {
                name: { type: GraphQLString },
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
                location: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return restaurantSignup(args);
            }
        },

        customerLogin: {
            type: StatusType,
            args: {
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                return customerLogin(args);
            }
        },

        restaurantLogin: {
            type: StatusType,
            args: {
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                return restaurantLogin(args);
            }
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
                blog_url: { type: GraphQLString }
            },
            resolve(parent, args) {
                return customerUpdate(args);
            }
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
            },
            resolve(parent, args) {
                return restaurantUpdate(args);
            }
        },

        // addOwner: {
        //     type: StatusType,
        //     args: {
        //         name: { type: GraphQLString },
        //         email_id: { type: GraphQLString },
        //         password: { type: GraphQLString },
        //         address: { type: GraphQLString },
        //         phone_number: { type: GraphQLString },
        //         res_name: { type: GraphQLString },
        //         res_cuisine: { type: GraphQLString },
        //         res_zip_code: { type: GraphQLString }
        //     },
        //     async resolve(parent, args) {
        //         return ownerSignup(args);
        //     }
        // },
        // updateCustomer: {
        //     type: StatusType,
        //     args: {
        //         name: { type: GraphQLString },
        //         email_id: { type: GraphQLString },
        //         password: { type: GraphQLString },
        //         address: { type: GraphQLString },
        //         phone_number: { type: GraphQLString }
        //     },
        //     resolve(parent, args) {
        //         return updateCustomer(args);
        //     }
        // },
        // updateOwner: {
        //     type: StatusType,
        //     args: {
        //         name: { type: GraphQLString },
        //         email_id: { type: GraphQLString },
        //         password: { type: GraphQLString },
        //         address: { type: GraphQLString },
        //         phone_number: { type: GraphQLString },
        //         res_name: { type: GraphQLString },
        //         res_cuisine: { type: GraphQLString },
        //         res_zip_code: { type: GraphQLString }
        //     },
        //     resolve(parent, args) {
        //         return updateOwner(args);
        //     }
        // },
        // addMenuSection: {
        //     type: StatusType,
        //     args: {
        //         menu_section_name: { type: GraphQLString },
        //         user_id: { type: GraphQLString }
        //     },
        //     resolve(parent, args) {
        //         return addMenuSection(args);
        //     }
        // },
        // addMenuItem: {
        //     type: StatusType,
        //     args: {
        //         menu_section_name: { type: GraphQLString },
        //         user_id: { type: GraphQLString },
        //         item_name: { type: GraphQLString },
        //         item_description: { type: GraphQLString },
        //         item_price: { type: GraphQLString }
        //     },
        //     resolve(parent, args) {
        //         return addMenuItem(args);
        //     }
        // },
        // login: {
        //     type: StatusType,
        //     args: {
        //         email_id: { type: GraphQLString },
        //         password: { type: GraphQLString },
        //     },
        //     resolve(parent, args) {
        //         return login(args);
        //     }
        // },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});