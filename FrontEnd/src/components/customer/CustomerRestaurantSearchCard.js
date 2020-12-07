import React, { Component } from "react";
import { Card, Row, Col  } from "react-bootstrap";
import { Link } from "react-router-dom";
import rest from "../../images/restaurant.jpeg";

class CustomerRestaurantSearchCard extends Component {

    constructor(props) {
        super(props);
        this.setState({});
    }
    
  render() {
    var resData = this.props.restaurant;

    return (
    <Link to={{pathname: `/customer/restaurant/${resData.id}`, state: resData}}>
        <Card style={{ width:'40rem', height: '18rem', margin: '1rem' }}>
            <Card.Body>
                <Row>
                    <Col>    
                        <img
                        style = {{width:'15rem', height:'15rem'}}
                        src={rest}
                        alt="First slide"
                        />
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