import React, { Component } from 'react';
import { Alert, Table, Button, Modal, Form} from "react-bootstrap";
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';

class RestaurantOrders extends Component {

    constructor(props) {
        super(props);
        this.setState({
            errorFlag : false,
            successFlag: false,
            rest_id : localStorage.getItem("restaurant_id"),
            update_success_order_id: ""
        });
        this.getRestaurantOrders();
    }

    getRestaurantOrders() {
        let rest_id = localStorage.getItem("restaurant_id");
        
    }

    clearSuccessMessage = (e) => {
        this.setState({
            updateSuccess: false,
            updateFailed: false,
        })
    }

    updateOrderStatus = (e) => {
        let order_id = e.target.name;
        const data = {
            status: e.target.value,
        };
        
    }

    showOrder = (e) => {
        console.log(e.target);
        this.setState({
            modal_order_id: e.target.name,
        })
    }

    dishView = (index, dish) => {
        return <tr>
                    <td>{index}</td>
                    <td>{dish.name}</td>
                    <td>{dish.quantity}</td>
                    <td>{dish.price * dish.quantity}</td>
                </tr>;
    }

    showCustomerDetails = (e) => {
        console.log(e.target);
        this.setState({
            modal_cust_id: e.target.name,
        })
    }

    handleDetailsModalClose = () => {
        this.setState({
            modal_order_id: "",
            modal_cust_id: ""
        })
    }


    getLocaleTime = (create_time) => {
        var ts = new Date(create_time);
        console.log("Timestamp:", ts.toLocaleString);
        return ts.toLocaleString();
    }

    convertStatus = (status) => {
        if (status === "NEW") {
            return "New Order";
        }
        return status;
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
        dataField: 'details',
        text: 'Order Details',
      }, {
        dataField: 'change_status',
        text: 'Update Status',
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
        let details_modal, modal_order, dish_details_in_modal = [], dish;
        let cust_details_modal, modal_customer, modal_customerImgSrc;
        let change_status;

        if(this.state && !this.state.orders) {
            message = <Alert varient ="warning">No Order History.</Alert>
        }

        if(this.state && this.state.errorFlag) {
            message = <Alert varient ="warning" style={{color:"red"}}>Restaurant Orders fetch failed.</Alert>
        }

        if(this.state && this.state.updateSuccess) {
            message = <Alert varient ='success' style={{color:"green"}}>Order status updated successfully.</Alert>
        }

        if(this.state && this.state.orders) {
            let bootStrapTableOrders = this.state.orders.map(o => { return {
                id: o.id,
                cust_name:<Button onClick={this.showCustomerDetails} name={o.cust_id}>{o.cust_name}</Button>,
                create_time: this.getLocaleTime(o.create_time),
                status: this.convertStatus(o.status),
                details: <Button onClick={this.showOrder} name={o.id}>Order Details</Button>,
                change_status: this.getStatusFormControl(o),

            }});

            bootstrapTable = <BootstrapTable 
                                keyField='id' 
                                data={bootStrapTableOrders} 
                                columns={this.columns}
                                filter={ filterFactory()} 
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

        if (this.state && this.state.modal_cust_id) {
            console.log("Modal Customer Id", this.state.modal_cust_id)
            modal_customer = this.state.orders.find(o => o.cust_id === parseInt(this.state.modal_cust_id, 10));
            console.log("Modal customer:", modal_customer);   

            cust_details_modal = <Modal
                                    show={true}
                                    backdrop="static"
                                    onHide={this.handleDetailsModalClose}
                                    keyboard={false}
                                    dialogClassName="modal-90w"
                                >
                                    <Modal.Header closeButton>
                                    <Modal.Title>Customer Profile</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Table striped bordered hover>
                                            <tbody>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>{modal_customer.cust_name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone</td>
                                                    <td>{modal_customer.cust_phone}</td>
                                                </tr>
                                                <tr>
                                                    <td>Email Id</td>
                                                    <td>{modal_customer.cust_email_id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Address</td>
                                                    <td>{modal_customer.cust_address}</td>
                                                </tr>
                                                <tr>
                                                    <td>Birth Date</td>
                                                    <td>{modal_customer.cust_dob}</td>
                                                </tr>
                                                <tr>
                                                    <td>About</td>
                                                    <td>{modal_customer.cust_about}</td>
                                                </tr>
                                                <tr>
                                                    <td>Yelping Since</td>
                                                    <td>{this.getLocaleTime(modal_customer.cust_join_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Blog</td>
                                                    <td>{modal_customer.cust_blog_url}</td>
                                                </tr>
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
                {details_modal}
                {cust_details_modal}
                {change_status}
                <center><Button href="/r_home">Home</Button></center>
            </div>
            );
    }

}

export default RestaurantOrders;