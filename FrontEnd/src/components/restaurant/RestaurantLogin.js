import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import { restaurantLoginMutation } from "../../mutation/mutations";
import { graphql } from 'react-apollo';
const jwt_decode = require('jwt-decode');

//Define a Login Component
class RestaurantLogin extends Component{
    
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
        let mutationResponse = await this.props.restaurantLoginMutation({
            variables: {
                email_id: this.state.email_id,
                password: this.state.password,
            }
        });
        let response = mutationResponse.data.restaurantLogin;
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

    render(){
        
        let redirectVar = null;
        let error = ""
        if (this.state.success) {
            let token = this.state.data;
            localStorage.setItem("token", token);
            var decoded = jwt_decode(token.split(' ')[1]);
            localStorage.setItem("restaurant_id", decoded.restaurant_id);
            redirectVar = <Redirect to="/r_home" />
        }            
        else if (this.state.message === "NO_RESTAURANT" && this.state.loginFlag) {
            error = "Please Register to continue";
        }
        else if (this.state.message === "INVALID_RESTAURANT_CREDENTIALS" && this.state.loginFlag) {
            error = "Incorrect Password";
        }

        return(
            <div>
            {redirectVar}
                <div class="container">
                    <form class="login-form" onSubmit= {this.onSubmit}>
                        <div class="main-div">
                            <div class="panel">
                                <h2>Sign in to Yelp as Business</h2>
                            </div>
                            
                            <div class="form-group">
                                <input onChange = {this.onChange} type="text" class="form-control" name="email_id" placeholder="Restaurant Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.onChange} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div style={{ color: "#ff0000" }}>{error}<br/></div>
                            <button type="submit" class="btn btn-primary"> Sign in </button>                 
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


export default graphql(restaurantLoginMutation, { name: "restaurantLoginMutation" })(RestaurantLogin);
