import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import SalesInvoiceForm from "./SalesInvoiceForm";
import SearchField from "../../SearchField";
import { DataGrid } from '@material-ui/data-grid';

class SalesInvoices extends Component {
    constructor({ getSalesInvoices, getSalesInvoicesRow, searchSalesInvoices, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod,
        findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, getNameAddress,
        findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice,
        deleteSalesInvoice, getSalesInvoiceRelations, documentFunctions, getCustomerRow, sendEmail, locateProduct, locateCustomers }) {
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
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;

        this.advancedSearchListener = null;
        this.list = [];
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
        this.list = invoices;
        this.forceUpdate();
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
                locateCustomers={this.locateCustomers}
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
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
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
            <h1>{i18next.t('sales-invoices')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 175 },
                    { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
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
                <label for="start">{i18next.t('start-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">{i18next.t('end-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default SalesInvoices;
