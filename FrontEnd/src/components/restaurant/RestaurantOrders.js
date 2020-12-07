import React, { Component } from 'react';
import { Alert, Button, Form} from "react-bootstrap";
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import { getRestaurantOrdersQuery } from "../../queries/queries";
import { compose, graphql } from 'react-apollo';
import { updateOrderMutation } from "../../mutation/mutations";

class RestaurantOrders extends Component {

    constructor(props) {
        super(props);
        this.setState({
            errorFlag : false,
            successFlag: false,
            rest_id : localStorage.getItem("restaurant_id"),
            update_success_order_id: ""
        });
        this.getRestaurantOrders = this.getRestaurantOrders.bind(this);
    }

    componentDidMount () {
        this.getRestaurantOrders();
        this.setState({

        })
    }

    getRestaurantOrders() {
        if (this.props.data && this.props.data.restaurantOrders 
            && this.state && !this.state.restaurantOrderHistory) {
            console.log("I got called");
             this.setState({ 
                restaurantOrderHistory: this.props.data.restaurantOrders,
            });
        }
    }

    clearSuccessMessage = (e) => {
        this.setState({
            updateSuccess: false,
            updateFailed: false,
        })
    }

    updateOrderStatus = async (e) => {
        let mutationResponse = await this.props.updateOrderMutation({
            variables: {
                order_id: e.target.name,
                status: e.target.value,
            }
        });
        let response = mutationResponse.data.updateOrder;
        if (response) {
            if (response.status === "200") {
                this.setState({
                    success: true,
                    data: response.message,
                    loginFlag: true
                });
            } else {
                this.setState({
                    message: response.message,
                    loginFlag: true
                });
            }
        }

    }

    columns = [{
        dataField: 'cust_name',
        text: 'Customer'
      }, {
        dataField: 'create_time',
        text: 'Order Time'
      }, {
        dataField: 'status',
        text: 'Status',
        filter: textFilter()
      }, {
        dataField: 'change_status',
        text: 'Update Status',
      }, {
        dataField: 'dish_name',
        text: 'Dish Name',
      }, {
        dataField: 'quantity',
        text: 'Quantity',
      }, {
        dataField: 'delivery_method',
        text: 'Delivery Method'
      }];

    getStatusFormControl = (order) => {
        let statusDropdown;
        let statusOptions;
        let statusesHomeDelivery = ["Order Received", "Preparing", "On The Way", "Delivered", "Cancelled"];
        let statusesPickUp = ["Order Received", "Preparing", "Ready For Pick Up", "Picked Up", "Cancelled"];
        let statuses = order.delivery_method === "Home Delivery" ? statusesHomeDelivery : statusesPickUp;
        statusOptions = statuses.map(status => {
            if (status === order.status) {
                return <option selected>{status}</option>;
            }
            return <option>{status}</option>;
        });
        statusDropdown = (
            <Form.Control as="select" style={{ width: "80%" }} name={order.id} onClick={this.clearSuccessMessage} onChange={this.updateOrderStatus}>
                {statusOptions}
            </Form.Control>
        );
        return statusDropdown;
    } 

    render() {

        let message, bootstrapTable;
        let change_status;

        this.getRestaurantOrders();

        if(this.state && !this.state.restaurantOrderHistory) {
            message = <Alert varient ="warning">No Order History.</Alert>
        }

        if(this.state && this.state.errorFlag) {
            message = <Alert varient ="warning" style={{color:"red"}}>Restaurant Orders fetch failed.</Alert>
        }

        if(this.state && this.state.updateSuccess) {
            message = <Alert varient ='success' style={{color:"green"}}>Order status updated successfully.</Alert>
        }

        if(this.state && this.state.restaurantOrderHistory) {
            let bootStrapTableOrders = this.state.restaurantOrderHistory.map(o => { return {
                id: o.id,
                cust_name:<Button>Customer Details</Button>,
                create_time: o.create_time,
                status: o.status,
                change_status: this.getStatusFormControl(o),
                dish_name:o.dish_name,
                quantity:o.quantity,
                delivery_method:o.delivery_method,
            }});

            bootstrapTable = <BootstrapTable 
                                keyField='id' 
                                data={bootStrapTableOrders} 
                                columns={this.columns}
                                filter={ filterFactory()} 
                                >
                            </BootstrapTable>
            
        }

        return (
            <div>
                <br/><br/>
                <h2><center> Your Orders </center></h2>  
                <br/>
                {message}
                <br/>
                <div style={{marginLeft:"15rem", marginRight:"15rem"}}>
                {bootstrapTable}
                </div>
                {change_status}
                <center><Button href="/r_home">Home</Button></center>
            </div>
            );
    }

}

export default compose(
graphql (getRestaurantOrdersQuery, {
    name: "data",
    options: { variables: { restaurant_id: localStorage.getItem("restaurant_id")  }
    }
}),
graphql(updateOrderMutation, { name: "updateOrderMutation" })
) (RestaurantOrders);