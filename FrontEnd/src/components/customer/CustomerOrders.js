// View list of all the orders placed (along with order Date-Time, order status)
// 2. Filter the order based on the order status – Order Received, Preparing,
// (If Delivery option selected) On the way, Delivered (If Pickup option selected) Pick up Ready, Picked up
 
import React, { Component } from 'react';
import { Alert, Table, Button, Modal} from "react-bootstrap";
import axios from 'axios';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import backend from '../common/serverDetails';

// const selectOptions = {
//     0: 'Order Placed',
//     1: 'Delivered',
//     2: 'Picked Up',
//     3: 'Ready For Pick Up',
//     4: 'Preparing',
//     5: 'On The Way',
//     6: 'Cancelled'
//   };

class CustomerOrders extends Component {
    constructor(props) {
        super(props);
        this.setState({
            successFlag : false,
            errorFlag : false,
            deliveryMethod : "Home Delivery",
            cust_id : localStorage.getItem("customer_id"),
        });
        this.getCustomerOrders();
    }


    getCustomerOrders() {
        let cust_id = localStorage.getItem("customer_id");
        axios.defaults.withCredentials = true;
        axios.get(`${backend}/customers/${cust_id}/orders`)
            .then(response => {
                if (response.data) {
                    this.setState({
                        orders: response.data,
                        errorFlag: false,
                        successFlag : true,
                    });
                }
            })
            .catch(err => {
                this.setState({
                    errorFlag: true,
                    successFlag : false,
                });
            });
    }



    showOrder = (e) => {
        console.log(e.target);
        this.setState({
            modal_order_id: e.target.name,
        })
    }

    ordersView = (index, order) => {
        var date = new Date(order.create_time);
        var status = order.status === "NEW" ? "Order Placed" : order.status;
        
        return <tr>
                    <td>{index}</td>
                    <td>{order.rest_name}</td>
                    <td>{date.toLocaleString()}</td>
                    <td>{status}</td>
                    <td><Button onClick={this.showOrder} name={order.id}>Order Details</Button></td>
                </tr>;
    }

    dishView = (index, dish) => {
        return <tr>
                    <td>{index}</td>
                    <td>{dish.name}</td>
                    <td>{dish.quantity}</td>
                    <td>{dish.price * dish.quantity}</td>
                </tr>;
    }

    handleDetailsModalClose = () => {
        this.setState({
            modal_order_id: ""
        })
    }

    onStatusSelection = (e) => {
        console.log("Event from dropdown", e.target.text);
        this.setState({
            deliveryMethod: e.target.eventKey,
        })
    }

    columns = [{
        dataField: 'rest_name',
        text: 'Restaurant Name'
      }, {
        dataField: 'create_time',
        text: 'Order Time'
      }, {
        dataField: 'status',
        text: 'Status',
        filter: textFilter()
      }, {
        dataField: 'details',
        text: 'Details'
      }];

    getLocaleTime = (create_time) => {
        var ts = new Date(create_time);
        console.log("Timestamp:", ts.toLocaleString);
        return ts.toLocaleString();
    }

    convertStatus = (status) => {
        if (status === "NEW") {
            return "Order Placed";
        }
        return status;
    }

    render () {

        let message, orders_table, bootstrapTable;
        let details_modal, modal_order, dish_details_in_modal = [], dish;
        if(this.state && !this.state.orders) {
            message = <Alert varient ="warning">No Order History.</Alert>
        }

        if(this.state && this.state.errorFlag) {
            message = <Alert varient ="warning">Error Fetching Order History.</Alert>
        }

        if (this.state && this.state.orders) {
            // for (var i = 0; i < this.state.orders.length; i++) {
            //     if(this.state.orders[i]){    
            //         order = this.ordersView((i+1), this.state.orders[i]);
            //         orders.push(order);
            //     }
            // }

            let bootStrapTableOrders = this.state.orders.map(o => { return {
                id: o.id,
                rest_name:o.rest_name,
                create_time: this.getLocaleTime(o.create_time),
                status: this.convertStatus(o.status),
                details: <Button onClick={this.showOrder} name={o.id}>Order Details</Button>
            }});

            // orders_table = <div><Table striped bordered hover>
            //                     <thead>
            //                         <tr>
            //                         <th>#</th>
            //                         <th>Restaurant Name</th>
            //                         <th>Order Time</th>
            //                         <th>Staus</th>
            //                         <th>Details</th>
            //                         </tr>
            //                     </thead>
            //                     <tbody>
            //                         {orders}
            //                     </tbody>
            //                 </Table>
            //                 </div>;
            bootstrapTable = <BootstrapTable 
                                keyField='id' 
                                data={bootStrapTableOrders} 
                                columns={this.columns}
                                filter={ filterFactory() }
                                >
                            </BootstrapTable>
            
        }

        if (this.state && this.state.modal_order_id) {
            console.log("Modal OrderId", this.state.modal_order_id)
            modal_order = this.state.orders.find(o => o.id === parseInt(this.state.modal_order_id, 10));
            console.log("Modal Order:", modal_order);
            for (var i = 0; i < modal_order.dishes.length; i++) {
                if(modal_order.dishes[i]){    
                    dish = this.dishView((i+1), modal_order.dishes[i]);
                    dish_details_in_modal.push(dish);
                }
            }
            details_modal = <Modal
                                    show={true}
                                    backdrop="static"
                                    onHide={this.handleDetailsModalClose}
                                    keyboard={false}
                                    centered={true}
                                >
                                    <Modal.Header closeButton>
                                    <Modal.Title>Order Details</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                <th>#</th>
                                                <th>Dish Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dish_details_in_modal}
                                            </tbody>
                                        </Table>
                                        
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.handleDetailsModalClose}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

        }

        return(
            <div>
            <center>
                <br/><br/>
                <h2>Your Order History</h2>
                <br/>
                
                {message}
                <br/>
                {orders_table}
                <div style={{marginLeft:"10rem", marginRight:"10rem"}}>
                {bootstrapTable}
                </div>
                {details_modal}
                <br/><br/>
                <Button href="/customer/home">Home</Button>
                </center>
            </div>
        )
    }
}



export default CustomerOrders;
