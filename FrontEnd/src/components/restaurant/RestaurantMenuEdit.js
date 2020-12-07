// 4. Add/Edit Dishes in menu (with Dish name, Main Ingredients, Dish Images, Dish Price,
// description, dish category – Appetizer, Salads, Main Course , Desserts, Beverages)
// 5. View list of dishes added by them.

import React, { Component } from 'react';
import { Form, Col, Row, Button, Alert} from "react-bootstrap";

class RestaurantMenuEdit extends Component {
    constructor(props) {
        super(props);
        this.setState({
            errorFlag : false,
            successFlag : false,
        });
        this.onSubmit = this.onSubmit.bind(this);
        this.getDishImageIds(this.props.location.state.dish.id);
    }

    componentWillMount () {
        let dish = this.props.location.state.dish;
        this.setState({
            id: dish.id, 
            name: dish.name,
            ingredients: dish.ingredients,
            description: dish.description,
            price: dish.price,
            category: dish.category,
        });
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        const data = {
            rest_id: localStorage.getItem("restaurant_id"),
            name: this.state.name,
            ingredients: this.state.ingredients,
            description: this.state.description,
            price: this.state.price,
            category: this.state.category,
        };

        
    };

    render() {

        var errorMessage = null;
        if(this.state && this.state.errorFlag) {
            errorMessage = (
                <div>
                    <p style={{ color: "red" }}>Dish Update Failed!</p>
                </div>
            )
        } else if(this.state && this.state.successFlag) {
                errorMessage = (
                    <div>
                        <p style={{ color: "green" }}>Dish Updated!</p>
                    </div>
                )
        }
        return(
            
            <div>
            <center><h2>Update A Dish</h2></center>
                <Row>
                    <Col xs={6} md={4}>
                    </Col>
                    <Col>
                        <br />
                        
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="name">
                                <Form.Label column sm="3">
                                    Name:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="name" placeholder="Enter Dish Name" onChange={this.onChange} defaultValue={this.state.name} pattern="^[A-Za-z0-9 ]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="description">
                                <Form.Label column sm="3">
                                    Description:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="description" placeholder="Description of the dish" onChange={this.onChange} defaultValue={this.state.description} pattern="^[A-Za-z0-9 ,.-]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="ingredients">
                                <Form.Label column sm="3">
                                    Ingredients:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="ingredients" placeholder="Ingredients in the dish" onChange={this.onChange} defaultValue={this.state.ingredients} pattern="^[A-Za-z ,.-]+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="price">
                                <Form.Label column sm="3">Price: </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text" name="price" placeholder="Enter Dish Price" onChange={this.onChange} defaultValue={this.state.price} pattern="^(\d*\.)?\d+$" required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="category">
                                <Form.Label column sm="3">Category:</Form.Label>
                                <Col sm="4">
                                    <Form.Control as="select" onChange={this.onChange} defaultValue={this.state.category} name="category" required>
                                        <option>Appetizer</option>
                                        <option>Salads</option>
                                        <option>Main Course</option>
                                        <option>Desserts</option>
                                        <option>Beverages</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <br/>
                            <Button style={{marginLeft:"22rem"}} variant="danger" href="/r_menu/view">Cancel</Button>  {''}
                            <Button type="sumbit">Update Dish</Button>
                            <br/>
                            {errorMessage}
                            <br/>   
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default RestaurantMenuEdit;