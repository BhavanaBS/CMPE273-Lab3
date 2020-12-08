// Update customer profile (name, location, description, contact information, pictures of customer and dishes, timings)
// TODO: Update the customer Image

import React, {Component} from 'react';
import '../../App.css';
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { customerUpdateMutation } from "../../mutation/mutations";
import { compose, graphql } from 'react-apollo';
import { getCustomerQuery } from "../../queries/queries";
import { Redirect } from 'react-router';

class CustomerProfile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fileName: "Browse Image To Upload",
            // user_image:profile,
        };
        this.onChange = this.onChange.bind(this);
        this.onCustomerUpdate = this.onCustomerUpdate.bind(this);
        // this.getProfilePicture = this.getProfilePicture.bind(this);
    }

    componentDidMount() {
        this.getCustProfile();
    }

    onChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getCustProfile(){
        if (this.props.data && this.props.data.customer && this.state && !this.state.customerDetails) {
            console.log("I got called");
             this.setState({ 
                customerDetails: this.props.data.customer,
            });
        }
    }

    onCustomerUpdate = async (e) => {
        //prevent page from refresh
        e.preventDefault();
        console.log("on customer profile update");
        let mutationResponse = await this.props.customerUpdateMutation({
            variables: {
                email_id: this.state.customerDetails.email_id,
                name: this.state.name?this.state.name:this.state.customerDetails.name,
                phone: this.state.phone?this.state.phone:this.state.customerDetails.phone,
                dob: this.state.dob?this.state.dob:this.state.customerDetails.dob,
                city: this.state.city?this.state.city:this.state.customerDetails.city,
                state: this.state.state?this.state.state:this.state.customerDetails.state,
                country: this.state.country?this.state.country:this.state.customerDetails.country,
                nick_name: this.state.nick_name?this.state.nick_name:this.state.customerDetails.nick_name,
                about: this.state.about?this.state.about:this.state.customerDetails.about,
                join_date: this.state.join_date?this.state.join_date:this.state.customerDetails.join_date,
                favourite_restaurant: this.state.favourite_restaurant?this.state.favourite_restaurant:this.state.customerDetails.favourite_restaurant,
                favourite_hobby: this.state.favourite_hobby?this.state.favourite_hobby:this.state.customerDetails.favourite_hobby,
                blog_url: this.state.blog_url?this.state.blog_url:this.state.customerDetails.blog_url,
            }
        });
        let response = mutationResponse.data.customerUpdate;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    updateFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    updateFlag: true
                });
            }
        }
    };

    render() {

        let redirectVar = null, error = "" , success= "";
        if (localStorage.getItem("customer_id") === null ) {
            redirectVar = <Redirect to="/r_home" />
        }

        if(!this.state.customerDetails){
            this.getCustProfile();
        }

        if (this.state.success) {
            success = (
                        <div>
                            <Alert variant="success">Profile Updated Successfully!</Alert>
                        </div>
                    );
            // success = "Profile Updated Successfully";
        }   
        else if (this.state.message === "CUSTOMER_UPDATE_ERROR" && this.state.updateFlag) {
            error = (
                <div>
                    <Alert variant="danger">Profile update failed. Please try again in some time.</Alert>
                    </div>
                );
        }
        else if (this.state.message === "INTERNAL_SERVER_ERROR" && this.state.updateFlag) {
            error = (
                <div>
                    <Alert variant="danger">Profile update failed. Please try again in some time.</Alert>
            </div>
        );
        }

        if(!this.state.customerDetails) {
            return (
                <div>
                <p> 
                    Please wait for some time
                </p>
                </div>
            )
        }
        
        var joinDate = null;
        if(this.state.customerDetails.join_date) {
            joinDate = this.state.customerDetails.join_date.slice(0,10);
        }

        return (
            <div>
            {redirectVar}
                <Container fluid={true}>
                <br/><br/><br/>

                    <Row>
                        <Col xs={4} md={2}></Col>
                        <Col style={{ width: '60rem' }}>
                        
                            <h2>Update {this.state.customerDetails.name}'s Profile</h2>
                            <br />
                            <br />
                            <Form onSubmit={this.onCustomerUpdate} >
                                <Form.Row>
                                    <Form.Group as={Row} controlId="name">
                                        <Form.Label style={{ width: '15rem' }} >Customer Name</Form.Label>
                                        <Form.Control name="name"
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.name}
                                            pattern="^[A-Za-z0-9 ]+$"
                                            placeholder={this.state.customerDetails.name}
                                            style={{ width: '30rem' }}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="about">
                                        <Form.Label  style={{ width: '15rem' }}>About Me</Form.Label>
                                        <Form.Control name="about"
                                            type="text"
                                            onChange={this.onChange}
                                            value={this.state.about}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.customerDetails.about}
                                            style={{ width: '30rem' }}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="city">
                                        <Form.Label  style={{ width: '15rem' }}>City</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="city"
                                            onChange={this.onChange}
                                            value={this.state.city}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.customerDetails.city}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="state">
                                        <Form.Label  style={{ width: '15rem' }}>State</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="state"
                                            onChange={this.onChange}
                                            value={this.state.state}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.customerDetails.state}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="country">
                                        <Form.Label  style={{ width: '15rem' }}>Country</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="country"
                                            onChange={this.onChange}
                                            value={this.state.country}
                                            pattern="^[A-Za-z0-9 ,.]+$"
                                            placeholder={this.state.customerDetails.country}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="email_id">
                                        <Form.Label  style={{ width: '15rem' }}>Email</Form.Label>
                                        <Form.Control 
                                            type="email"
                                            name="email_id"
                                            value={this.state.customerDetails.email_id}
                                            readOnly
                                            disabled
                                            style={{ width: '30rem' }}
                                            />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="phone">
                                        <Form.Label  style={{ width: '15rem' }}>Phone Number</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="phone"
                                            onChange={this.onChange}
                                            value={this.state.phone}
                                            pattern="^[0-9+()-]+$"
                                            title="Please enter in the form Only Numbers"
                                            placeholder={this.state.customerDetails.phone}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="dob">
                                        <Form.Label  style={{ width: '15rem' }}>Date Of Birth</Form.Label>
                                        <Form.Control 
                                            type="date"
                                            name="dob"
                                            value={this.state.dob}
                                            onChange={this.onChange}
                                            pattern="^[0-9-]+$"
                                            placeholder={this.state.customerDetails.dob}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="nick_name">
                                        <Form.Label  style={{ width: '15rem' }}>Preferred Name</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="nick_name"
                                            value={this.state.nick_name}
                                            onChange={this.onChange}
                                            pattern="^[a-zA-z ]+$"
                                            placeholder={this.state.customerDetails.nick_name}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="join_date">
                                        <Form.Label  style={{ width: '15rem' }}>Join Date</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="join_date"
                                            value={joinDate}
                                            disabled 
                                            style={{ width: '30rem' }}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="blog_url">
                                        <Form.Label  style={{ width: '15rem' }}>Blog url</Form.Label>
                                        <Form.Control 
                                            type="url"
                                            name="blog_url"
                                            value={this.state.blog_url}
                                            onChange={this.onChange}
                                            placeholder={this.state.customerDetails.blog_url}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="favourite_hobby">
                                        <Form.Label  style={{ width: '15rem' }}>Favourite Hobby</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="favourite_hobby"
                                            value={this.state.favourite_hobby}
                                            onChange={this.onChange}
                                            placeholder={this.state.customerDetails.favourite_hobby}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Row} controlId="favourite_restaurant">
                                        <Form.Label  style={{ width: '15rem' }}>Favourite Restaurant</Form.Label>
                                        <Form.Control                                             
                                            type="text"
                                            name="favourite_restaurant"
                                            value={this.state.favourite_restaurant}
                                            onChange={this.onChange}
                                            placeholder={this.state.customerDetails.favourite_restaurant}
                                            style={{ width: '30rem' }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <br/>
                                <Button style={{marginLeft:"31rem"}} variant="danger" href="/customer/home">Cancel</Button> &nbsp;
                                <Button type="submit" variant="success">Update Details</Button>
                            </Form>
                        </Col>
                    </Row>
                    <br/><br/>
                    {error}
                    {success}
                    <br/><br/>
                </Container>
            </div>
        )
    }
}

export default compose(
    graphql(getCustomerQuery, {
        name: "data",
        options: { variables: { customer_id: localStorage.getItem("customer_id") }
        }
    }),
    graphql(customerUpdateMutation, { name: "customerUpdateMutation" })
)(CustomerProfile);
