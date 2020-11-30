// const User = require("../dbSchema/users");

// const addMenuSection = async (args) => {
//     let user = await User.findOne({ _id: args.user_id });
//     if (user && user.is_owner) {
//         let section = await User.find({ $and: [{ "restaurant.menu_sections.menu_section_name": args.menu_section_name }, { _id: args.user_id }] });
//         if (section && section.length) {
//             return { status: 401, message: "SECTION_EXISTS" };
//         }
//         let menu_section = {
//             menu_section_name: args.menu_section_name
//         };
//         user.restaurant.menu_sections.push(menu_section);
//         let savedUser = await user.save();
//         if (savedUser) {
//             return { status: 200, message: "SECTION_ADDED" };
//         }
//         else {
//             return { status: 500, message: "INTERNAL_SERVER_ERROR" };
//         }
//     }
//     else {
//         return { status: 500, message: "INTERNAL_SERVER_ERROR" };
//     }
// };

// const addMenuItem = async (args) => {
//     let user = await User.findOne({ _id: args.user_id });
//     if (user && user.is_owner) {
//         let item = await User.find({ $and: [{ "restaurant.menu_sections.menu_section_name": args.menu_section_name }, { "restaurant.menu_sections.menu_items.item_name": args.item_name }, { _id: args.user_id }] });
//         if (item && item.length) {
//             return { status: 401, message: "ITEM_EXISTS" };
//         }
//         let menu_item = {
//             item_name: args.item_name,
//             item_description: args.item_description,
//             item_price: args.item_price
//         };
//         let index = user.restaurant.menu_sections.findIndex(section => section.menu_section_name === args.menu_section_name);
//         if (index > -1) {
//             user.restaurant.menu_sections[index].menu_items.push(menu_item);
//             let savedUser = await user.save();
//             if (savedUser) {
//                 return { status: 200, message: "ITEM_ADDED" };
//             }
//             else {
//                 return { status: 500, message: "INTERNAL_SERVER_ERROR" };
//             }
//         }
//         else {
//             return { status: 400, message: "BAD_REQUEST" };
//         }
//     }
//     else {
//         return { status: 500, message: "INTERNAL_SERVER_ERROR" };
//     }
// };

// exports.addMenuSection = addMenuSection;
// exports.addMenuItem = addMenuItem;