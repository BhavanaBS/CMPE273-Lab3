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

const customerUpdateMutation = gql`
mutation CustomerUpdate($email_id: String, $name: String, $phone: String, 
    $dob: String, $city: String, $state: String, $country: String,
    $nick_name: String, $about: String, $favourite_restaurant: String,
    $favourite_hobby: String, $blog_url:String){
    customerUpdate(email_id: $email_id, name: $name, phone: $phone, 
        dob: $dob, city: $city, state: $state, country: $country,
        nick_name: $nick_name, about: $about, favourite_restaurant: $favourite_restaurant, 
        favourite_hobby: $favourite_hobby, blog_url:$blog_url){
        message
        status
    }
}
`;

export { addCustomerMutation, addRestaurantMutation, 
    customerLoginMutation, restaurantLoginMutation, 
    customerUpdateMutation, restaurantUpdateMutation};