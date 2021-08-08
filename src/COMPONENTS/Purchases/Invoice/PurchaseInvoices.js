import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import PurchaseInvoiceForm from "./PurchaseInvoiceForm";
import SearchField from "../../SearchField";

class PurchaseInvoices extends Component {
    constructor({ getPurchaseInvoices, searchPurchaseInvoices, findSupplierByName, getSupplierName, findPaymentMethodByName, getNamePaymentMethod,
        findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurcaseInvoices,
        getNameAddress, findProductByName, getOrderDetailsDefaults, getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, getNameProduct,
        deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice, getPurchaseInvoiceRelations, documentFunctions, getPurchaseInvoiceRow,
        locateSuppliers, locateProduct }) {
        super();

        this.getPurchaseInvoices = getPurchaseInvoices;
        this.searchPurchaseInvoices = searchPurchaseInvoices;

        this.findSupplierByName = findSupplierByName;
        this.getSupplierName = getSupplierName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurcaseInvoices = tabPurcaseInvoices;
        this.getNameAddress = getNameAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.addPurchaseInvoice = addPurchaseInvoice;
        this.deletePurchaseInvoice = deletePurchaseInvoice;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
        this.documentFunctions = documentFunctions;
        this.getPurchaseInvoiceRow = getPurchaseInvoiceRow;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;

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
        this.getPurchaseInvoices().then(async (invoices) => {
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
        const invoices = await this.searchPurchaseInvoices(search);
        this.renderInvoices(invoices);
    }

    async renderInvoices(invoices) {
        this.list = invoices;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseInvoiceForm
                findSupplierByName={this.findSupplierByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getSupplierDefaults={this.getSupplierDefaults}
                locateAddress={this.locateAddress}
                tabPurcaseInvoices={this.tabPurcaseInvoices}
                addPurchaseInvoice={this.addPurchaseInvoice}
                locateSuppliers={this.locateSuppliers}

                getNamePaymentMethod={this.getNamePaymentMethod}
                getNameCurrency={this.getNameCurrency}
                getNameBillingSerie={this.getNameBillingSerie}
                getCustomerDefaults={this.getCustomerDefaults}

                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
                addPurchaseInvoiceDetail={this.addPurchaseInvoiceDetail}
                getNameProduct={this.getNameProduct}
                deletePurchaseInvoiceDetail={this.deletePurchaseInvoiceDetail}
                deletePurchaseInvoice={this.deletePurchaseInvoice}
                getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseInvoiceRow={this.getPurchaseInvoiceRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
            />,
            document.getElementById('renderTab'));
    }

    async edit(invoice) {
        var defaultValueNameSupplier;
        if (invoice.supplier != null)
            defaultValueNameSupplier = await this.getSupplierName(invoice.supplier);
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
            <PurchaseInvoiceForm
                invoice={invoice}

                findPaymentMethodByName={this.findPaymentMethodByName}
                getNamePaymentMethod={this.getNamePaymentMethod}
                findCurrencyByName={this.findCurrencyByName}
                getNameCurrency={this.getNameCurrency}
                findBillingSerieByName={this.findBillingSerieByName}
                getNameBillingSerie={this.getNameBillingSerie}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabPurcaseInvoices={this.tabPurcaseInvoices}

                defaultValueNameSupplier={defaultValueNameSupplier}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
                addPurchaseInvoiceDetail={this.addPurchaseInvoiceDetail}
                getNameProduct={this.getNameProduct}
                deletePurchaseInvoiceDetail={this.deletePurchaseInvoiceDetail}
                deletePurchaseInvoice={this.deletePurchaseInvoice}
                getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseInvoiceRow={this.getPurchaseInvoiceRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <PurchaseInvoiceAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>{i18next.t('purchase-invoices')}</h1>
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
                    { field: 'supplierName', headerName: i18next.t('supplier'), flex: 1 },
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

class PurchaseInvoiceAdvancedSearch extends Component {
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

export default PurchaseInvoices;
