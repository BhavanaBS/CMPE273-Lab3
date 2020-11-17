// Search for Restaurant (using dish names, cuisines, location, mode of delivery )
// 2. Filter restaurant search results based on food delivery method (Curbside Pickup, Dine In, Yelp
// Delivery) and location (neighborhoods)
// 3. Click and view a restaurant page
// 4. Show each restaurant respective location on map via pins(You can use google map API for this).

import React, { Component } from 'react';
import axios from 'axios';
import { InputGroup, FormControl, Button, DropdownButton, ListGroup, Row, Col, Dropdown} from 'react-bootstrap';
import CustomerRestaurantSearchCard from './CustomerRestaurantSearchCard';
import ReactGoogleMaps from "./ReactGoogleMaps";
import backend from '../common/serverDetails';

import {
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";

import maps from '../../images/google.png';
var geocoder = require('google-geocoder');

class CustomerHome extends Component {
    constructor(props) {
        super(props);
        this.setState({
            search_variable: "",
            noRecord: false
        });
        this.restSearch = this.restSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    restSearch = (search_variable) => {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get(`${backend}/restaurants?search=${search_variable}`)
            .then(response => {
                var locations = [];
                var deliveryMethods = [];
                if (response.data) {
                    if (! response.data[0]) {
                        this.setState({
                            noRecord: true,
                            search_variable: "",
                            deliveryList: ["Home Delivery" ,"Dine In", "Pick Up"],
                        });
                    }
                    else {
                        for (var i = 0; i < response.data.length; i++) {
                            if(!locations.includes(response.data[i].location))
                                locations.push(response.data[i].location)
                            if(!deliveryMethods.includes(response.data[i].delivery_method))
                                deliveryMethods.push(response.data[i].delivery_method)
                    }
                    this.setState({
                        restaurantsToDisplay: response.data,
                        locationList: locations,
                        deliveryList: ["Home Delivery" ,"Dine In", "Pick Up"],
                    });
                    }
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                }
            })
    }

    componentDidMount() {
        this.restSearch("");
        this.setState({
            search_variable: "",
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
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get(`${backend}/restaurants?search=${this.state.search_variable}`)
            .then(response => {
                var locations = [];
                var deliveryMethods = [];
                if (response.data) {
                    if (! response.data[0]) {
                        this.setState({
                            noRecord: true,
                            search_variable: ""
                        });
                    }
                    else {
                        for (var i = 0; i < response.data.length; i++) {
                            if(!locations.includes(response.data[i].location))
                                locations.push(response.data[i].location)
                            if(!deliveryMethods.includes(response.data[i].delivery_method))
                                deliveryMethods.push(response.data[i].delivery_method)
                        }
                        this.setState({
                            restaurantsToDisplay: response.data,
                            locationList: locations,
                            deliveryList: ["Home Delivery" ,"Dine In", "Pick Up"],
                        });
                    }
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    console.log(error.response.data);
                }
            })
    }

    onLocationSelect = (e) => {
        var filteredList = this.state.restaurantsToDisplay.filter(restaurant => restaurant.location === e.target.text);
        this.setState({
            restaurantsToDisplay: filteredList
        });
    }

    onDeliveryMethodSelect = (e) => {
        var filteredList = this.state.restaurantsToDisplay.filter(restaurant => restaurant.delivery_method.includes(e.target.text));
        this.setState({
            restaurantsToDisplay: filteredList
        });
    }

    render() {
        let restaurntsDisplay = null;
        if (this.state && this.state.restaurantsToDisplay) {
            restaurntsDisplay = this.state.restaurantsToDisplay.map(restaurantToDisplay => {
                return (
                    <CustomerRestaurantSearchCard key={restaurantToDisplay.id} restaurant={restaurantToDisplay}></CustomerRestaurantSearchCard>
                )
            })

        var locations=[];
        this.state.restaurantsToDisplay.map(restaurantToDisplay => {
            locations.push({
                lat: parseFloat(restaurantToDisplay.map_location.split(",")[0]), 
                lng: parseFloat(restaurantToDisplay.map_location.split(",")[1]), 
            });
        })

        console.log("Google Maps Location Pins", locations)
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

        let googleMaps =null;
        if(this.state && locations && locations[0]) {
            googleMaps = <ReactGoogleMaps locations={locations}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSEcpgPEGOEYcnDe4N68Ptex96GKMtOLE&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} 
                    />}
                />
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
               <Col align='right' style={{ margin: '4rem', width: '20rem' }}>
                {googleMaps}
                </Col>
               </Row>
            </div>

        )
    }
}

export default CustomerHome;
