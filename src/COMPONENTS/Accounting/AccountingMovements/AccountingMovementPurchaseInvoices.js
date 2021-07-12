import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class AccountingMovementPurchaseInvoices extends Component {
    constructor({ movementId, getAccountingMovementPurchaseInvoices }) {
        super();

        this.movementId = movementId;
        this.getAccountingMovementPurchaseInvoices = getAccountingMovementPurchaseInvoices;
    }

    componentDidMount() {
        this.getAccountingMovementPurchaseInvoices(this.movementId).then(async (invoices) => {
            this.renderInvoices(invoices);
        });
    }

    async renderInvoices(invoices) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        var totalProducts = 0;
        var totalAmount = 0;
        await ReactDOM.render(invoices.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);

            totalProducts += element.totalProducts;
            totalAmount += element.totalAmount;
            return <PurchaseInvoice key={i}
                invoice={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = invoices.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;

        this.list = invoices;
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('invoice-no')}</th>
                    <th scope="col">{i18next.t('supplier')}</th>
                    <th scope="col">{i18next.t('date')}</th>
                    <th scope="col">{i18next.t('total-products')}</th>
                    <th scope="col">{i18next.t('total-amount')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
            <tfoot>
                <tr>
                    <th ref="rows" scope="row">0</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td ref="totalProducts">0</td>
                    <td ref="totalAmount">0</td>
                </tr>
            </tfoot>
        </table>
    }
}

class PurchaseInvoice extends Component {
    constructor({ invoice, edit, pos }) {
        super();

        this.invoice = invoice;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.invoice);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.invoice.id}</th>
            <td field="invoiceName">{this.invoice.invoiceName}</td>
            <td field="supplierName">{this.invoice.supplierName}</td>
            <td field="dateCreated">{window.dateFormat(this.invoice.dateCreated)}</td>
            <td field="totalProducts">{this.invoice.totalProducts}</td>
            <td field="totalAmount">{this.invoice.totalAmount}</td>
        </tr>
    }
}

export default AccountingMovementPurchaseInvoices;
