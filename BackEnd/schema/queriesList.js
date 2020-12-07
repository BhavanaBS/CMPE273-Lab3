// Queries List

// query{
//     customer(customer_id:"5f8e81eca5b8ff52e61d1af5"){
//       name
//       email_id
//       nick_name
//       phone
//       dob
//       city
//       state
//       country
//       about
//       join_date
//       favourite_hobby
//       favourite_restaurant
//       blog_url
//     }
//   }
  
//   query{
//     restaurant(restaurant_id:"5f98f45286232a79557013c5"){
//       id
//       name
//       email_id
//       location
//       password
//       delivery_method
//       phone
//       description
//       timings
//       cuisine
//       rest_dishes {
//         id
//         name
//         ingredients
//         price
//         category
//         description
//       }
//       reviews{
//         rating
//         review
//         create_time
//       }
//     }
//   }

//   query{
//     restaurants(input:""){
//       id
//       name
//       email_id
//       location
//       password
//       delivery_method
//       phone
//       description
//       timings
//       cuisine
//       rest_dishes {
//         id
//         name
//         ingredients
//         price
//         category
//         description
//       }
//       reviews{
//         rating
//         review
//         create_time
//       }
//     }
//   }
  
// To fetch all restaurants, with out an input parameter. Not using this as of now in the project
// query{
//     restaurants{
//       id
//       name
//       email_id
//       location
//       password
//       delivery_method
//       phone
//       description
//       timings
//       cuisine
//       rest_dishes {
//         id
//         name
//         ingredients
//         price
//         category
//         description
//       }
//       reviews{
//         rating
//         review
//         create_time
//       }
//     }
//   }
  
// query{
//     restaurant(restaurant_id: "5f98f45286232a79557013c5") {
//       name
//       email_id
//       location
//       delivery_method
//       phone
//       description
//       timings
//       cuisine
//       __typename
//     }
//   }

// Fetch all customer orders
// query{
//     customerOrders(customer_id: "5f8e81eca5b8ff52e61d1af5") {
//       id
//       status
//       create_time
//       delivery_method
//       dish_name
//       quantity
//       restaurant_id
//       restaurant_name
//     }
//   }

// Fetch all restaurant orders
// query{
//     restaurantOrders(restaurant_id: "5f98f45286232a79557013c5") {
//       id
//       status
//       create_time
//       delivery_method
//       dish_name
//       quantity
//     }
//   }

// To fetch all reviews of a restaurant
// query{
//     reviews(restaurant_id: "5f98f45286232a79557013c5") {
//       rating
//     review
//     create_time
//     }
//   } 

// Restaurant Menu
// query{
//     menu(restaurant_id: "5f98f45286232a79557013c5") {
//         name
//         id
//         ingredients
//         description
//         price
//         category
//     }
// }

