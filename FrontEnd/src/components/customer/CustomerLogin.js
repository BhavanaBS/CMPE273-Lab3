import React, { Component } from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { customerLoginMutation } from "../../mutation/mutations";
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
const jwt_decode = require('jwt-decode');

//Define a Login Component
class CustomerLogin extends Component {

    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {};
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    onSubmit = async (e) => {
        e.preventDefault();
        let mutationResponse = await this.props.customerLoginMutation({
            variables: {
                email_id: this.state.email_id,
                password: this.state.password,
            }
        });
        let response = mutationResponse.data.customerLogin;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    loginFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    loginFlag: true
                });
            }
        }
    }

    render() {

        let redirectVar = null;
        let error = ""
        if (this.state.success) {
            let token = this.state.data;
            localStorage.setItem("token", token);
            var decoded = jwt_decode(token.split(' ')[1]);
            localStorage.setItem("customer_id", decoded.customer_id);
            redirectVar = <Redirect to="/c_home" />
        }            
        else if (this.state.message === "NO_USER" && this.state.loginFlag) {
            error = "Please Register to continue";
        }
        else if (this.state.message === "INCORRECT_PASSWORD" && this.state.loginFlag) {
            error = "Incorrect Password";
        }

        return (
            <div>
            {redirectVar}
                <div class="container">
                    
                    <form class="login-form" onSubmit={this.onSubmit}>
                        <div class="main-div">
                            <div class="panel">
                                <h2>Sign in to Yelp</h2>
                            </div>

                            <div class="form-group">
                                <input onChange={this.onChange} type="text" class="form-control" name="email_id" placeholder="Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required />
                            </div>
                            <div class="form-group">
                                <input onChange={this.onChange} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div style={{ color: "#ff0000" }}>{error}</div>
                            <button type="submit" class="btn btn-primary"> Sign in </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default graphql(customerLoginMutation, { name: "customerLoginMutation" })(CustomerLogin);
