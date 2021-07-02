import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesInvoiceRelations extends Component {
    constructor({ invoiceId, getSalesInvoiceRelations }) {
        super();

        this.invoiceId = invoiceId;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getSalesInvoiceRelations(this.invoiceId).then((relations) => {
            ReactDOM.render(relations.orders.map((element, i) => {
                return <SalesInvoiceRelationsOrder key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.renderOrders);

            ReactDOM.render(relations.notes.map((element, i) => {
                return <SalesInvoiceRelationsNote key={i}
                    note={element}
                    edit={this.edit}
                />
            }), this.refs.renderNotes);
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
                    <h4>Delivery notes</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Total</th>
                            </tr>
                        </thead>
                        <tbody ref="renderNotes"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class SalesInvoiceRelationsOrder extends Component {
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

class SalesInvoiceRelationsNote extends Component {
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

export default SalesInvoiceRelations;
