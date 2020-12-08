const Restaurant = require("../dbSchema/rest_profile");

const getDish = async (args) => {
    let foundDish = false
    let restaurant = await Restaurant.findById(args.restaurant_id);
    if (restaurant) {
        if(restaurant.rest_dishes.length > 0) {
            for(i = 0; i < restaurant.rest_dishes.length; i++) {
                if(restaurant.rest_dishes[i]._id+"" === args.dish_id) {
                    foundDish = true;
                    return restaurant.rest_dishes[i];
                }
            }
        }
        if (!foundDish) {
            return { status: 400, message: "DISH_NOT_PRESENT" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

const addDish = async (args) => {
    console.log(args.restaurant_id)
    let restaurant = await Restaurant.findById(args.restaurant_id);
    if (restaurant) {
        let newDish = {
            name: args.name,
            description: args.description,
            price: args.price,
            category: args.category,
            ingredients: args.ingredients,
        };
        restaurant.rest_dishes.push(newDish);
        let dishAdded = await restaurant.save();
        if (dishAdded) {
            return { status: 200, message: "DISH_ADDED" };
        }
        else {
            console.log("I am here")
            return { status: 500, message: "INTERNAL_SERVER_ERROR" };
        }
    }
    else {
        console.log("or here")
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

const updateDish = async (args) => {
    let restaurant = await Restaurant.findById(args.restaurant_id);
    if (restaurant) {
        let dishAdded = await restaurant.save();
        if (dishAdded) {
            return { status: 200, message: "DISH_ADDED" };
        }
        else {
            return { status: 500, message: "INTERNAL_SERVER_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

exports.getDish = getDish;
exports.updateDish = updateDish;
exports.addDish = addDish;