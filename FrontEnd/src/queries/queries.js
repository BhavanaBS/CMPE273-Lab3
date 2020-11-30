import { gql } from 'apollo-boost';

const getRestaurantsQuery = gql`
    query($input: String){
        restaurants(input: $input) {
            res_name
            res_cuisine
            res_address
            res_phone_number
            res_zip_code
            owner_user_id
        }
    }
`;


export { getRestaurantsQuery };