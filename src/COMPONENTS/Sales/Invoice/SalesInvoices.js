import { Component } from "react";
import ReactDOM from 'react-dom';
import SalesInvoiceForm from "./SalesInvoiceForm";

class SalesInvoices extends Component {
    constructor({ getSalesInvoices, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, getNameAddress, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails,
        addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice, deleteSalesInvoice, getSalesInvoiceRelations }) {
        super();

        this.getSalesInvoices = getSalesInvoices;

        this.findCustomerByName = findCustomerByName;
        this.getCustomerName = getCustomerName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesInvoices = tabSalesInvoices;
        this.getNameAddress = getNameAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.addSalesInvoice = addSalesInvoice;
        this.deleteSalesInvoice = deleteSalesInvoice;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getSalesInvoices().then(async (invoices) => {
            await ReactDOM.render(invoices.map((element, i) => {
                element.customerName = "...";
                return <SalesInvoice key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < invoices.length; i++) {
                invoices[i].customerName = await this.getCustomerName(invoices[i].customer);
            }

            ReactDOM.render(invoices.map((element, i) => {
                return <SalesInvoice key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesInvoiceForm
                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesInvoices={this.tabSalesInvoices}
                addSalesInvoice={this.addSalesInvoice}
            />,
            document.getElementById('renderTab'));
    }

    async edit(invoice) {
        var defaultValueNameCustomer;
        if (invoice.customer != null)
            defaultValueNameCustomer = await this.getCustomerName(invoice.customer);
        var defaultValueNamePaymentMethod;
        if (invoice.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(invoice.paymentMethod);
        var defaultValueNameCurrency;
        if (invoice.currency != null)
            defaultValueNameCurrency = await this.getNameCurrency(invoice.currency);
        var defaultValueNameBillingSerie;
        if (invoice.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(invoice.billingSeries);
        var defaultValueNameBillingAddress;
        if (invoice.billingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(invoice.billingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesInvoiceForm
                invoice={invoice}

                findCustomerByName={this.findCustomerByName}
                getCustomerName={this.getCustomerName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                getNamePaymentMethod={this.getNamePaymentMethod}
                findCurrencyByName={this.findCurrencyByName}
                getNameCurrency={this.getNameCurrency}
                findBillingSerieByName={this.findBillingSerieByName}
                getNameBillingSerie={this.getNameBillingSerie}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesInvoices={this.tabSalesInvoices}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getSalesInvoiceDetails={this.getSalesInvoiceDetails}
                addSalesInvoiceDetail={this.addSalesInvoiceDetail}
                getNameProduct={this.getNameProduct}
                deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
                deleteSalesInvoice={this.deleteSalesInvoice}
                getSalesInvoiceRelations={this.getSalesInvoiceRelations}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSalesOrders">
            <h1>Sales Invoices</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Invoice no.</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total products</th>
                        <th scope="col">Total amount</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesInvoice extends Component {
    constructor({ invoice, edit }) {
        super();

        this.invoice = invoice;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.invoice);
        }}>
            <th scope="row">{this.invoice.id}</th>
            <td>{this.invoice.invoiceName}</td>
            <td>{this.invoice.customerName}</td>
            <td>{window.dateFormat(new Date(this.invoice.dateCreated))}</td>
            <td>{this.invoice.totalProducts}</td>
            <td>{this.invoice.totalAmount}</td>
        </tr>
    }
}

export default SalesInvoices;
