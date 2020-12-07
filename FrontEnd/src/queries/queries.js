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


export { getRestaurantQuery };