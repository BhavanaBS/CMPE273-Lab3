// Restaurant page (Dashboard – Landing page):
// 1. View restaurant profile – having all basic information about restaurant (name, location, description, contact information, pictures of restaurant and dishes, timings)
// 2. TODO: Update the restaurant Image
// 3. View orders list

import React, {Component} from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import { Card, Container, Table,Row, Col, Carousel} from "react-bootstrap";
import axios from 'axios';
import yelp_logo from "../../images/yelp.png";
import backend from '../common/serverDetails';

class RestaurantHome extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {};
        this.getRestaurantProfile();
        this.getRestaurantImageIds();
    }

    getRestaurantImageIds = () => {
        var restaurantId = localStorage.getItem("restaurant_id");
        console.log("Fetching the imageIds for restaurantId ", restaurantId);
    

        axios.get(`${backend}/restaurants/${restaurantId}/images`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    if (response.data) {
                        this.setState({
                            restaurantImageIds: response.data
                        });
                    }
                    console.log("Fetching restaurant image ids success!", this.state.restaurantDetails);
                } else {
                    console.log("Fetching restaurant image ids failed!");
                }
            })
            .catch((error) => {
                console.log("Fetching restaurant image ids failed!", error);
            });
    }

    getRestaurantProfile = () => {
        var restaurantId = localStorage.getItem("restaurant_id");
        console.log("Fetching the details for restaurantId ", restaurantId);
    

        axios.get(`${backend}/restaurants/${restaurantId}`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    if (response.data) {
                        this.setState({
                            restaurantDetails: response.data
                        });
                    }
                    console.log("Fetching restaurant details success!", this.state.restaurantDetails);
                } else {
                    console.log("Fetching restaurant details failed!");
                }
            })
            .catch((error) => {
                console.log("Fetching restaurant details failed!", error);
            });
    }

    getImageCarouselItem = (imageId) => {
        let rest_id = localStorage.getItem("restaurant_id");
        let imageSrcUrl = `${backend}/restaurants/${rest_id}/images/${imageId}`;
        console.log(imageSrcUrl);
        return <Carousel.Item>
            <img
            style = {{width:'60rem', height:'40rem'}}
            src={imageSrcUrl}
            alt="First slide"
            />
        </Carousel.Item>
    }

    render() {
        var restaurantDetailsTable = null;
        let redirectVar = null;
        let carouselList = [], carousel;

        if(!(cookie.load('cookie') && localStorage.getItem("restaurant_id"))){
            redirectVar = <Redirect to="/" />;
        }

        if (this.state && this.state.restaurantImageIds && this.state.restaurantImageIds[0]) {
            for (var i = 0; i < this.state.restaurantImageIds.length; i++) {
                carousel = this.getImageCarouselItem(this.state.restaurantImageIds[i]);
                carouselList.push(carousel);
            }
        } else {
            carousel = <Carousel.Item>
                            <img
                            style = {{width:'30rem', height:'20rem'}}
                            src={yelp_logo}
                            alt="First slide"
                            />
                        </Carousel.Item>
            carouselList.push(carousel);
        }
        console.log(carouselList);

        if(this.state.restaurantDetails) {
            restaurantDetailsTable = (<center>
                <Card>
                <Row>
                <Col>
                <br/><br/>
                    <Card.Title>
                        <h1>{this.state.restaurantDetails.name}</h1>
                    </Card.Title>

                    <Carousel>
                        {carouselList}
                    </Carousel>
                    <br/><br/>
                    </Col>
                    <Col>
                    <Card.Body>
                        <Table style={{ width: "100%", fontSize:"18px" }}>
                            <tbody>
                                <tr>
                                    <td >Email Id</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.email_id}</td>
                                </tr>
                                <tr>
                                    <td >Location</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.location}</td>
                                </tr>
                                <tr>
                                    <td >Phone Number</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.phone}</td>
                                </tr>
                                <tr>
                                    <td >Description</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.description}</td>
                                </tr>
                                <tr>
                                    <td >Timings</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.timings}</td>
                                </tr>
                                <tr>
                                    <td >Delivery Method</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.delivery_method}</td>
                                </tr>
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                    </Col>
                    </Row>
                    <Link align="center" style={{ width: "20%", marginLeft: '2rem', fontSize:"18px" }} to="/r_profile" class="btn btn-primary">Edit Profile</Link>
                    <br/>
                    <br/>
                </Card>
                <br/>
                <br/>
            </center>
            
            );
        }
        return (
            <div>
                {redirectVar}
                <Container className="justify-content">
                <br/><br/>
                    {restaurantDetailsTable}
                </Container>
            </div>
        );    
    }
}

export default RestaurantHome;
