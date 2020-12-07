// Search for Restaurant (using dish names, cuisines, location, mode of delivery )
// 2. Filter restaurant search results based on food delivery method (Curbside Pickup, Dine In, Yelp
// Delivery) and location (neighborhoods)
// 3. Click and view a restaurant page
// 4. Show each restaurant respective location on map via pins(You can use google map API for this).

import React, { Component } from 'react';
import { InputGroup, FormControl, Button, DropdownButton, ListGroup, Row, Col, Dropdown} from 'react-bootstrap';
import CustomerRestaurantSearchCard from './CustomerRestaurantSearchCard';
import { getRestaurantsQuery } from "../../queries/queries";
import { graphql } from 'react-apollo';

class CustomerHome extends Component {
    constructor(props) {
        super(props);
        this.setState({
            noRecord: false
        });
        this.restSearch = this.restSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    restSearch = () => {
        if (this.props.data && this.props.data.restaurants && !this.state.restaurantsInYelp) {
            console.log("I got called");
            var locations = [];
            for (var i = 0; i < this.props.data.restaurants.length; i++) {
                if (!locations.includes(this.props.data.restaurants[i].location))
                    locations.push(this.props.data.restaurants[i].location)
            }
             this.setState({ 
                restaurantsInYelp: this.props.data.restaurants,
                restaurantsToDisplay: this.props.data.restaurants,
                locationList: locations,
                deliveryList: ["Home Delivery" ,"Dine In", "Pick Up"],
            });
        }
    }

    componentDidMount() {
        this.restSearch();
        this.setState({
            search_variable: ".",
            noRecord: false
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            noRecord: false
        });
    }

    onSearchSubmit = (e) => {
        e.preventDefault();
        var listFiltered = [];
        var searchInput = this.state.search_variable+"";
        var searchInputLower = searchInput.toLowerCase();
        console.log(this.state.restaurantsInYelp[0])
        for (var i = 0; i < this.state.restaurantsInYelp.length; i++) {
            if(this.state.restaurantsInYelp[i].name.toLowerCase().includes(searchInputLower)) {
                listFiltered.push(this.state.restaurantsInYelp[i]);
            }
        }
        this.setState({
            restaurantsToDisplay: listFiltered
        });
    }

    onLocationSelect = (e) => {
        var filteredList = this.state.restaurantsInYelp.filter(restaurant => restaurant.location === e.target.text);
        this.setState({
            restaurantsToDisplay: filteredList
        });
    }

    onDeliveryMethodSelect = (e) => {
        var filteredList = this.state.restaurantsInYelp.filter(restaurant => restaurant.delivery_method.includes(e.target.text));
        this.setState({
            restaurantsToDisplay: filteredList
        });
    }

    render() {

        if(!this.state || !this.state.restaurantToDisplay){
            this.restSearch();
        }

        let restaurntsDisplay = null;
        if (this.state && this.state.restaurantsToDisplay) {
            restaurntsDisplay = this.state.restaurantsToDisplay.map(restaurantToDisplay => {
                return (
                    <CustomerRestaurantSearchCard key={restaurantToDisplay.id} restaurant={restaurantToDisplay}></CustomerRestaurantSearchCard>
                )
            })
        }

        var locationDropdown = null;
        if (this.state && this.state.locationList) {
            locationDropdown = this.state.locationList.map(location => {
                console.log("locationDropdown");
                return (
                    <Dropdown.Item href="#" onClick={this.onLocationSelect}>{location}</Dropdown.Item>
                )
            })
        }

        var deliveryMethodDropdown = null;
        if (this.state && this.state.deliveryList) {
            deliveryMethodDropdown = this.state.deliveryList.map(deliveryType => {
                console.log("deliveryMethodDropdown");
                return (
                    <Dropdown.Item href="#" onClick={this.onDeliveryMethodSelect}>{deliveryType}</Dropdown.Item>
                )
            })
        }

        return (
            <div>
                <center>
                <form onSubmit={this.onSearchSubmit}>
                <br/><br/>
                    <InputGroup style={{ width: '50%' }} size="lg">
                        <FormControl
                            placeholder="Enter Restaurant Name"
                            aria-label="Search Restaurants"
                            aria-describedby="basic-addon2"
                            name="search_variable"
                            onChange={this.onChange}
                        />
                        <InputGroup.Append>
                            <Button variant="primary" type="submit">Search</Button>
                        </InputGroup.Append>
                        <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            title="Location"
                            id="input-group-dropdown-2"
                        >
                        {locationDropdown}
                        </DropdownButton>
                        <DropdownButton
                            as={InputGroup.Append}
                            variant="outline-secondary"
                            title="Delivery Method"
                            id="input-group-dropdown-2"
                        >
                        {deliveryMethodDropdown}
                        </DropdownButton>
                    </InputGroup>
                </form>
                </center>
                <Row>
                <Col style={{ margin: '2rem', width: '20rem' }}>
                <ListGroup style={{ width: '20rem' }}>
                    {restaurntsDisplay}
                </ListGroup>
                </Col>
               </Row>
            </div>

        )
    }
}

export default graphql (getRestaurantsQuery, {
    name: "data",
    options: { variables: { input: "." }
    }
}) (CustomerHome);
