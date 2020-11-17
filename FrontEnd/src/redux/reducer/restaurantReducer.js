import { RESTAURANT_LOGIN_SUCCESS, 
        RESTAURANT_LOGIN_FAILURE, 
        RESTAURANT_SIGNUP_SUCCESS, 
        RESTAURANT_SIGNUP_FAILURE, 
        RESTAURANT_PROFILE_GET_SUCCESS,
        RESTAURANT_PROFILE_UPDATE_SUCCESS,
        RESTAURANT_PROFILE_UPDATE_FAILED,
        LOGOUT
    } from "../action/actions";

const initialState = {
    showFailure: false,
    signupCompleted:false,
    restaurant_id: null
};

const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESTAURANT_LOGIN_SUCCESS:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted:false,
                restaurant_id: action.id
              });
        case RESTAURANT_LOGIN_FAILURE:
            return Object.assign({}, state, {
                showFailure: true,
                signupCompleted:false,
                restaurant_id: null
              });
        case RESTAURANT_SIGNUP_SUCCESS:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted:true,
                restaurant_id: null
              });
        case RESTAURANT_SIGNUP_FAILURE:
            return Object.assign({}, state, {
                showFailure: true,
                signupCompleted:false,
                restaurant_id: null
            });
        case RESTAURANT_PROFILE_GET_SUCCESS: 
            return Object.assign({}, state, {
                restaurant: action.restaurant
            });
        case RESTAURANT_PROFILE_UPDATE_SUCCESS: 
            return Object.assign({}, state, {
                restaurant: action.restaurant
            });
        case RESTAURANT_PROFILE_UPDATE_FAILED: 
            return Object.assign({}, state, {
                showFailure: true
            });
        case LOGOUT:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted: false,
                restaurant_id: null
            });
            default:
            return state;
    }
  };

export default restaurantReducer;