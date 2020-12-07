//   updateOrder: {
//     type: StatusType,
//     args: {
//       order_id: { type: GraphQLString },
//       status: { type: GraphQLString },
//     },
//     async resolve(parent, args) {
//       return updateOrder(args);
//     },
//   },

const Order = require("../dbSchema/order");

const createOrder = async (args) => {
    let new_order = new Order({
        customer_id: args.customer_id,
        restaurant_id: args.restaurant_id,
        status: "New Order",
        delivery_method: args.delivery_method,
        dish_name: args.dish_name,
        quantity: args.quantity,
        restaurant_name: args.restaurant_name,
        create_time: new Date(Date.now()).toLocaleDateString("en-US", {year: 'numeric', month: 'short', day: 'numeric'})
    });

    let success = await new_order.save();
    if (success) {
        return { status: 200, message: 'ORDER_PLACED' };
    }
    else {
        return { status: 500, message: 'ORDER_PLACE_ERROR' };
    }
};

const updateOrder = async (args) => {
    let order = await Order.findById(args.order_id);
    if (order) {
        order.status = args.status;

        let updated = await order.save();
        if (updated) {
            return { status: 200, message: "ORDER_UPDATED" };
        }
        else {
            return { status: 500, message: "ORDER_UPDATE_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

exports.createOrder = createOrder;
exports.updateOrder = updateOrder;