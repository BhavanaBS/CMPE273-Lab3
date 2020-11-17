import axios from 'axios';
import { CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAILURE, CUSTOMER_SIGNUP_SUCCESS, CUSTOMER_SIGNUP_FAILURE  } from "./actions";
import { CUSTOMER_PROFILE_GET_SUCCESS, 
    CUSTOMER_PROFILE_GET_FAILED, 
    CUSTOMER_PROFILE_UPDATE_SUCCESS, 
    CUSTOMER_PROFILE_UPDATE_FAILED,  } from "./actions";
import backend from '../../components/common/serverDetails';

// Action creator for CUSTOMER_LOGIN action
// Data has CUSTOMER email_id and password
export const loginToCustomer = (data) => {
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backend}/customers/login`, data)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    dispatch(setCustomerLoginSuccess(response.data.id));
                } else {
                    console.log("Login Failed!");
                    dispatch(setCustomerLoginFailed());
                }
            })
            .catch((error) => {
                console.log("Login Failed!", error);
                dispatch(setCustomerLoginFailed());
            });
    }
}

// The function called at the end of the login call.
export function setCustomerLoginSuccess(id) {
    console.log("Customer Login Success Action Creator for customer_id ", id)
    return {
      type: CUSTOMER_LOGIN_SUCCESS,
      id,
    };
}

// The function called at the end of the login call.
export function setCustomerLoginFailed() {
    console.log("Customer Login Failure Action Creator")
    return {
      type: CUSTOMER_LOGIN_FAILURE,
    };
}

export function signupAsCustomer(data) {
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backend}/customers`, data)
            .then(response => {
                console.log("Customer Signup Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    dispatch(setCustomerSignupSuccess(response.data.id));
                } else {
                    console.log("Customer Signup Failed!");
                    dispatch(setCustomerSignupFailed());
                }
            })
            .catch((error) => {
                console.log("Customer Signup Failed!", error);
                dispatch(setCustomerSignupFailed());
            });
    }
}

// The function called at the end of the login call.
export function setCustomerSignupSuccess(id) {
    console.log("Customer Signup Success Action Creator with customer_id ", id)
    return {
      type: CUSTOMER_SIGNUP_SUCCESS,
      id,
    };
}

// The function called at the end of the login call.
export function setCustomerSignupFailed() {
    console.log("Customer Signup Failure Action Creator")
    return {
      type: CUSTOMER_SIGNUP_FAILURE,
    };
}

export function getCustomerSuccess(customer) {    
    console.log("Sending Customer Get Success Action")
    return {
        type: CUSTOMER_PROFILE_GET_SUCCESS,
        customer
    }
}

export function getCustomerFailed() {    
    console.log("Sending Customer Get Failed Action")
    return {
        type: CUSTOMER_PROFILE_GET_FAILED
    }
}

export function getCustomer(customerId) {
    console.log("customerActions -> updateCustomer -> method entered");
    return dispatch => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get(`${backend}/customers/${customerId}`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200 && response.data) {
                    console.log("Fetching Customer details success!", response.data);
                    dispatch(getCustomerSuccess(response.data));
                } else {
                    console.log("Fetching Customer details failed!");
                    dispatch(getCustomerFailed());
                }
            })
            .catch((error) => {
                console.log("Fetching Customer details failed!", error);
                dispatch(getCustomerFailed());
            });
    }
}

export function getCustomerUpdateAboutSuccess(customer) {    
    console.log("Sending Customer updateCustomer Success Action")
    return {
        type: CUSTOMER_PROFILE_UPDATE_SUCCESS,
        customer
    }
}

export function getCustomerUpdateAboutFailed() {    
    console.log("Sending Customer updateCustomer Failed Action")
    return {
        type: CUSTOMER_PROFILE_UPDATE_FAILED
    }
}
export function updateAboutCustomer(data) {
    console.log("customerActions -> updateCustomer -> method entered");
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.put(`${backend}/customers/profile/${data.id}`, data)
            .then(response => {
                console.log("customerActions -> updateCustomer -> Customer update status code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    dispatch(getCustomerUpdateAboutSuccess(response.data));
                    
                } else {
                    console.log("customerActions -> updateCustomer -> Customer update failed!");
                    dispatch(getCustomerUpdateAboutFailed());
                }
            })
            .catch((error) => {
                console.log("customerActions -> updateCustomer -> Customer update Failed!", error);
                dispatch(getCustomerUpdateAboutFailed());
            });
    }
}