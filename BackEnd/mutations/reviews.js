const Restaurant = require("../dbSchema/rest_profile");

const addReview = async (args) => {
    let restaurant = await Restaurant.findOne({ _id: args.restaurant_id });
    if (restaurant) {

        let new_review = {
            rating: args.rating,
            review: args.review,
            create_time: new Date(Date.now()).toLocaleDateString("en-US", {year: 'numeric', month: 'short', day: 'numeric'})
        };

        restaurant.reviews.push(new_review);
        let added = await user.save();
        if (added) {
            return { status: 200, message: "REVIEW_ADDED" };
        }
        else {
            return { status: 500, message: "INTERNAL_SERVER_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};