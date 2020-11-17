// 4. Add/Edit Dishes in menu (with Dish name, Main Ingredients, Dish Images, Dish Price,
// description, dish category – Appetizer, Salads, Main Course , Desserts, Beverages)
// 5. View list of dishes added by them.

import React, { Component } from 'react';
import axios from 'axios';
import { Carousel, Form, Col, Row, Button, Alert} from "react-bootstrap";
import yelp_logo from "../../images/yelp.png";
import backend from '../common/serverDetails';

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

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.put(`${backend}/restaurants/${localStorage.getItem("restaurant_id")}/dishes/${this.state.id}`, data)
            .then(response => {
                console.log("Dish update Status : ",response.status, "Response JSON : ",response.data);
                if (response.status !== 200) {
                    this.setState({
                        errorFlag : true,
                        successFlag : false,
                    });
                } else if (response.status === 200) {
                    this.setState({
                        errorFlag : false,
                        successFlag : true,
                    });
                }
            })
            .catch((error) => {
                console.log("Dish update failed!", error);
                this.setState({
                    errorFlag : true,
                });
            });
    };

    getDishImageIds = (dish_id) => {
        console.log("Fetching the imageIds for dishId ", dish_id);

        axios.get(`${backend}/dishes/${dish_id}/images`)
            .then(response => {
                console.log("Status Code : ",response.status, "Response JSON : ",response.data);
                if (response.status === 200) {
                    if (response.data) {
                        this.setState({
                            dishImageIds: response.data
                        });
                    }
                    console.log("Fetching dish image ids success!", this.state);
                } else {
                    console.log("Fetching dish image ids failed!");
                }
            })
            .catch((error) => {
                console.log("Fetching dish image ids failed!", error);
            });
    }

    getImageCarouselItem = (imageId) => {
        let imageSrcUrl = `${backend}/dishes/${this.state.id}/images/${imageId}`;
        console.log(imageSrcUrl);
        return <Carousel.Item>
            <img
            style = {{width:'30rem', height:'20rem'}}
            src={imageSrcUrl}
            alt="First slide"
            />
        </Carousel.Item>
    }

    onImageChoose = (e) => {
        this.setState({
            successImageUpload: false,
            file: e.target.files[0],
            fileName: e.target.files[0].name
        });
    }

    onUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", this.state.file);
        const headers = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        axios.post(`${backend}/dishes/${this.state.id}/images`, formData, headers)
            .then(response => {
                let dishImageIds= this.state.dishImageIds;
                dishImageIds.push(response.data.image_id);
                this.setState({
                    successImageUpload: true,
                    errorImageUpload: false,
                    fileName: "Choose Image",
                    user_image: response.data
                });
            })
            .catch(err => {
                this.setState({
                    successImageUpload: false,
                    errorImageUpload: true,
                });
                console.log("Error");
            });
    }

    render() {

        let carouselList = [], carousel;
        let successImageUploadMessage;

        if (this.state && this.state.dishImageIds && this.state.dishImageIds[0]) {
            for (var i = 0; i < this.state.dishImageIds.length; i++) {
                carousel = this.getImageCarouselItem(this.state.dishImageIds[i]);
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

        if (this.state && this.state.successImageUpload) {
            successImageUploadMessage = <Alert variant="success">Successfully Uploaded Image</Alert>
        }

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
                     <Carousel style={{marginLeft : '5rem'}}>
                        {carouselList}
                    </Carousel>   
                    <form style={{marginLeft : '5rem'}} onSubmit={this.onUpload}><br /><br /><br />
                            <div class="custom-file" style={{width: "80%"}}>
                                <input type="file" multiple class="custom-file-input" name="image" accept="image/*" onChange={this.onImageChoose} required/>
                                <label class="custom-file-label" for="image">{this.state.fileName}</label>
                            </div><br/><br/>
                            <Button type="submit" variant="primary">Upload Image</Button>
                        </form>
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
                {successImageUploadMessage}
            </div>
        )
    }
}

export default RestaurantMenuEdit;