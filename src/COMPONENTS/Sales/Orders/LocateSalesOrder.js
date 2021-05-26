import { Component } from "react";
import ReactDOM from 'react-dom';

class LocateSalesOrder extends Component {
    constructor({ locateSaleOrder, handleSelect }) {
        super();

        this.locateSaleOrder = locateSaleOrder;
        this.handleSelect = handleSelect;

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        window.$('#saleOrderModal').modal({ show: true });

        this.locateSaleOrder().then((orders) => {
            console.log(orders)
            ReactDOM.render(orders.map((element, i) => {
                return <SalesOrder key={i}
                    order={element}
                    select={this.select}
                />
            }), this.refs.render);
        });
    }

    select(order) {
        window.$('#saleOrderModal').modal('hide');
        this.handleSelect(order.id, order.orderName);
    }

    render() {
        return <div class="modal fade" id="saleOrderModal" tabindex="-1" role="dialog" aria-labelledby="saleOrderModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="saleOrderModalLabel">Locate Sale Order</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Order name</th>
                                    <th scope="col">Date created</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    }
}

class SalesOrder extends Component {
    constructor({ order, select }) {
        super();

        this.order = order;
        this.select = select;
    }

    render() {
        return <tr onClick={() => {
            this.select(this.order);
        }}>
            <th scope="row">{this.order.id}</th>
            <td>{this.order.customerName}</td>
            <td>{this.order.orderName}</td>
            <td>{window.dateFormat(new Date(this.order.dateCreated))}</td>
        </tr>
    }
}

export default LocateSalesOrder;
