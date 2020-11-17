import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { connect } from "react-redux";
import { loginToCustomer } from "../../redux/action/customerActions";

//Define a Login Component
class CustomerLoginForm extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email_id: "",
            password: "",
            authFlag: false
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.customerLoginSubmitAction = this.customerLoginSubmitAction.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //username change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            email_id: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    customerLoginSubmitAction = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email_id: this.state.email_id,
            password: this.state.password
        }
        // Updating customer login props -> react component
        this.props.setCustomerLogin(data);
    }

    render() {
        // Redirect based on successful login.
        // 1. We set the cookie when we login.
        // 2. We set the redux state's restaurant.restaurant_id and map it to props.restaurant_id
        console.log("customerLogin.js -> Cookie : ", cookie.load('cookie'))
        if (cookie.load('cookie') && this.props.customer_id) {
            console.log("---------- LOADED COOKIE ------------")
            localStorage.setItem("customer_id", this.props.customer_id);
            return <Redirect to="/customer/home" />
        }

        let error = null;
        if (this.props.showFailure) {
            error = (
                <div>
                    <p style={{ color: "red" }}>Invalid Login Credentials!</p>
                </div>
            );
        }

        return (
            <div>
                <div class="container">

                    <form class="login-form" onSubmit={this.customerLoginSubmitAction}>
                        <div class="main-div">
                            <div class="panel">
                                <h2>Sign in to Yelp</h2>
                            </div>

                            <div class="form-group">
                                <input onChange={this.emailChangeHandler} type="text" class="form-control" name="email_id" placeholder="Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required />
                            </div>
                            <div class="form-group">
                                <input onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            {error}
                            <button type="submit" class="btn btn-primary"> Sign in </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ customer: { showFailure, customer_id } }) => ({
    showFailure: showFailure,
    customer_id: customer_id
});

function mapDispatchToProps(dispatch) {
    return {
        setCustomerLogin: data => dispatch(loginToCustomer(data))
    };
}

const CustomerLogin = connect(mapStateToProps, mapDispatchToProps)(CustomerLoginForm);

//export Login Component
export default CustomerLogin;
