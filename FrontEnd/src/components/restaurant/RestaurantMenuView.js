import React, { Component } from 'react';
import { Container, Alert } from "react-bootstrap";
import Dish from "./Dish";
import { getRestaurantMenuQuery } from "../../queries/queries";
import { graphql } from 'react-apollo';

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
        if (this.props.data && this.props.data.menu && !this.state.restaurantMenu) {
            console.log("I got called");
             this.setState({ 
                restaurantMenu: this.props.data.menu,
            });
        }        
    };

    dishesView = (category) => {
        var categoriesView = [], dishes, dish, categoryHtml;
        if (this.state && this.state.restaurantMenu && this.state.restaurantMenu.length > 0) {
            dishes = this.state.restaurantMenu.filter(dish => dish.category === category);
            if (dishes.length > 0) {
                categoryHtml = <h3><br/>{category}</h3>;
                categoriesView.push(categoryHtml);
                for (var i = 0; i < dishes.length; i++) {
                    dish = <Dish dish={dishes[i]}/>;
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

        this.getDishes();

        if (this.state && !this.state.restaurantMenu) {
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

export default graphql(getRestaurantMenuQuery, {
    name: "data",
    options: { variables: { restaurant_id: localStorage.getItem("restaurant_id") }
    }
})(RestaurantMenuView);
