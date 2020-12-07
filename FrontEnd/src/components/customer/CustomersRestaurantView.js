// 1. View Restaurant Page
// 2. Add insightful reviews( date, ratings, comments)
// 3. Order food from the page, select delivery method.

import React, { Component } from 'react';
import { Card, Container, ListGroup, Row, Col, Form, Button, ButtonGroup, Alert } from "react-bootstrap";
import { addReviewMutation } from "../../mutation/mutations";
import { graphql } from 'react-apollo';
import CustomerMenuDish from './CustomerMenuDish';
import { Redirect } from 'react-router';

class CustomersRestaurantView extends Component {
    constructor(props) {
        super(props);
        this.setState({
            categories: ["Main Course", "Salads", "Appetizer", "Desserts", "Beverages"],
        });
    }

    componentWillMount () {
        this.setState({
            resData: this.props.location.state,
            categories: ["Main Course", "Salads", "Appetizer", "Desserts", "Beverages"]
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        let mutationResponse = await this.props.addReviewMutation({
            variables: {
                restaurant_id: this.state.resData.id,
                rating: this.state.rating,
                review: this.state.review,
            }
        });
        let response = mutationResponse.data.addReview;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    addReviewFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    addReviewFlag: true
                });
            }
        }
    }

    dishesView = (category) => {
        var categoriesView = [], dishes, dish, categoryHtml;
        if (this.state && this.state.resData && this.state.resData.rest_dishes && this.state.resData.rest_dishes.length > 0) {
            dishes = this.state.resData.rest_dishes.filter(dish => dish.category === category);
            if (dishes.length > 0) {
                categoryHtml = <h4>{category}</h4>;
                categoriesView.push(categoryHtml);
                for (var i = 0; i < dishes.length; i++) {
                    dish = <CustomerMenuDish dish={dishes[i]} deleteDish={this.deleteDish} resData={this.state.resData}/>;
                    categoriesView.push(dish);
                }
            }
            return categoriesView;
        }
    };

    render() {

        let restaurantDetails = null;
        let reviewForm = null;
        let category, menuRender = [];

        if (this.state && this.state.resData) {
            restaurantDetails = 
                <Card style={{ width: '32rem'}}>
                    <Row>
                        <Col align="left">
                            <Card.Body>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark"  className="col-md-3">Name</ListGroup.Item>
                                    <ListGroup.Item variant="info"  className="col-md-7">{this.state.resData.name}</ListGroup.Item>
                                </ListGroup>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark" className="col-md-3">Description</ListGroup.Item>
                                    <ListGroup.Item variant="info" className="col-md-7">{this.state.resData.description}</ListGroup.Item>
                                </ListGroup>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark" className="col-md-3">Cuisine</ListGroup.Item>
                                    <ListGroup.Item variant="info" className="col-md-7">{this.state.resData.cuisine}</ListGroup.Item>
                                </ListGroup>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark" className="col-md-3">Location</ListGroup.Item>
                                    <ListGroup.Item variant="info" className="col-md-7">{this.state.resData.location}</ListGroup.Item>
                                </ListGroup>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark" className="col-md-3">Timings</ListGroup.Item>
                                    <ListGroup.Item variant="info" className="col-md-7">{this.state.resData.timings}</ListGroup.Item>
                                </ListGroup>
                                <ListGroup horizontal style={{ width: '35rem' }}>
                                    <ListGroup.Item variant="dark" className="col-md-3">Phone</ListGroup.Item>
                                    <ListGroup.Item variant="info" className="col-md-7">{this.state.resData.phone}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>;

            reviewForm = 
                <div> 
                <Row fluid>

                <center>
                <Col></Col>
                <Col align="right">
                <br/>
                    <Form onSubmit={this.onSubmit} align="center" className="justify-content">
                        <Form.Row fluid>
                            <Form.Group as={Row} controlId="reviews.rating" >
                                <Form.Label style={{marginLeft:'10rem'}}>Rating</Form.Label>
                                    <Form.Control style={{marginLeft:'10rem'}}
                                        name="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        onChange={this.onChange}
                                        value={this.state.rating}
                                        required={true}
                                        placeholder="Rating" />
                            </Form.Group>
                        </Form.Row>
                        <br/>
                        <Form.Row >
                            <Form.Group as={Row} controlId="reviews.review">
                                <Form.Label style={{marginLeft:'10rem'}}>Review</Form.Label>
                                    <textarea
                                        name="review"
                                        type="box"
                                        onChange={this.onChange}
                                        value={this.state.review}
                                        pattern="^[A-Za-z0-9. ]+$"
                                        required={true}
                                        placeholder="Please write a Review" 
                                        rows="5" cols="50"
                                        style={{marginLeft:'-3rem', marginTop:'2rem'}}/>
                            </Form.Group>
                        </Form.Row>
                        <br/>
                        <ButtonGroup aria-label="Third group">
                            <Button style={{marginRight:'5rem'}} type="submit" variant="success">Submit Review</Button>
                        </ButtonGroup>
                    </Form>
                    </Col>
                    </center>
                    
                </Row>
                </div>
                
        }

        if (this.state && this.state.categories) {
            for (var i = 0; i < this.state.categories.length; i++) {
                category = this.dishesView(this.state.categories[i]);
                menuRender.push(category);
            }
        }

        let redirectVar = null, error = "" , success= "";
        if (localStorage.getItem("customer_id") === null ) {
            redirectVar = <Redirect to="/r_home" />
        }

        if (this.state.success) {
            success = (
                        <div>
                            <Alert variant="success">Review added successfully!</Alert>
                        </div>
                    );
            // success = "Profile Updated Successfully";
        }   
        else if (this.state.message === "INTERNAL_SERVER_ERROR" && this.state.updateFlag) {
            error = (
                <div>
                    <Alert variant="danger">Review add failed. Please try again in some time.</Alert>
                </div>
                );
        }

        return(
            <Container fluid max-width='100%'>
            {redirectVar}
            <br/><br/>
            <center><h2>{this.state.resData.name} Restaurant Page</h2>
            <br/><br/>
                {restaurantDetails}
                <br/><br/>
                <h3> Menu</h3>
                <br/>
                </center>
                {menuRender}
                <br/>
                <Button style ={{marginLeft:'10rem'}} href="/c_cart">Go To Cart</Button>
                <br/><br/><br/>
                <h3> <center>Review Restaurant</center></h3>
                <br/>
                {reviewForm}
                <br/>
                {success} 
                {error}               
            </Container>
        )
    }
}

export default graphql(addReviewMutation, { name: "addReviewMutation" })(CustomersRestaurantView);
