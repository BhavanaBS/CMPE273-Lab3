const Customer = require("../dbSchema/cust_profile");
const Restaurant = require("../dbSchema/rest_profile");

const customerUpdate = async (args) => {
    let customer = await Customer.findOne({ email_id: args.email_id });
    if (customer) {

        customer.name = args.name;
        customer.phone = args.phone;
        customer.dob = args.dob;
        customer.city = args.city;
        customer.state = args.state;
        customer.country = args.country;
        customer.nick_name = args.nick_name;
        customer.about = args.about;
        customer.favourite_restaurant = args.favourite_restaurant;
        customer.favourite_hobby = args.favourite_hobby;
        customer.blog_url = args.blog_url;

        let updated = await user.save();
        if (updated) {
            return { status: 200, message: "CUSTOMER_UPDATED" };
        }
        else {
            return { status: 500, message: "CUSTOMER_UPDATE_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

const restaurantUpdate = async (args) => {
    let restaurant = await Restaurant.findOne({ email_id: args.email_id });
    if (restaurant) {
        restaurant.name = args.name;
        restaurant.location = args.location;
        restaurant.phone = args.phone;
        restaurant.description = args.description;
        restaurant.timings = args.timings;
        restaurant.cuisine = args.cuisine;
        restaurant.delivery_method = args.delivery_method;
        
        let updated = await restaurant.save();
        if (updated) {
            return { status: 200, message: "RESTAURANT_UPDATED" };
        }
        else {
            return { status: 500, message: "RESTAURANT_UPDATE_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

exports.customerUpdate = customerUpdate;
exports.restaurantUpdate = restaurantUpdate;