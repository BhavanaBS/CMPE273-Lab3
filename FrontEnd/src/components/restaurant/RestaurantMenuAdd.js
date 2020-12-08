import React, { Component } from 'react';
import { Form, Col, Row, Button } from "react-bootstrap";
import { addDishMutation } from "../../mutation/mutations";
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router';

class RestaurantMenuAdd extends Component {
    constructor(props) {
        super(props);
        this.setState({
            errorFlag : false,
            successFlag : false,
        });
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = async e => {
        e.preventDefault();
        let mutationResponse = await this.props.addDishMutation({
            variables: {
                restaurant_id: localStorage.getItem("restaurant_id"),
                name: this.state.name,
                ingredients: this.state.ingredients,
                description: this.state.description,
                price: this.state.price,
                category: this.state.category,
            }
        });
        let response = mutationResponse.data.addDish;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    addDishFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    addDishFlag: true
                });
            }
        }
    };

    render() {

        let redirectVar = null, errorMessage = null;
        if (this.state && this.state.success) {
            errorMessage = (<div>
                    <p style={{ color: "green" }}>Dish Creation Success!</p>
                </div>
            );
        }            
        else if (this.state && this.state.message === "INTERNAL_SERVER_ERROR" && this.state.addDishFlag) {
            errorMessage = (
                <div>
                    <p style={{ color: "red" }}>Dish Creation Failed!</p>
                </div>
            );
        }

        return(
            <div>
            {redirectVar}
            <center> <h3>Add A Dish</h3><br /></center> 
                <Row>
                    <Col>                       
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="name">
                                <Form.Label column sm="3">
                                    Name:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="name" placeholder="Enter Dish Name" onChange={this.onChange} pattern="^[A-Za-z0-9 ,.]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="description">
                                <Form.Label column sm="3">
                                    Description:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="description" placeholder="Description of the dish" onChange={this.onChange} pattern="^[A-Za-z0-9 ,.-]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="ingredients">
                                <Form.Label column sm="3">
                                Ingredients:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="ingredients" placeholder="Ingredients in the dish" onChange={this.onChange} pattern="^[A-Za-z ,.-]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="price">
                                <Form.Label column sm="3">Price: </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="price" placeholder="Enter Dish Price" onChange={this.onChange} pattern="^(\d*\.)?\d+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="category">
                                <Form.Label column sm="3">Category:</Form.Label>
                                <Col sm="4">
                                    <Form.Control as="select" onChange={this.onChange} name="category" required>
                                        <option>Appetizer</option>
                                        <option>Salads</option>
                                        <option>Main Course</option>
                                        <option>Desserts</option>
                                        <option>Beverages</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <br/><br/>
                            <Button style={{marginLeft:"23rem"}} variant="danger" href="/r_menu/view">Cancel</Button>  {''}
                            <Button type="sumbit">Add Item</Button>                            <br/>
                            {errorMessage}
                            <br/><br/>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default graphql(addDishMutation, { name: "addDishMutation" })(RestaurantMenuAdd);
