import React, { Component } from 'react';
import { Container, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { Redirect } from 'react-router';
import { getReviewsQuery } from "../../queries/queries";
import { graphql } from 'react-apollo';

class RestaurantReviewsView extends Component {

    constructor(props) {
        super(props);
        this.setState({
            errorFlag: false,
        });
        this.getReviews();
    }

    getReviews(){
        if (this.props.data && this.props.data.reviews && this.state && !this.state.restaurantReviews) {
            console.log("I got called");
             this.setState({ 
                restaurantReviews: this.props.data.reviews,
            });
        }
    }

    componentDidMount() {
        this.getReviews();
        this.setState({

        })
    }


    getLocaleTime = (create_time) => {
        var ts = new Date(create_time);
        console.log("Timestamp:", ts.toLocaleString);
        return ts.toLocaleString();
    }

    getStars = (rating) => {
        if(rating === 1) {
            return "*";
        } else if(rating === 2) {
            return "**";
        } else if(rating === 3) {
            return "***";
        } else if(rating === 4) {
            return "****";
        } else if(rating === 5) {
            return "*****";
        } 
        
    }

    reviewsView = (reviewToProcess) => {
        return (
             <Card bg={"light"} style={{ width: "50rem", margin: "2%" }}>
        <Row>
          <Col>
            <Card.Body>
              <Card.Text><b>Rating: </b> <h3>{this.getStars(reviewToProcess.rating)}</h3></Card.Text>
              <Card.Text><b>Review: </b>{reviewToProcess.review}</Card.Text>
              <Card.Text><b>Reviewed On: </b>{this.getLocaleTime(reviewToProcess.create_time)}</Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
        );
    };

    render () {

        let message, review;
        let reviewsList = [];

        this.getReviews();

        if (this.state && this.state.errorFlag) {
            message = <Alert variant="warning">No rewiews available yet.</Alert>;
        }
        
        if (this.state && this.state.restaurantReviews) {
            for (var i = 0; i < this.state.restaurantReviews.length; i++) {
                review= this.reviewsView(this.state.restaurantReviews[i]);
                reviewsList.push(review);
            }
        }
        
        return(
            <Container className="justify-content">
            <br/><br/>
            <h2><center> Reviews for Your Restaurant </center></h2>
            <br/>
            {message}

            <center>{reviewsList}</center>
            <center><Button href="/r_home">Home</Button></center>

            </Container>
        );
    }
}

export default graphql(getReviewsQuery, {
    name: "data",
    options: { variables: { restaurant_id: localStorage.getItem("restaurant_id") }
    }
})(RestaurantReviewsView);