import { Component } from "react";
import ReactDOM from 'react-dom';

class PurchaseOrderRelations extends Component {
    constructor({ orderId, getPurchaseOrderRelations }) {
        super();

        this.orderId = orderId;
        this.getPurchaseOrderRelations = getPurchaseOrderRelations;
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getPurchaseOrderRelations(this.orderId).then((relations) => {
            ReactDOM.render(relations.invoices.map((element, i) => {
                return <PurchaseOrderRelationsInvoice key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.renderInvcoices);

            ReactDOM.render(relations.deliveryNotes.map((element, i) => {
                return <PurchaseOrderRelationsDeliveryNote key={i}
                    note={element}
                    edit={this.edit}
                />
            }), this.refs.renderDeliveryNotes);
        });
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row">
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
            </div>
        </div>
    }
}

class PurchaseOrderRelationsInvoice extends Component {
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

class PurchaseOrderRelationsDeliveryNote extends Component {
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

export default PurchaseOrderRelations;
