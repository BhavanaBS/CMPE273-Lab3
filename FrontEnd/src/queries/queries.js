import { gql } from 'apollo-boost';

const getRestaurantQuery = gql`
    query($restaurant_id: String){
        restaurant(restaurant_id: $restaurant_id) {
            name
            email_id
            location
            delivery_method
            phone
            description
            timings
            cuisine
        }
    }
`;

const getCustomerQuery = gql`
    query($customer_id: String){
        customer(customer_id: $customer_id) {
            name
            email_id
            phone
            dob
            city
            state
            country
            nick_name
            about
            join_date
            favourite_restaurant
            favourite_hobby
            blog_url
        }
    }
`;

const getRestaurantsQuery = gql`
    query($input: String){
        restaurants(input: $input) {
            id
            name
            email_id
            location
            password
            delivery_method
            phone
            description
            timings
            cuisine
            rest_dishes {
                id
                name
                ingredients
                price
                category
                description
            }
            reviews {
                rating
                review
                create_time
            }
        }
    }
`;

const getCustomerOrdersQuery = gql`
    query($customer_id: String){
        customerOrders(customer_id: $customer_id) {
            status
            create_time
            delivery_method
            dish_name
            quantity
            restaurant_name
        }
    }
`;

export { getRestaurantQuery, getCustomerQuery, getRestaurantsQuery,
    getCustomerOrdersQuery};