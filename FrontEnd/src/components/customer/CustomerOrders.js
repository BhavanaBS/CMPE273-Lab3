import React, { Component } from 'react';
import { Alert, Table, Button, Modal} from "react-bootstrap";
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import { getCustomerOrdersQuery } from "../../queries/queries";
import { graphql } from 'react-apollo';

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
        this.getCustomerOrders = this.getCustomerOrders.bind(this);
    }

    componentDidMount () {
        this.getCustomerOrders();
    }

    getCustomerOrders() {
        if (this.props.data && this.props.data.customerOrders && !this.state && !this.state.customerOrderHistory) {
            console.log("I got called");
             this.setState({ 
                customerOrderHistory: this.props.data.customerOrders,
            });
        }
    }

    onStatusSelection = (e) => {
        console.log("Event from dropdown", e.target.text);
        this.setState({
            deliveryMethod: e.target.eventKey,
        })
    }

    columns = [{
        dataField: 'restaurant_name',
        text: 'Restaurant Name'
      }, {
        dataField: 'create_time',
        text: 'Order Time'
      }, {
        dataField: 'status',
        text: 'Status',
        filter: textFilter()
      }, {
        dataField: 'delivery_method',
        text: 'Delivery Method'
      }, {
        dataField: 'dish_name',
        text: 'Dish Name'
      }, {
        dataField: 'quantity',
        text: 'Quantity'
      }];

    render () {

        let message, bootstrapTable;
        if(this.state && !this.state.customerOrderHistory) {
            message = <Alert varient ="warning">No Order History.</Alert>
        }

        if(!this.state || !this.state.customerOrderHistory){
            this.getCustomerOrders();
        }

        if (this.state && this.state.customerOrderHistory) {

            let bootStrapTableOrders = this.state.customerOrderHistory.map(o => { return {
                id: o.id,
                restaurant_name:o.restaurant_name,
                create_time: o.create_time,
                status: o.status,
                delivery_method: o.delivery_method,
                dish_name: o.dish_name,
                quantity: o.quantity
            }});

            bootstrapTable = <BootstrapTable 
                                keyField='id' 
                                data={bootStrapTableOrders} 
                                columns={this.columns}
                                filter={ filterFactory() }
                                >
                            </BootstrapTable>
            
        }

        // if (this.state && this.state.modal_order_id) {
        //     console.log("Modal OrderId", this.state.modal_order_id)
        //     modal_order = this.state.orders.find(o => o.id === parseInt(this.state.modal_order_id, 10));
        //     console.log("Modal Order:", modal_order);
        //     for (var i = 0; i < modal_order.dishes.length; i++) {
        //         if(modal_order.dishes[i]){    
        //             dish = this.dishView((i+1), modal_order.dishes[i]);
        //             dish_details_in_modal.push(dish);
        //         }
        //     }
            // details_modal = <Modal
            //                         show={true}
            //                         backdrop="static"
            //                         onHide={this.handleDetailsModalClose}
            //                         keyboard={false}
            //                         centered={true}
            //                     >
            //                         <Modal.Header closeButton>
            //                         <Modal.Title>Order Details</Modal.Title>
            //                         </Modal.Header>
            //                         <Modal.Body>
            //                             <Table striped bordered hover>
            //                                 <thead>
            //                                     <tr>
            //                                     <th>#</th>
            //                                     <th>Dish Name</th>
            //                                     <th>Quantity</th>
            //                                     <th>Price</th>
            //                                     </tr>
            //                                 </thead>
            //                                 <tbody>
            //                                     {dish_details_in_modal}
            //                                 </tbody>
            //                             </Table>
                                        
            //                         </Modal.Body>
            //                         <Modal.Footer>
            //                             <Button variant="secondary" onClick={this.handleDetailsModalClose}>
            //                                 Close
            //                             </Button>
            //                         </Modal.Footer>
            //                     </Modal>

        // }

        return(
            <div>
            <center>
                <br/><br/>
                <h2>Your Order History</h2>
                <br/>
                
                {message}
                <br/>
                <div style={{marginLeft:"10rem", marginRight:"10rem"}}>
                {bootstrapTable}
                </div>
                <br/><br/>
                <Button href="/c_home">Home</Button>
                </center>
            </div>
        )
    }
}



export default graphql (getCustomerOrdersQuery, {
    name: "data",
    options: { variables: { customer_id: localStorage.getItem("customer_id")  }
    }
}) (CustomerOrders);
