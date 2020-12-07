// Read from local storage the cart dishes and display
// Select delivery method
// Send Order to restaurant

import React, { Component } from 'react';
import { Alert, Table, Button, Dropdown, Modal } from "react-bootstrap";
import { Redirect } from 'react-router';
import { createOrderMutation } from "../../mutation/mutations";
import { graphql } from 'react-apollo';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.setState({
            deliveryMethod : "Home Delivery"
        });
    }

    componentDidMount(){
        document.title = "Dishes in Cart"
        let dishes_in_cart;
        if (localStorage.getItem("dishes_in_cart")) {
            dishes_in_cart= JSON.parse(localStorage.getItem("dishes_in_cart"))
        }
        this.setState({
            dishes_in_cart : dishes_in_cart,
            cart_restaurant_id: localStorage.getItem("cart_restaurant_id"),
        });
    }

    onDeliveryMethodSelection = (e) => {
        console.log("Event from dropdown", e.target.text);
        this.setState({
            deliveryMethod: e.target.text,
        })
    }

    dishesView = (index, dish) => {
        return <tr>
                    <td>{index}</td>
                    <td>{dish.dish_name}</td>
                    <td>{dish.dish_quantity}</td>
                    <td>{dish.dish_price * dish.dish_quantity}</td>
                </tr>;
    }

    placeOrder = async () => {
        console.log("Order Submit Call");
        let mutationResponse = await this.props.createOrderMutation({
            variables: {
                restaurant_id: localStorage.getItem("cart_restaurant_id"),
                customer_id: localStorage.getItem("customer_id"),
                delivery_method: this.state.deliveryMethod,
                dish_name: this.state.dishes_in_cart[0].dish_name,
                quantity: this.state.dishes_in_cart[0].dish_quantity,
                restaurant_name: localStorage.getItem("cart_restaurant_name"),
            }
        });
        let response = mutationResponse.data.createOrder;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    placeOrderFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    placeOrderFlag: true
                });
            }
        }
    }

    render() {

        let dishes = [], dishesInCart, dish, message, submitButton, deliveryMethod, successModal;

        if(this.state && this.state.placeOrderFlag && this.state.message) {
            message = <div>
                        <p style={{ color: "red" }}> Failed to place an Order. Please retry.</p>
                    </div>
        } else if(this.state && this.state.placeOrderFlag && this.state.data && this.state.data==='ORDER_PLACED') {
            message = <div>
                    <p style={{ color: "green" }}> Order Successfully Placed.</p>
                    </div>;
            
            successModal = <Modal
                            show={true}
                            backdrop="static"
                            keyboard={false}
                            centered={true}
                        >
                            <Modal.Header>
                            <Modal.Title>Success</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Order Successfully Placed.
                            </Modal.Body>
                            <Modal.Footer>
                            <Button href="/c_orders" variant="primary">Review Orders</Button>
                            </Modal.Footer>
                        </Modal>
        }

        if (this.state && this.state.dishes_in_cart ) {
            for (var i = 0; i < this.state.dishes_in_cart.length; i++) {
                if(this.state.dishes_in_cart[i]){    
                    dish = this.dishesView((i+1), this.state.dishes_in_cart[i]);
                    dishes.push(dish);
                }
            }

            dishesInCart = 
            <div>
            <h2 style={{ marginLeft:"5rem"}}> Dishes in Cart</h2>
            <br/>
            <Table striped bordered hover style={{ width:"75rem", marginLeft:"5rem"}}>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Dish Name</th>
                    <th>Dish Quantity</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes}
                </tbody>
            </Table>
            </div>;

            deliveryMethod = <Dropdown >
                                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ marginLeft:"5rem"}}>
                                    Select Delivery Type
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.onDeliveryMethodSelection} eventKey='HomeDelivery'>Home Delivery</Dropdown.Item>
                                    <Dropdown.Item onClick={this.onDeliveryMethodSelection} eventKey='PickUp'>Pick Up</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

            submitButton = <Button style={{ marginLeft:"5rem"}} onClick={this.placeOrder}>Place Order</Button>
        } else {
            message = <Alert variant="warning">No dishes in cart!</Alert>
        }

        return(
            <div>

                <br/><br/>
                <div>{message}</div>
                {successModal}
                {dishesInCart}
                <br/>
                {deliveryMethod}
                <br/>
                {submitButton}
                <center>
                    <Button href="/c_home">Home</Button>
                </center>
            </div>
        )
    }
}

export default graphql(createOrderMutation, { name: "createOrderMutation" })(Cart);
