import { gql } from 'apollo-boost';

const addCustomerMutation = gql`
    mutation AddCustomer($name: String, $email_id: String, $password: String){
        addCustomer(name: $name, email_id: $email_id, password: $password){
            message
            status
        }
    }
`;

const addRestaurantMutation = gql`
mutation AddRestaurant($name: String, $email_id: String, $password: String, $location: String){
    addRestaurant(name: $name, email_id: $email_id, password: $password, location: $location){
        message
        status
    }
}
`;

const customerLoginMutation = gql`
mutation CustomerLogin($email_id: String, $password: String){
    customerLogin(email_id: $email_id, password: $password){
        message
        status
    }
}
`;

const restaurantLoginMutation = gql`
mutation RestaurantLogin($email_id: String, $password: String){
    restaurantLogin(email_id: $email_id, password: $password){
        message
        status
    }
}
`;

const restaurantUpdateMutation = gql`
mutation RestaurantUpdate($email_id: String, $name: String, $location: String,
     $phone: String, $description: String, $timings: String, $cuisine: String, $delivery_method: String){
    restaurantUpdate(email_id: $email_id, location: $location, name: $name,
        phone: $phone, description: $description, timings: $timings, cuisine: $cuisine, delivery_method: $delivery_method){
        message
        status
    }
}
`;

export { addCustomerMutation, addRestaurantMutation, customerLoginMutation, restaurantLoginMutation, restaurantUpdateMutation};