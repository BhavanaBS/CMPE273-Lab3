import { CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAILURE, CUSTOMER_SIGNUP_SUCCESS, CUSTOMER_SIGNUP_FAILURE, LOGOUT } from "../action/actions";
import { CUSTOMER_PROFILE_GET_SUCCESS, 
    CUSTOMER_PROFILE_UPDATE_SUCCESS, 
    CUSTOMER_PROFILE_UPDATE_FAILED } from "../action/actions";

const initialState = {
    showFailure: false,
    signupCompleted: false,
    customer_id: null
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_LOGIN_SUCCESS:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted: false,
                customer_id: action.id
              });
        case CUSTOMER_SIGNUP_SUCCESS:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted: true,
                customer_id: null
            });
        case CUSTOMER_LOGIN_FAILURE:
            return Object.assign({}, state, {
                showFailure: true,
                signupCompleted: false,
                customer_id: null
              });
        case CUSTOMER_SIGNUP_FAILURE:
            return Object.assign({}, state, {
                showFailure: true,
                signupCompleted: false,
                customer_id: null
            });
        case CUSTOMER_PROFILE_GET_SUCCESS: 
            return Object.assign({}, state, {
                customer: action.customer
            });
        case CUSTOMER_PROFILE_UPDATE_SUCCESS: 
            return Object.assign({}, state, {
                showFailure: false,
                customer: action.customer
            });
        case CUSTOMER_PROFILE_UPDATE_FAILED: 
            return Object.assign({}, state, {
                showFailure: true
            });
        case LOGOUT:
            return Object.assign({}, state, {
                showFailure: false,
                signupCompleted: false,
                customer_id: null
            });            
        default:
            return state;
    }
  };

export default customerReducer;