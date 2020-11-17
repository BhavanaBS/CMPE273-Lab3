import axios from 'axios';
import { RESTAURANT_LOGIN_FAILURE, 
        RESTAURANT_LOGIN_SUCCESS, 
        RESTAURANT_SIGNUP_FAILURE, 
        RESTAURANT_SIGNUP_SUCCESS,
        RESTAURANT_PROFILE_GET_SUCCESS,
        RESTAURANT_PROFILE_GET_FAILED,
        RESTAURANT_PROFILE_UPDATE_SUCCESS,
        RESTAURANT_PROFILE_UPDATE_FAILED  } from "./actions";
import backend from '../../components/common/serverDetails';

// Event messages
// The function called at the end of the login call.
export function setRestaurantLoginSuccess(id) {
    console.log("Restaurant Login Success Action Creator for restaurant_id ", id)
    return {
      type: RESTAURANT_LOGIN_SUCCESS,
      id,
    };
}

// The function called at the end of the login call.
export function setRestaurantLoginFailed() {
    console.log("Restaurant Login Failure Action Creator")
    return {
      type: RESTAURANT_LOGIN_FAILURE,
    };
}

// The function called at the end of the login call.
export function setRestaurantSignupSuccess(id) {
    console.log("Restaurant Signup Success Action Creator with restaurant_id ", id)
    return {
      type: RESTAURANT_SIGNUP_SUCCESS,
      id,
    };
}

// The function called at the end of the login call.
export function setRestaurantSignupFailed() {
    console.log("Restaurant Signup Failure Action Creator")
    return {
      type: RESTAURANT_SIGNUP_FAILURE,
    };
}

export function getRestaurantSuccess(restaurant) {    
    console.log("Sending Restaurant Get Success Action")
    return {
        type: RESTAURANT_PROFILE_GET_SUCCESS,
        restaurant
    }
}

export function getRestaurantFailed() {    
    console.log("Sending Restaurant Get Failed Action")
    return {
        type: RESTAURANT_PROFILE_GET_FAILED
    }
}

export function updateRestaurantSuccess(restaurant) {
    console.log("Restaurant Update Action Creator", restaurant)
    return {
      type: RESTAURANT_PROFILE_UPDATE_SUCCESS,
      restaurant
    };
}

export function updateRestaurantFailed() {
    console.log("Restaurant Signup Failure Action Creator")
    return {
      type: RESTAURANT_PROFILE_UPDATE_FAILED
    };
}

// ACTION CREATORS

// Action creator for RESTAURANT_LOGIN action
// Data has restaurant email_id and password
export function loginToRestaurant(data) {
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backend}/restaurants/login`, data)
            .then(response => {
                console.log("Status Code : ", response.status, "Response JSON : ", response.data);
                if (response.status === 200) {
                    dispatch(setRestaurantLoginSuccess(response.data.id));
                } else {
                    console.log("Login Failed!");
                    dispatch(setRestaurantLoginFailed());
                }
            })
            .catch((error) => {
                console.log("Login Failed!", error);
                dispatch(setRestaurantLoginFailed());
            });
    }
}

export function signupAsRestaurant(data) {
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backend}/restaurants`, data)
            .then(response => {
                console.log("Restaurant Signup Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    dispatch(setRestaurantSignupSuccess(response.data.id));
                    
                } else {
                    console.log("Restaurant Signup Failed!");
                    dispatch(setRestaurantSignupFailed());
                }
            })
            .catch((error) => {
                console.log("Restaurant Signup Failed!", error);
                dispatch(setRestaurantSignupFailed());
            });
    }
}

export function getRestaurant(restaurantId) {
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get(`${backend}/restaurants/${restaurantId}`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200 && response.data) {
                    console.log("Fetching restaurant details success!", response.data);
                    dispatch(getRestaurantSuccess(response.data));
                } else {
                    console.log("Fetching restaurant details failed!");
                    dispatch(getRestaurantFailed());
                }
            })
            .catch((error) => {
                console.log("Fetching restaurant details failed!", error);
                dispatch(getRestaurantFailed());
            });
    }
}

export function updateRestaurant(data) {
    console.log("restaurantActions -> updateRestaurant -> method entered");
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.put(`${backend}/restaurants/${data.id}`, data)
            .then(response => {
                console.log("restaurantActions -> updateRestaurant -> Restaurant update status code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    dispatch(updateRestaurantSuccess(response.data));
                    
                } else {
                    console.log("restaurantActions -> updateRestaurant -> Restaurant update failed!");
                    dispatch(updateRestaurantFailed());
                }
            })
            .catch((error) => {
                console.log("restaurantActions -> updateRestaurant -> Restaurant update Failed!", error);
                dispatch(updateRestaurantFailed());
            });
    }
}
