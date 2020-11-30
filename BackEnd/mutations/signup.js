const Restaurant = require("../dbSchema/rest_profile");
const Customer = require("../dbSchema/cust_profile");
const passwordHash = require('password-hash');

const restaurantSignup = async (args) => {
    let hashedPassword = passwordHash.generate(args.password);

    let newRestaurant = new User({
        name: args.name,
        email_id: args.email_id,
        password: hashedPassword,
        location: args.location,
    });

    let restaurant = await Restaurant.find({ email_id: args.email_id });
    if (restaurant.length) {
        return { status: 400, message: 'REST_PRESENT' };
    }
    let success = await newRestaurant.save();
    if (success) {
        return { status: 200, message: 'REST_SIGNUP_SUCCESS' };
    }
    else {
        return { status: 500, message: 'REST_SIGNUP_ERROR' };
    }
};

const customerSignup = async (args) => {
    let hashedPassword = passwordHash.generate(args.password);

    let newCustomer = new User({
        name: args.name,
        email_id: args.email_id,
        password: hashedPassword,
    });

    let customer = await Customer.find({ email_id: args.email_id });
    if (customer.length) {
        return { status: 400, message: 'CUST_PRESENT' };
    }
    let success = await newCustomer.save();
    if (success) {
        return { status: 200, message: 'CUST_SIGNUP_SUCCESS' };
    }
    else {
        return { status: 500, message: 'CUST_SIGNUP_ERROR' };
    }
};

exports.customerSignup = customerSignup;
exports.restaurantSignup = restaurantSignup;
