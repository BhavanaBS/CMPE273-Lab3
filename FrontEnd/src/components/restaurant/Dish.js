import React, { Component } from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

class Dish extends Component {

  constructor(props) {
    super(props);
    this.state = {};
}

  render() {
//   <img
//   style = {{width:'15rem', height:'15rem'}}
//   src={yelp_logo}
//   alt="First slide"
//   />
    return (
      <Card bg="light" style={{width:'40rem', height:'15rem'}}>
        <Row>
          <Col  align="left" style={{width:'15rem', height:'15rem'}}>
            
          </Col>
          <Col align="left" style={{width:'20rem', height:'15rem'}}>
            <Card.Body>
              <Card.Title><h4><i>{this.props.dish.name}</i></h4></Card.Title>
              <Card.Text><p>{this.props.dish.description}</p></Card.Text>
              <Card.Text>Price: $ {this.props.dish.price}</Card.Text>
              <Link to={{ pathname: "/r_menu/update", state: { dish: this.props.dish } }}>
              <Button name={this.props.dish.id}>Edit</Button>&nbsp;
              </Link>
            </Card.Body>
          </Col>
          
        </Row>
      </Card>
    );
  }
}

export default Dish;