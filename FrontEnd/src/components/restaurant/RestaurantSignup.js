import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import { signupAsRestaurant } from "../../redux/action/restaurantActions";


//Define a Signup Component
class RestaurantSignupForm extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name : "",
            password : "",
            email_id : "",
            location : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.restaurantSignupSubmitAction = this.restaurantSignupSubmitAction.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email_id : e.target.value
        })
    }
    locationChangeHandler = (e) => {
        this.setState({
            location : e.target.value
        })
    }

    restaurantSignupSubmitAction = (e) => {
        
        console.log("restaurantSignup -> restaurantSignupSubmitAction -> Restaurant Signup Entry point ");
        
        //prevent page from refresh
        e.preventDefault();

        const data = {
            email_id : this.state.email_id,
            password : this.state.password,
            name : this.state.name,
            location : this.state.location
        }

        // Updating restaurant login props -> react component
        this.props.setRestaurantSignup(data);
    }

    render(){
        if (this.props.signupCompleted) {
            alert("You have registered successfully. Please login to continue.");
            return <Redirect to="r_login" />
        }

        let error = null;
        if (this.props.showFailure) {
            error = (
                <div>
                    <p style={{ color: "red" }}>Restaurant SignUp Unsuccessful!</p>
                </div>
            );
        }

        return(
            <div>
            <div class="container">
                
            <form class="login-form" onSubmit= {this.restaurantSignupSubmitAction}>
                    <div class="main-div">
                        <div class="panel">
                            <h2>Sign up and get rolling</h2>
                        </div>
                        
                            <div class="form-group">
                                <input onChange = {this.nameChangeHandler} type="text" class="form-control" name="name" placeholder="Restaurant Name" pattern="^[A-Za-z0-9 ]+$" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="text" class="form-control" name="email_id" placeholder="Restaurant Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.locationChangeHandler} type="text" class="form-control" name="location" placeholder="Restaurant Location" pattern="^[A-Za-z ]+$" required/>
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

const mapStateToProps = ({ restaurant: { showFailure, signupCompleted, restaurant_id }}) => ({
    showFailure: showFailure,
    signupCompleted: signupCompleted,
    restaurant_id: restaurant_id
});

function mapDispatchToProps(dispatch) {
    return {
        setRestaurantSignup: data => dispatch(signupAsRestaurant(data))
    };
}

const RestaurantSignup = connect(mapStateToProps, mapDispatchToProps)(RestaurantSignupForm);

//export Signup Component
export default RestaurantSignup;