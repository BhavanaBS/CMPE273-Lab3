const graphql = require('graphql');
const User = require("../dbSchema/users");
const { login } = require('../mutations/login');
const { customerSignup, ownerSignup } = require('../mutations/signup');
const { updateCustomer, updateOwner } = require('../mutations/profile');
const { addMenuSection, addMenuItem } = require('../mutations/menu');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email_id: { type: GraphQLString },
        password: { type: GraphQLString },
        address: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        restaurant: { type: RestaurantType }
    })
});

const RestaurantType = new GraphQLObjectType({
    name: 'Restaurant',
    fields: () => ({
        id: { type: GraphQLID },
        res_name: { type: GraphQLString },
        res_cuisine: { type: GraphQLString },
        res_zip_code: { type: GraphQLString },
        res_address: { type: GraphQLString },
        res_phone_number: { type: GraphQLString },
        owner_user_id: { type: GraphQLID },
        menu_sections: {
            type: new GraphQLList(MenuSectionType),
            resolve(parent, args) {
                return parent.menu_sections;
            }
        }
    })
});

const MenuSectionType = new GraphQLObjectType({
    name: 'Menu_Section',
    fields: () => ({
        _id: { type: GraphQLID },
        menu_section_name: { type: GraphQLString },
        menu_items: {
            type: new GraphQLList(MenuItemType),
            resolve(parent, args) {
                return parent.menu_items;
            }
        }
    })
});

const MenuItemType = new GraphQLObjectType({
    name: 'Menu_Item',
    fields: () => ({
        id: { type: GraphQLID },
        item_name: { type: GraphQLString },
        item_description: { type: GraphQLString },
        item_price: { type: GraphQLInt }
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
            type: UserType,
            args: { user_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let user = await User.findById(args.user_id);
                if (user) {
                    return user;
                }
            }
        },
        owner: {
            type: UserType,
            args: { user_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let user = await User.findById(args.user_id);
                if (user) {
                    return user;
                }
            }
        },
        menu: {
            type: new GraphQLList(MenuSectionType),
            args: { user_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let user = await User.findById(args.user_id);
                if (user) {
                    let sections = user.restaurant.menu_sections;
                    return sections;
                }
            }
        },
        restaurants: {
            type: new GraphQLList(RestaurantType),
            args: { input: { type: GraphQLString } },
            async resolve(parent, args) {
                let owners = await User.find({ is_owner: true });
                let restaurants = owners.map(owner => owner.restaurant);
                return restaurants;
            }
        },
        menu_sections: {
            type: new GraphQLList(MenuSectionType),
            args: { user_id: { type: GraphQLString } },
            async resolve(parent, args) {
                let user = await User.findById(args.user_id);
                return user.restaurant.menu_sections;
            }
        }
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
                password: { type: GraphQLString },
                address: { type: GraphQLString },
                phone_number: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return customerSignup(args);
            }
        },
        addOwner: {
            type: StatusType,
            args: {
                name: { type: GraphQLString },
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
                address: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                res_name: { type: GraphQLString },
                res_cuisine: { type: GraphQLString },
                res_zip_code: { type: GraphQLString }
            },
            async resolve(parent, args) {
                return ownerSignup(args);
            }
        },
        updateCustomer: {
            type: StatusType,
            args: {
                name: { type: GraphQLString },
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
                address: { type: GraphQLString },
                phone_number: { type: GraphQLString }
            },
            resolve(parent, args) {
                return updateCustomer(args);
            }
        },
        updateOwner: {
            type: StatusType,
            args: {
                name: { type: GraphQLString },
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
                address: { type: GraphQLString },
                phone_number: { type: GraphQLString },
                res_name: { type: GraphQLString },
                res_cuisine: { type: GraphQLString },
                res_zip_code: { type: GraphQLString }
            },
            resolve(parent, args) {
                return updateOwner(args);
            }
        },
        addMenuSection: {
            type: StatusType,
            args: {
                menu_section_name: { type: GraphQLString },
                user_id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return addMenuSection(args);
            }
        },
        addMenuItem: {
            type: StatusType,
            args: {
                menu_section_name: { type: GraphQLString },
                user_id: { type: GraphQLString },
                item_name: { type: GraphQLString },
                item_description: { type: GraphQLString },
                item_price: { type: GraphQLString }
            },
            resolve(parent, args) {
                return addMenuItem(args);
            }
        },
        login: {
            type: StatusType,
            args: {
                email_id: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                return login(args);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});