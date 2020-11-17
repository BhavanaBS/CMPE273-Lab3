import React, { Component } from "react";
import { Card, Row, Col, Carousel  } from "react-bootstrap";
import { Link } from "react-router-dom";
import yelp_logo from "../../images/yelp_logo.png";
import axios from 'axios';
import backend from '../common/serverDetails';

class CustomerRestaurantSearchCard extends Component {

    constructor(props) {
        super(props);
        this.setState({});
        this.getRestaurantImageIds();
    }

    getRestaurantImageIds = () => {
        console.log("Fetching the imageIds for restaurantId ", this.props.restaurant.id);

        axios.get(`${backend}/restaurants/${this.props.restaurant.id}/images`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    if (response.data) {
                        this.setState({
                            restaurantImageIds: response.data
                        });
                    }
                    console.log("Fetching restaurant image ids success!", this.props.restaurant.id);
                } else {
                    console.log("Fetching restaurant image ids failed!");
                }
            })
            .catch((error) => {
                console.log("Fetching restaurant image ids failed!", error);
            });
    }
    
    getImageCarouselItem = (imageId) => {
        let imageSrcUrl = `${backend}/restaurants/${this.props.restaurant.id}/images/${imageId}`;
        console.log(imageSrcUrl);
        return <Carousel.Item>
            <img
            style = {{width:'15rem', height:'15rem'}}
            src={imageSrcUrl}
            alt="First slide"
            />
        </Carousel.Item>
    }

  render() {
    var resData = this.props.restaurant;

    let carouselList = [], carousel;

    if (this.state && this.state.restaurantImageIds && this.state.restaurantImageIds[0]) {
        for (var i = 0; i < this.state.restaurantImageIds.length; i++) {
            carousel = this.getImageCarouselItem(this.state.restaurantImageIds[i]);
            carouselList.push(carousel);
        }
    } else {
        carousel = <Carousel.Item>
                        <img
                        style = {{width:'15rem', height:'15rem'}}
                        src={yelp_logo}
                        alt="First slide"
                        />
                    </Carousel.Item>
        carouselList.push(carousel);
    }
    console.log(carouselList);

    return (
    <Link to={{pathname: `/customer/restaurant/${resData.id}`, state: resData}}>
        <Card style={{ width:'40rem', height: '18rem', margin: '1rem' }}>
            <Card.Body>
                <Row>
                    <Col>    
                        <Carousel>
                            {carouselList}
                        </Carousel>
                    </Col>
                    <Col align="center" style={{color:'black'}}>
                    <br/><br/><br/>
                    <Card.Text><h4>{resData.name}</h4></Card.Text>
                    <Card.Text><p>{resData.cuisine}</p></Card.Text>
                    <Card.Text><p>{resData.location}</p></Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </Link>
    );
  }
}

export default CustomerRestaurantSearchCard;