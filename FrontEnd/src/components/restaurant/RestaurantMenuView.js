import React, { Component } from 'react';
import axios from 'axios';
import { Container, Alert } from "react-bootstrap";
import Dish from "./Dish";
import backend from '../common/serverDetails';

class RestaurantMenuView extends Component {
    constructor(props) {
        super(props);
        this.setState({
            
        });
        this.getDishes();
    }

    componentDidMount() {
        this.setState({
            categories: ["Main Course", "Salads", "Appetizer", "Desserts", "Beverages"]
        });
    }

    getDishes = () => {
        let rest_id = localStorage.getItem("restaurant_id");
        axios.get(`${backend}/restaurants/${rest_id}/dishes`)
            .then(response => {
                if (response.data[0]) {
                    this.setState({
                        dishes: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: "Error Fetching Dishes",
                    });
                }
            });
    };

    deleteDish = (e) => {
        const data = {
            id: e.target.name,
        };
        let rest_id = localStorage.getItem("restaurant_id");
        axios.delete(`${backend}/restaurants/${rest_id}/dishes/${e.target.name}`)
            .then(response => {
                let new_dishes = this.state.dishes;
                let index = new_dishes.map(dish => dish.id).indexOf(parseInt(data.id));
                if (index > -1) {
                    new_dishes.splice(index, 1);
                }
                let messageToShow = "Successfully deleted the Dish";
                this.setState({
                    dishes: new_dishes,
                    message: messageToShow
                });
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: "Error deleting the dish",
                    });
                }
            });

    };

    dishesView = (category) => {
        var categoriesView = [], dishes, dish, categoryHtml;
        if (this.state && this.state.dishes && this.state.dishes.length > 0) {
            dishes = this.state.dishes.filter(dish => dish.category === category);
            if (dishes.length > 0) {
                categoryHtml = <h3><br/>{category}</h3>;
                categoriesView.push(categoryHtml);
                for (var i = 0; i < dishes.length; i++) {
                    dish = <Dish dish={dishes[i]} deleteDish={this.deleteDish}/>;
                    categoriesView.push(dish);
                }
            }
            return categoriesView;
        }
    };

    render() {
        let message = null,
            category,
            menuRender = [];

        if (this.state && this.state.message) {
            message = <Alert variant="warning">{this.state.message}</Alert>;
        }

        if (this.state && !this.state.dishes) {
            message = <Alert variant="warning">Dishes not added to the menu yet</Alert>;
        }
        
        if (this.state && this.state.categories && this.state.categories.length > 0) {
            for (var i = 0; i < this.state.categories.length; i++) {
                category = this.dishesView(this.state.categories[i]);
                menuRender.push(category);
            }
        }

        return (
            <Container className="justify-content">
                <br />
                <center><h2>Menu</h2></center>
                {message}

                {menuRender}
            </Container>
        );
    }
}

export default RestaurantMenuView;