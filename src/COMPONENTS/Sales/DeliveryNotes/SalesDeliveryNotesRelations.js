import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesDeliveryNotesRelations extends Component {
    constructor({ noteId, getSalesDeliveryNotesRelations }) {
        super();

        this.noteId = noteId;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.getSalesDeliveryNotesRelations(this.noteId).then((relations) => {
            console.log(relations)
            ReactDOM.render(relations.orders.map((element, i) => {
                return <SalesInvoiceRelationsOrder key={i}
                    order={element}
                />
            }), this.refs.renderOrders);
            ReactDOM.render(relations.shippings.map((element, i) => {
                return <SalesInvoiceRelationsShipping key={i}
                    shipping={element}
                />
            }), this.refs.renderShipping);
        });
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row">
                <div class="col">
                    <h4>Orders</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Total</th>
                            </tr>
                        </thead>
                        <tbody ref="renderOrders"></tbody>
                    </table>
                </div>
                <div class="col">
                    <h4>Shipping</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Carrier</th>
                            </tr>
                        </thead>
                        <tbody ref="renderShipping"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class SalesInvoiceRelationsOrder extends Component {
    constructor({ order }) {
        super();

        this.order = order;
    }

    render() {
        return <tr>
            <th scope="row">{this.order.id}</th>
            <td>{window.dateFormat(new Date(this.order.dateCreated))}</td>
            <td>{this.order.totalAmount}</td>
        </tr>
    }
}

class SalesInvoiceRelationsShipping extends Component {
    constructor({ shipping }) {
        super();

        this.shipping = shipping;
    }

    render() {
        return <tr>
            <th scope="row">{this.shipping.id}</th>
            <td>{window.dateFormat(new Date(this.shipping.dateCreated))}</td>
            <td>{this.shipping.carrierName}</td>
        </tr>
    }
}

export default SalesDeliveryNotesRelations;
