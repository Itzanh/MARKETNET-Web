import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class AccountingMovementSaleInvoices extends Component {
    constructor({ movementId, getAccountingMovementSaleInvoices }) {
        super();

        this.movementId = movementId;
        this.getAccountingMovementSaleInvoices = getAccountingMovementSaleInvoices;
    }

    componentDidMount() {
        this.getAccountingMovementSaleInvoices(this.movementId).then((invoices) => {
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

            return <SalesInvoice key={i}
                invoice={element}
            />
        }), this.refs.render);
        this.refs.rows.innerText = invoices.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('invoice-no')}</th>
                    <th scope="col">{i18next.t('customer')}</th>
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

class SalesInvoice extends Component {
    constructor({ invoice }) {
        super();

        this.invoice = invoice;
    }

    render() {
        return <tr>
            <th scope="row">{this.invoice.id}</th>
            <td>{this.invoice.invoiceName}</td>
            <td>{this.invoice.customerName}</td>
            <td>{window.dateFormat(this.invoice.dateCreated)}</td>
            <td>{this.invoice.totalProducts}</td>
            <td>{this.invoice.totalAmount}</td>
        </tr>
    }
}

export default AccountingMovementSaleInvoices;
