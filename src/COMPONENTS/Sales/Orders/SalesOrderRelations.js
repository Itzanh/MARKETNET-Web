import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesOrderRelations extends Component {
    constructor({ orderId, getSalesOrderRelations }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderRelations = getSalesOrderRelations;
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getSalesOrderRelations(this.orderId).then((relations) => {
            console.log(relations)
            ReactDOM.render(relations.invoices.map((element, i) => {
                return <SalesOrderRelationsInvoice key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.renderInvcoices);

            ReactDOM.render(relations.manufacturingOrders.map((element, i) => {
                return <SalesOrderRelationsManufacturingOrder key={i}
                    manufacturingOrder={element}
                    edit={this.edit}
                />
            }), this.refs.renderManufacturingOrders);

            ReactDOM.render(relations.deliveryNotes.map((element, i) => {
                return <SalesOrderRelationsDeliveryNote key={i}
                    note={element}
                    edit={this.edit}
                />
            }), this.refs.renderDeliveryNotes);
        });
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <h4>Invoices</h4>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody ref="renderInvcoices"></tbody>
                </table>
            </div>
            <div class="col">
                <h4>Delivery notes</h4>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody ref="renderDeliveryNotes"></tbody>
                </table>
            </div>
            <div class="col">
                <h4>Manufacturing orders</h4>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Done</th>
                        </tr>
                    </thead>
                    <tbody ref="renderManufacturingOrders"></tbody>
                </table>
            </div>
            <div class="col">
                <h4>Shippings</h4>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Carrier</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    }
}

class SalesOrderRelationsInvoice extends Component {
    constructor({ invoice }) {
        super();

        this.invoice = invoice;
    }

    render() {
        return <tr>
            <th scope="row">{this.invoice.id}</th>
            <td>{window.dateFormat(new Date(this.invoice.dateCreated))}</td>
            <td>{this.invoice.totalAmount}</td>
        </tr>
    }
}

class SalesOrderRelationsManufacturingOrder extends Component {
    constructor({ manufacturingOrder }) {
        super();

        this.manufacturingOrder = manufacturingOrder;
    }

    render() {
        return <tr>
            <th scope="row">{this.manufacturingOrder.id}</th>
            <td>{window.dateFormat(new Date(this.manufacturingOrder.dateCreated))}</td>
            <td>{this.manufacturingOrder.manufactured ? 'Yes' : 'No'}</td>
        </tr>
    }
}

class SalesOrderRelationsDeliveryNote extends Component {
    constructor({ note }) {
        super();

        this.note = note;
    }

    render() {
        return <tr>
            <th scope="row">{this.note.id}</th>
            <td>{window.dateFormat(new Date(this.note.dateCreated))}</td>
            <td>{this.note.totalAmount}</td>
        </tr>
    }
}

export default SalesOrderRelations;
