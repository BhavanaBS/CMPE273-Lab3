// 1. View Restaurant Page
// 2. Add insightful reviews( date, ratings, comments)
// 3. Order food from the page, select delivery method.

import React, { Component } from 'react';
import { Card, Container, ListGroup, Row, Col, Form, Button, ButtonGroup, Carousel } from "react-bootstrap";
import axios from 'axios';
import CustomerMenuDish from './CustomerMenuDish';
import yelp_logo from "../../images/yelp_logo.png";
import backend from '../common/serverDetails';

class CustomersRestaurantView extends Component {
    constructor(props) {
        super(props);
        this.setState({
            categories: ["Main Course", "Salads", "Appetizer", "Desserts", "Beverages"],
            errorReviewFlag:false,
            successReviewFlag:false,
        });
        this.onReviewSubmit = this.onReviewSubmit.bind(this);
        this.getRestaurantImageIds();
    }

    componentWillMount () {
        this.setState({
            resData: this.props.location.state,
            reviews: {
            },
            categories: ["Main Course", "Salads", "Appetizer", "Desserts", "Beverages"]
        });
        this.getDishes(this.props.location.state.id);
    }

    getDishes = (rest_id) => {
        axios.get(`${backend}/restaurants/${rest_id}/dishes`)
            .then(response => {
                if (response.data[0]) {
                    this.setState({
                        dishes: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    onReviewSubmit = (e) => {
        //prevent page from refresh
        e.preventDefault();
        console.log("on update");
        let data = Object.assign({}, this.state.reviews, {rest_id: this.state.resData.id});
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backend}/customers/${localStorage.getItem("customer_id")}/reviews`, data)
            .then(response => {
                console.log("Review Creation Status : ",response.status, "Response JSON : ",response.data);
                if (response.status !== 200) {
                    this.setState({
                        errorReviewFlag : true,
                        successReviewFlag : false,
                    });
                } else if (response.status === 200) {
                    this.setState({
                        errorReviewFlag : false,
                        successReviewFlag : true,
                    });
                }
            })
            .catch((error) => {
                console.log("Review Creation Failed!", error);
                this.setState({
                    errorReviewFlag : true,
                });
            });
    };

    onReviewChange = e => {
        let newReview = Object.assign({}, this.state.reviews, {[e.target.name]:  e.target.value});
        this.setState({
            reviews: newReview,
        });
    };

    dishesView = (category) => {
        var categoriesView = [], dishes, dish, categoryHtml;
        if (this.state && this.state.dishes && this.state.dishes.length > 0) {
            dishes = this.state.dishes.filter(dish => dish.category === category);
            if (dishes.length > 0) {
                categoryHtml = <h4>{category}</h4>;
                categoriesView.push(categoryHtml);
                for (var i = 0; i < dishes.length; i++) {
                    dish = <CustomerMenuDish dish={dishes[i]} deleteDish={this.deleteDish}/>;
                    categoriesView.push(dish);
                }
            }
            return categoriesView;
        }
    };

    getRestaurantImageIds = () => {
        console.log("Fetching the imageIds for restaurantId ", this.props.location.state.id);

        axios.get(`${backend}/restaurants/${this.props.location.state.id}/images`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    if (response.data) {
                        this.setState({
                            restaurantImageIds: response.data
                        });
                    }
                    console.log("Fetching restaurant image ids success!", this.props.location.state.id);
                } else {
                    console.log("Fetching restaurant image ids failed!");
                }
            })
            .catch((error) => {
                console.log("Fetching restaurant image ids failed!", error);
            });
    }
    
    getImageCarouselItem = (imageId) => {
        let imageSrcUrl = `${backend}/restaurants/${this.props.location.state.id}/images/${imageId}`;
        console.log(imageSrcUrl);
        return <Carousel.Item style = {{width:'20rem', height:'20rem'}}>
            <img
            style = {{width:'20rem', height:'20rem'}}
            src={imageSrcUrl}
            alt="First slide"
            />
        </Carousel.Item>
    }

    render() {

        let restaurantDetails = null;
        let reviewForm = null;
        let category, menuRender = [];
        let carouselList = [], carousel;

        if (this.state && this.state.restaurantImageIds && this.state.restaurantImageIds[0]) {
            for (var i = 0; i < this.state.restaurantImageIds.length; i++) {
                carousel = this.getImageCarouselItem(this.state.restaurantImageIds[i]);
                carouselList.push(carousel);
            }
        } else {
            carousel = <Carousel.Item style = {{width:'20rem', height:'20rem'}}>
                            <img
                            style = {{width:'20rem', height:'20rem'}}
                            src={yelp_logo}
                            alt="First slide"
                            />
                        </Carousel.Item>
            carouselList.push(carousel);
        }
        console.log(carouselList);

        if (this.state && this.state.resData) {
            restaurantDetails = 
                <Card style={{ width: '65rem'}}>
                    <Row>
                        <Col align="left" style = {{ width:'30rem'}}>
                             <Carousel style = {{margin:'1rem', width:'20rem', height:'20rem'}}>
                                {carouselList}
                            </Carousel>  
                        </Col>
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
                    <Form onSubmit={this.onReviewSubmit} align="center" className="justify-content">
                        <Form.Row fluid>
                            <Form.Group as={Row} controlId="reviews.rating" >
                                <Form.Label style={{marginLeft:'10rem'}}>Rating</Form.Label>
                                    <Form.Control style={{marginLeft:'10rem'}}
                                        name="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        onChange={this.onReviewChange}
                                        value={this.state.reviews.rating}
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
                                        onChange={this.onReviewChange}
                                        value={this.state.reviews.review}
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

        let reviewSubmissionStatus;
        if(this.state && this.state.successReviewFlag) {
            reviewSubmissionStatus = <div style={{marginLeft:'5rem'}}>
            <p style={{color:"green"}}>
            Review Submitted Successfully!
            </p>
            </div>
        }
        if(this.state && this.state.errorReviewFlag) {
            reviewSubmissionStatus = <div style={{marginLeft:'5rem'}}>
            <p style={{color:"red"}}>
            Review Submit Failed!
            </p>
            </div>
        }

        return(
            <Container fluid max-width='100%'>
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
                {reviewSubmissionStatus}                
                <center><Button href="/customer/home">Home</Button></center>
            </Container>
        )
    }
}

export default CustomersRestaurantView;