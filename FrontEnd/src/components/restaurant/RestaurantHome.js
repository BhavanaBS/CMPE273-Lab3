import React, {Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import { getRestaurantQuery } from "../../queries/queries";
import { graphql } from 'react-apollo';
import { Card, Container, Table,Row, Col } from "react-bootstrap";


class RestaurantHome extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {};
    }

    getRestprofile(){
       if (this.props.data && this.props.data.restaurant && !this.state.restaurantDetails) {
           console.log("I got called");
            this.setState({ 
                restaurantDetails: this.props.data.restaurant,
            });
       }
    }

    render() {
        var restaurantDetailsTable = null;
        let redirectVar = null;

        if(!this.state || !this.state.restaurantDetails){
            this.getRestprofile();
        }

        if(!localStorage.getItem("restaurant_id")) {
            redirectVar = <Redirect to="/home" />;
        }

        if(this.state.restaurantDetails) {
            restaurantDetailsTable = (<center>
                <Card>
                <Row>
                <Col>
                <br/><br/>
                    <Card.Title>
                        <h1>{this.state.restaurantDetails.name}</h1>
                    </Card.Title>

                    
                    <Card.Body>
                        <Table style={{ width: "100%", fontSize:"18px" }}>
                            <tbody>
                                <tr>
                                    <td >Email Id</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.email_id}</td>
                                </tr>
                                <tr>
                                    <td >Location</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.location}</td>
                                </tr>
                                <tr>
                                    <td >Phone Number</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.phone}</td>
                                </tr>
                                <tr>
                                    <td >Description</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.description}</td>
                                </tr>
                                <tr>
                                    <td >Timings</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.timings}</td>
                                </tr>
                                <tr>
                                    <td >Delivery Method</td>
                                    <td></td>
                                    <td align="left">{this.state.restaurantDetails.delivery_method}</td>
                                </tr>
                            </tbody>
                        </Table>
                        
                    </Card.Body>
                    </Col>
                    </Row>
                    <Link align="center" style={{ width: "20%", marginLeft: '2rem', fontSize:"18px" }} to="/r_profile" class="btn btn-primary">Edit Profile</Link>
                    <br/>
                    <br/>
                </Card>
                <br/>
                <br/>
            </center>
            
            );
        }
        return (
            <div>
                {redirectVar}
                <Container className="justify-content">
                <br/><br/>
                    {restaurantDetailsTable}
                </Container>
            </div>
        );    
    }
}

export default graphql(getRestaurantQuery, {
    name: "data",
    options: { variables: { restaurant_id: localStorage.getItem("restaurant_id") }
    }
})(RestaurantHome);
