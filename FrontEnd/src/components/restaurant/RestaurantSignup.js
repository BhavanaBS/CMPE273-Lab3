import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { addRestaurantMutation } from '../../mutation/mutations';

//Define a Signup Component
class RestaurantSignup extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            signupFlag: false,
            success: false
        }
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        //prevent page from refresh
        e.preventDefault();

        let mutationResponse = await this.props.addRestaurantMutation({
            variables: {
                name: this.state.name,
                email_id: this.state.email_id,
                password: this.state.password,
                location: this.state.location
            }
        });
        let response = mutationResponse.data.addRestaurant;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    signupFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    signupFlag: true
                });
            }
        }
    }

    render(){
        let redirectVar = null, error = "";

        if (localStorage.getItem("token")) {
            redirectVar = <Redirect to="/r_home" />
        }
        else if (this.state.success) {
            alert("You have registered successfully");
            redirectVar = <Redirect to="/r_login" />
        }
        else if (this.state.message === "REST_PRESENT" && this.state.signupFlag) {
            error = "Yor have already registered. Please Login."
        }

        return(
            <div>
            <div class="container">
                
            <form class="login-form" onSubmit= {this.onSubmit}>
                    <div class="main-div">
                        <div class="panel">
                            <h2>Sign up and get rolling</h2>
                        </div>
                        
                            <div class="form-group">
                                <input onChange = {this.onChange} type="text" class="form-control" name="name" placeholder="Restaurant Name" pattern="^[A-Za-z0-9 ]+$" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.onChange} type="text" class="form-control" name="email_id" placeholder="Restaurant Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.onChange} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.onChange} type="text" class="form-control" name="location" placeholder="Restaurant Location" pattern="^[A-Za-z ]+$" required/>
                            </div>
                            {error}
                            <button type="submit" class="btn btn-primary">Sign up</button>
                    </div>
                </form>
            </div>
            </div>
        )
    }
}

export default graphql(addRestaurantMutation, { name: "addRestaurantMutation" })(RestaurantSignup);