import React, {Component} from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import { loginToRestaurant } from "../../redux/action/restaurantActions";

//Define a Login Component
class RestaurantLoginForm extends Component{
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super();
        //maintain the state required for this component
        this.state = {
            email_id : "",
            password : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.restaurantLoginSubmitAction = this.restaurantLoginSubmitAction.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            email_id : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    restaurantLoginSubmitAction = (e) => {
        
        console.log("restaurantLogin.js -> restaurantLoginSubmitAction -> Restaurant Login Entry point ");
        
        //prevent page from refresh
        e.preventDefault();

        const data = {
            email_id : this.state.email_id,
            password : this.state.password
        }

        // Updating restaurant login props -> react component
        this.props.setRestaurantLogin(data);
    }

    render(){
        // Redirect based on successful login.
        // 1. We set the cookie when we login.
        // 2. We set the redux state's restaurant.restaurant_id and map it to props.restaurant_id
        if (cookie.load('cookie') && this.props.restaurant_id) {
            localStorage.setItem("restaurant_id", this.props.restaurant_id);
            return <Redirect to="/r_home"/>
        }

        let error = null;
        if(this.props.showFailure) {
            error = (
                <div>
                    <p style={{color: "red"}}>Invalid Restaurant Login Credentials!</p>
                </div>
            );
        }

        return(
            <div>
                <div class="container">
                    <form class="login-form" onSubmit= {this.restaurantLoginSubmitAction}>
                        <div class="main-div">
                            <div class="panel">
                                <h2>Sign in to Yelp as Business</h2>
                            </div>
                            
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="text" class="form-control" name="email_id" placeholder="Restaurant Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
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

function mapDispatchToProps(dispatch) {
    return {
        setRestaurantLogin: data => dispatch(loginToRestaurant(data))
    };
}

const mapStateToProps = ({ restaurant: { showFailure, restaurant_id } }) => ({
    showFailure: showFailure,
    restaurant_id: restaurant_id,
});

const RestaurantLogin = connect(mapStateToProps, mapDispatchToProps)(RestaurantLoginForm);

//export Login Component
export default RestaurantLogin;
