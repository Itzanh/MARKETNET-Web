import { Component } from "react";
import ReactDOM from 'react-dom';
import SalesInvoiceForm from "./SalesInvoiceForm";
import SearchField from "../../SearchField";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

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
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

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
        var totalProducts = 0;
        var totalAmount = 0;
        await ReactDOM.render(invoices.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);
            totalProducts += element.totalProducts;
            totalAmount += element.totalAmount;
            element.customerName = "...";
            return <SalesInvoice key={i}
                invoice={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = invoices.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;

        for (let i = 0; i < invoices.length; i++) {
            invoices[i].customerName = await this.getCustomerName(invoices[i].customer);
        }

        ReactDOM.render(invoices.map((element, i) => {
            return <SalesInvoice key={i}
                invoice={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.list = invoices;
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
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderInvoices(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="invoiceName" scope="col">Invoice no.</th>
                        <th field="customerName" scope="col">Customer</th>
                        <th field="dateCreated" scope="col">Date</th>
                        <th field="totalProducts" scope="col">Total products</th>
                        <th field="totalAmount" scope="col">Total amount</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderInvoices(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "invoiceName", "customerName", "dateCreated", "totalProducts", "totalAmount"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
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
        </div>
    }
}

class SalesInvoice extends Component {
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
            <td field="customerName">{this.invoice.customerName}</td>
            <td field="dateCreated">{window.dateFormat(this.invoice.dateCreated)}</td>
            <td field="totalProducts">{this.invoice.totalProducts}</td>
            <td field="totalAmount">{this.invoice.totalAmount}</td>
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
