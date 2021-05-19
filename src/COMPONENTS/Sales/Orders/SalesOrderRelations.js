import { Component } from "react";
import ReactDOM from 'react-dom';

class SalesOrderRelations extends Component {
    constructor({ orderId,getSalesOrderRelations }) {
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
            }), this.refs.render);
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
                    <tbody ref="render"></tbody>
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
                    <tbody></tbody>
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
                    <tbody></tbody>
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

export default SalesOrderRelations;
