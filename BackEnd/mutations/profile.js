const User = require("../dbSchema/users");
const passwordHash = require('password-hash');

const updateCustomer = async (args) => {
    let hashedPassword;
    if (args.password)
        hashedPassword = passwordHash.generate(args.password);
    let user = await User.findOne({ email_id: args.email_id });
    if (user) {
        user.name = args.name;
        user.password = hashedPassword || user.password;
        user.address = args.address;
        user.phone_number = args.phone_number;
        let savedUser = await user.save();
        if (savedUser) {
            return { status: 200, message: "USER_UPDATED" };
        }
        else {
            return { status: 500, message: "INTERNAL_SERVER_ERROR" };
        }
    }
    else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

const updateOwner = async (args) => {
    let hashedPassword;
    if (args.password)
        hashedPassword = passwordHash.generate(args.password);
    let user = await User.findOne({ email_id: args.email_id });
    if (user) {
        user.name = args.name;
        user.password = hashedPassword || user.password;
        user.address = args.address;
        user.phone_number = args.phone_number;
        user.restaurant.res_name = args.res_name;
        user.restaurant.res_cuisine = args.res_cuisine;
        user.restaurant.res_zip_code = args.res_zip_code;
        let savedUser = await user.save();
        if (savedUser) {
            return { status: 200, message: "USER_UPDATED" };
        }
        else {
            return { status: 500, message: "INTERNAL_SERVER_ERROR" };
        }
    } else {
        return { status: 500, message: "INTERNAL_SERVER_ERROR" };
    }
};

exports.updateCustomer = updateCustomer;
exports.updateOwner = updateOwner;