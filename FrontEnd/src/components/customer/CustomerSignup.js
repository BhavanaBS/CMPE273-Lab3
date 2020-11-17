import React, {Component} from 'react';
import '../../App.css';
import { connect } from "react-redux";
import {Redirect} from 'react-router';
import { signupAsCustomer } from "../../redux/action/customerActions";
import { Link } from 'react-router-dom';

//Define a Signup Component
class CustomerSignupForm extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name : "",
            password : "",
            email_id : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.customerSignupSubmitAction = this.customerSignupSubmitAction.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //name change handler to update state variable with the text entered by the user
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

    customerSignupSubmitAction = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email_id : this.state.email_id,
            password : this.state.password,
            name : this.state.name
        }
        
        this.props.setCustomerSignup(data);
    }

    render(){
        if (this.props.signupCompleted) {
            alert("You have registered successfully. Please login to continue.");
            return <Redirect to="c_login" />
        }

        let error = null;
        if (this.props.showFailure) {
            error = (
                <div>
                    <p style={{ color: "red" }}>SignUp Unsuccessful!</p>
                </div>
            );
        }

        return(
            <div>
                <div class="container">
                
                    <form class="login-form" onSubmit= {this.customerSignupSubmitAction}>
                        <div class="main-div">
                            <div class="panel">
                                <h2>Sign up and be awesome</h2>
                            </div>
                            
                            <div class="form-group">
                                <input onChange = {this.nameChangeHandler} type="text" class="form-control" name="name" placeholder="Name" pattern="^[A-Za-z0-9 ]+$" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="text" class="form-control" name="email_id" placeholder="Email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password" required/>
                            </div>
                            {error}
                            <button type="submit" class="btn btn-primary">Sign up</button>
                            <br/>
                            <Link to= "/r_signup">Business Signup?</Link>
                        </div>
                        
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ customer: { showFailure, signupCompleted, customer_id }}) => ({
    showFailure: showFailure,
    signupCompleted: signupCompleted,
    customer_id: customer_id
});

function mapDispatchToProps(dispatch) {
    return {
        setCustomerSignup: data => dispatch(signupAsCustomer(data))
    };
}

const CustomerSignup = connect(mapStateToProps, mapDispatchToProps)(CustomerSignupForm);

//export Signup Component
export default CustomerSignup;