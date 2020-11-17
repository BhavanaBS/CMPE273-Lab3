import React, { Component } from "react";
import { Card, Button, Col, Row, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import yelp_logo from "../../images/yelp.png";
import axios from 'axios';
import backend from '../common/serverDetails';

class Dish extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.getDishImageIds();
}

  getDishImageIds = () => {
    console.log("Fetching the imageIds for dishId ", this.props.dish.id);
    axios.get(`${backend}/dishes/${this.props.dish.id}/images`)
        .then(response => {
            console.log("Status Code : ",response.status, "Response JSON : ",response.data);
            if (response.status === 200) {
                if (response.data) {
                    this.setState({
                        dishImageIds: response.data
                    });
                }
                console.log("Fetching image ids for dish id success!",this.props.dish.id);
            } else {
                console.log("Fetching image ids for dish failed!");
            }
        })
        .catch((error) => {
            console.log("Fetching image ids for dish failed!", error);
        });
}

  getImageCarouselItem = (imageId) => {
    let imageSrcUrl = `${backend}/dishes/${this.props.dish.id}/images/${imageId}`;
    console.log("Individual Image",imageSrcUrl);
    return <Carousel.Item>
        <img
        style = {{width:'15rem', height:'15rem'}}
        src={imageSrcUrl}
        alt="First slide"
        />
    </Carousel.Item>
}

  render() {
    let carouselList = [], carousel;

  if (this.state && this.state.dishImageIds && this.state.dishImageIds[0]) {
    for (var i = 0; i < this.state.dishImageIds.length; i++) {
        carousel = this.getImageCarouselItem(this.state.dishImageIds[i]);
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
      <Card bg="light" style={{width:'40rem', height:'15rem'}}>
        <Row>
          <Col  align="left" style={{width:'15rem', height:'15rem'}}>
            <Carousel style={{width:'15rem', height:'15rem'}}>
              {carouselList}
            </Carousel>
          </Col>
          <Col align="left" style={{width:'20rem', height:'15rem'}}>
            <Card.Body>
              <Card.Title><h4><i>{this.props.dish.name}</i></h4></Card.Title>
              <Card.Text><p>{this.props.dish.description}</p></Card.Text>
              <Card.Text>Price: $ {this.props.dish.price}</Card.Text>
              <Link to={{ pathname: "/r_menu/update", state: { dish: this.props.dish } }}>
              <Button name={this.props.dish.id}>Edit</Button>&nbsp;
              </Link>
              <Button variant="danger" style={{margin:'1rem'}} onClick={this.props.deleteDish} name={this.props.dish.id}>Delete</Button>
            </Card.Body>
          </Col>
          
        </Row>
      </Card>
    );
  }
}

export default Dish;