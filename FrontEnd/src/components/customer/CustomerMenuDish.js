import React, { Component } from "react";
import { Card, Button, Col, Row, Modal } from "react-bootstrap";
import dishImage from "../../images/dishImage.jpg";

class CustomerMenuDish extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  openModal = () => {
    this.setState({
      showAddToCartModal: true
    });
  };

  onClose = (e) => {
    this.setState({
      showAddToCartModal: false
    });
  }

  onQuantityChange = (e) => {
    let quantity = parseInt(e.target.value, 10);
    this.setState({
      dish_quantity: quantity
    });
  };

  addDishToCart = (e) => {
    let dish_id = this.props.dish.id;
    let dishes_in_cart = [];

    if (parseInt(localStorage.getItem("cart_restaurant_id"), 10) !== this.props.rest_id) {
      localStorage.setItem("dishes_in_cart", dishes_in_cart);
    }

    if (localStorage.getItem("dishes_in_cart")) {
        dishes_in_cart.push(...JSON.parse(localStorage.getItem("dishes_in_cart")));
    }

    let index = dishes_in_cart.findIndex((dish_in_cart => dish_in_cart.id === dish_id));
    if (index === -1) {
      dishes_in_cart.push({ id: dish_id, dish_quantity: this.state.dish_quantity || 1, dish_name: this.props.dish.name, dish_price: this.props.dish.price });
      localStorage.setItem("cart_restaurant_id", this.props.resData.id);
      localStorage.setItem("cart_restaurant_name", this.props.resData.name);
      localStorage.setItem("dishes_in_cart", JSON.stringify(dishes_in_cart));
      this.setState({
        showAddToCartModal: false,
        dish_quantity: 1
      });
    }
  };

  removeDishFromCart = (e) => {
    let dish_id = this.props.dish.id;
    let dishes_in_cart = [];

    if (localStorage.getItem("dishes_in_cart")) {
      dishes_in_cart.push(...JSON.parse(localStorage.getItem("dishes_in_cart")));
    }

    let index = dishes_in_cart.findIndex((dish_in_cart => dish_in_cart.id === dish_id));
    if(index !== -1){
      e.target.textContent = "Add to Cart";
      e.target.className = "btn btn-primary";
      dishes_in_cart.splice(index, 1);
      localStorage.setItem("dishes_in_cart", JSON.stringify(dishes_in_cart));
      this.setState({
        dish_quantity: null
      });
    }
  };

  render() {
    
    let showAddToCartModal = false;
    let buttonText = "Add Dish To Cart";
    let dishes_in_cart = [];
    let dishes_in_cart_ids = [];
    let onButtonClick = this.openModal;

    if (localStorage.getItem("dishes_in_cart")) {
      dishes_in_cart.push(...JSON.parse(localStorage.getItem("dishes_in_cart")));
      dishes_in_cart_ids = dishes_in_cart.map(dishes_in_cart => dishes_in_cart.id);
      buttonText = dishes_in_cart_ids.includes(this.props.dish.id) ? "Remove Dish From Cart" : buttonText;
      onButtonClick = dishes_in_cart_ids.includes(this.props.dish.id) ? this.removeDishFromCart : onButtonClick;
    }

    if(this.state) {
      showAddToCartModal = this.state.showAddToCartModal;
    }

    return (
      <div>
        <Card bg="white" style={{ width: "50rem", margin: "2rem", marginLeft: "8rem"   }}>
          <Row>
            <Col align="left" style={{marginLeft:'2rem'}}>
              <Card.Body>
                <Card.Title>{this.props.dish.name}</Card.Title>
                <Card.Text><p>{this.props.dish.description}</p></Card.Text>
                <Card.Text>Price: $ {this.props.dish.price}</Card.Text>
                <Button onClick={onButtonClick} name={this.props.dish.id}>{buttonText}</Button>&nbsp; &nbsp;
              </Card.Body>
            </Col>
            <Col align="right" style={{marginRight:'2rem'}}>
                <img
                style = {{width:'13rem', height:'13rem'}}
                src={dishImage}
                alt="First slide"
                />
            </Col>
          </Row>
        </Card>
        <Modal show={showAddToCartModal} onHide={this.onClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.dish.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <p>{this.props.dish.description}</p>
              Quantity: <input type="number" name={this.props.dish.id} min="1" max="10" width="10%" onChange={this.onQuantityChange} defaultValue="1" autofocus></input>
            </center>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addDishToCart}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CustomerMenuDish;