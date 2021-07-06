import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

            ReactDOM.render(relations.shippings.map((element, i) => {
                return <SalesOrderRelationsShippings key={i}
                    shipping={element}
                    edit={this.edit}
                />
            }), this.refs.renderShippings);
        });
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row">
                <div class="col">
                    <h4>{i18next.t('invoices')}</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{i18next.t('date')}</th>
                                <th scope="col">{i18next.t('total')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderInvcoices"></tbody>
                    </table>
                </div>
                <div class="col">
                    <h4>{i18next.t('delivery-notes')}</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{i18next.t('date')}</th>
                                <th scope="col">{i18next.t('total')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderDeliveryNotes"></tbody>
                    </table>
                </div>
                <div class="col">
                    <h4>{i18next.t('manufacturing-orders')}</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{i18next.t('date')}</th>
                                <th scope="col">{i18next.t('done')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderManufacturingOrders"></tbody>
                    </table>
                </div>
                <div class="col">
                    <h4>{i18next.t('shippings')}</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{i18next.t('date')}</th>
                                <th scope="col">{i18next.t('sent')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderShippings"></tbody>
                    </table>
                </div>
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
            <td>{this.manufacturingOrder.manufactured ? i18next.t('yes') : i18next.t('no')}</td>
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

class SalesOrderRelationsShippings extends Component {
    constructor({ shipping }) {
        super();

        this.shipping = shipping;
    }

    render() {
        return <tr>
            <th scope="row">{this.shipping.id}</th>
            <td>{window.dateFormat(new Date(this.shipping.dateCreated))}</td>
            <td>{this.shipping.sent ? i18next.t('yes') : i18next.t('no')}</td>
        </tr>
    }
}

export default SalesOrderRelations;
