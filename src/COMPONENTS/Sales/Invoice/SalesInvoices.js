import { Component } from "react";
import ReactDOM from 'react-dom';
import SalesInvoiceForm from "./SalesInvoiceForm";
import SearchField from "../../SearchField";

class SalesInvoices extends Component {
    constructor({ getSalesInvoices, getSalesInvoicesRow, searchSalesInvoices, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod,
        findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, getNameAddress,
        findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice,
        deleteSalesInvoice, getSalesInvoiceRelations, documentFunctions, getCustomerRow, sendEmail }) {
        super();

        this.getSalesInvoices = getSalesInvoices;
        this.getSalesInvoicesRow = getSalesInvoicesRow;
        this.searchSalesInvoices = searchSalesInvoices;

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
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;

        this.advancedSearchListener = null;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getSalesInvoices().then((invoices) => {
            this.renderInvoices(invoices);
        });
    }

    async search(searchText) {
        const search = {
            search: searchText
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
        }
        const invoices = await this.searchSalesInvoices(search);
        this.renderInvoices(invoices);
    }

    async renderInvoices(invoices) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
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

                findPaymentMethodByName={this.findPaymentMethodByName}
                getNamePaymentMethod={this.getNamePaymentMethod}
                findCurrencyByName={this.findCurrencyByName}
                getNameCurrency={this.getNameCurrency}
                findBillingSerieByName={this.findBillingSerieByName}
                getNameBillingSerie={this.getNameBillingSerie}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesInvoices={this.tabSalesInvoices}
                getSalesInvoicesRow={this.getSalesInvoicesRow}

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
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <SaleInvoiceAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>Sales Invoices</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
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

class SaleInvoiceAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        if (this.refs.start.value !== "") {
            search.dateStart = new Date(this.refs.start.value);
        }
        if (this.refs.end.value !== "") {
            search.dateEnd = new Date(this.refs.end.value);
        }
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <label for="start">Start date:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">End date:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default SalesInvoices;
