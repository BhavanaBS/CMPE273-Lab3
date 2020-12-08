// Update restaurant profile (name, location, description, contact information, pictures of restaurant and dishes, timings)
// TODO: Update the restaurant Image

import React, {Component} from 'react';
import '../../App.css';
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { Redirect } from 'react-router';
import { restaurantUpdateMutation } from "../../mutation/mutations";
import { compose, graphql } from 'react-apollo';
import { getRestaurantQuery } from "../../queries/queries";

class RestaurantProfile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onChange = this.onChange.bind(this);
        this.onRestaurantUpdate = this.onRestaurantUpdate.bind(this);
    }

    getRestprofile(){
        if (this.props.data && this.props.data.restaurant && this.state && !this.state.restaurantDetails) {
            console.log("I got called");
             this.setState({ 
                restaurantDetails: this.props.data.restaurant,
            });
        }
    }
 
    componentDidMount() {
        this.getRestprofile();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onRestaurantUpdate = async (e) => {
        //prevent page from refresh
        e.preventDefault();
        console.log("on restaurant profile update");
        let mutationResponse = await this.props.restaurantUpdateMutation({
            variables: {
                email_id: this.state.restaurantDetails.email_id,
                name: this.state.name?this.state.name:this.state.restaurantDetails.name,
                location: this.state.location?this.state.location:this.state.restaurantDetails.location,
                phone: this.state.phone?this.state.phone:this.state.restaurantDetails.phone,
                description: this.state.description?this.state.description:this.state.restaurantDetails.description,
                timings: this.state.timings?this.state.timings:this.state.restaurantDetails.timings,
                delivery_method: this.state.delivery_method?this.state.delivery_method:this.state.restaurantDetails.delivery_method,
                cuisine: this.state.cuisine?this.state.cuisine:this.state.restaurantDetails.cuisine,
            }
        });
        let response = mutationResponse.data.restaurantUpdate;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    updateFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    updateFlag: true
                });
            }
        }
    };

    render() {

        let redirectVar = null, error = "" , success= "";
        if (localStorage.getItem("restaurant_id") === null ) {
            redirectVar = <Redirect to="/c_home" />
        }

            this.getRestprofile();

        if (this.state.success) {
            success = (
                        <div>
                            <Alert variant="success">Profile Updated Successfully!</Alert>
                        </div>
                    );
            // success = "Profile Updated Successfully";
        }   
        else if (this.state.message === "RESTAURANT_UPDATE_ERROR" && this.state.updateFlag) {
            error = (
                <div>
                    <Alert variant="danger">Profile update failed. Please try again in some time.</Alert>
                    </div>
                );
        }
        else if (this.state.message === "INTERNAL_SERVER_ERROR" && this.state.updateFlag) {
            error = (
                <div>
                    <Alert variant="danger">Profile update failed. Please try again in some time.</Alert>
            </div>
        );
        }

        if(!this.state.restaurantDetails) {
            return (
                <div>
                <p> 
                    Please wait for some time
                </p>
                </div>
            )
        }

        return (
            <div>
            {redirectVar}
            {error}
            {success}
            <br/><br/><br/>
                <Container style={{ marginLeft:'3rem', marginRight:'3rem' }} fluid={true}>
                    <Row>
                        
                        <Col xs={2} md={1}></Col>
                        <Col style={{ width: '55rem' }}>
                            <h4>Update {this.state.restaurantDetails.name}'s Profile</h4>
                            <br />
                            <Form onSubmit={this.onRestaurantUpdate} >
                                <Form.Row>
                                    <Form.Group as={Row} controlId="name">
                                        <br/>
                                        <Form.Label style={{ width: '15rem' }}>Restaurant Name</Form.Label>
                                        <Form.Control name="name"
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.name}
                                            pattern="^[A-Za-z0-9 ]+$"
                                            placeholder={this.state.restaurantDetails.name}
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="description">
                                        <Form.Label style={{ width: '15rem' }}>Description</Form.Label>
                                        <Form.Control name="description"
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.description}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.restaurantDetails.description}
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="location">
                                        <Form.Label style={{ width: '15rem' }}>Location</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="location"
                                            onChange={this.onChange}
                                            value={this.state.location}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.restaurantDetails.location}
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="email_id">
                                        <Form.Label style={{ width: '15rem' }}>Email</Form.Label>
                                        <Form.Control 
                                            type="email"
                                            name="email_id"
                                            value={this.state.restaurantDetails.email_id}
                                            disabled 
                                            readonly
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="phone">
                                        <Form.Label style={{ width: '15rem' }}>Phone Number</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="phone"
                                            onChange={this.onChange}
                                            value={this.state.phone}
                                            pattern="^[0-9]+$"
                                            placeholder={this.state.restaurantDetails.phone}
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="timings">
                                        <Form.Label style={{ width: '15rem' }}>Timings</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="timings"
                                            onChange={this.onChange}
                                            value={this.state.timings}
                                            pattern="^[0-9 :-]+$"
                                            placeholder={this.state.restaurantDetails.phone}
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="delivery_method">
                                        <Form.Label style={{ width: '15rem' }}>Delivery Method</Form.Label>
                                        <Form.Control as="select" 
                                            onChange={this.onChange} 
                                            name="delivery_method" 
                                            defaultValue={this.state.delivery_method} 
                                            value={this.state.delivery_method}
                                            style={{ width: '30rem' }}
                                            >
                                                <option>Home Delivery</option>
                                                <option>Pick Up</option>
                                                <option>Dine In</option>
                                                <option>Home Delivery, Pick Up</option>
                                                <option>Home Delivery, Dine In</option>
                                                <option>Pick Up, Dine In</option>
                                                <option>Home Delivery, Pick Up, Dine In</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Button style={{marginLeft:"31rem"}} variant="danger"  href="/r_home">Cancel</Button> {' '}
                                <Button type="submit" variant="primary">Update Details</Button>
                            </Form>
                        </Col>
                    </Row>
                    {error}
                </Container>
            </div>
        )
    }
}

export default compose(
    graphql(getRestaurantQuery, {
        name: "data",
        options: { variables: { restaurant_id: localStorage.getItem("restaurant_id") }
        }
    }),
    graphql(restaurantUpdateMutation, { name: "restaurantUpdateMutation" })
)(RestaurantProfile);
