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
        deleteSalesInvoice, getSalesInvoiceRelations, documentFunctions, getCustomerRow, sendEmail, locateProduct, locateCustomers,
        toggleSimplifiedInvoiceSalesInvoice, makeAmendingSaleInvoice, locateCurrency, locatePaymentMethods, locateBillingSeries, invoiceDeletePolicy,
        getRegisterTransactionalLogs, getAddressesFunctions, getCustomersFunctions, getSalesOrdersFunctions, getSalesDeliveryNotesFunctions,
        getAccountingMovementsFunction, getProductFunctions, getSalesInvoicesFuntions }) {
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
        this.toggleSimplifiedInvoiceSalesInvoice = toggleSimplifiedInvoiceSalesInvoice;
        this.makeAmendingSaleInvoice = makeAmendingSaleInvoice;

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
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.invoiceDeletePolicy = invoiceDeletePolicy;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getCustomersFunctions = getCustomersFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getSalesDeliveryNotesFunctions = getSalesDeliveryNotesFunctions;
        this.getAccountingMovementsFunction = getAccountingMovementsFunction;
        this.getProductFunctions = getProductFunctions;
        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;

        this.advancedSearchListener = null;
        this.list = [];
        this.sortField = "";
        this.sortAscending = true;
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.offset = 0;
        this.limit = 100;

        const savedSearch = window.getSavedSearches("saleInvoices");
        // initialize the datagrid
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            this.offset = savedSearch.offset;
            this.limit = savedSearch.limit;
        }

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        const savedSearch = window.getSavedSearches("saleInvoices");

        // the user goes back to the second, third, etc. page
        var offset = this.offset;
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            offset = savedSearch.offset;
        }
        if (offset > 0) {
            this.limit = this.offset + this.limit;
            this.offset = 0;
        }

        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getSalesInvoices({
                offset: this.offset,
                limit: this.limit
            }).then((invoices) => {
                this.renderInvoices(invoices);
                if (savedSearch != null && savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        }

        // the user goes back to the second, third, etc. page
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            this.offset = savedSearch.offset;
            this.limit = savedSearch.limit;
        }
    }

    search(searchText) {
        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("saleInvoices");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("saleInvoices", savedSearch);

            this.loading = true;
            this.searchText = searchText;
            const search = {
                search: searchText,
                offset: this.offset,
                limit: this.limit
            };

            if (this.advancedSearchListener != null) {
                const s = this.advancedSearchListener();
                search.dateStart = s.dateStart;
                search.dateEnd = s.dateEnd;
            }
            const invoices = await this.searchSalesInvoices(search);
            this.renderInvoices(invoices);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("saleInvoices");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        savedSearch.offset = this.offset;
        savedSearch.limit = this.limit;
        window.addSavedSearches("saleInvoices", savedSearch);
    }

    renderInvoices(invoices) {
        this.loading = false;
        if (this.offset > 0) {
            this.list = this.list.concat(invoices.invoices);
        } else {
            this.list = invoices.invoices;
        }
        this.rows = invoices.rows;
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
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                invoiceDeletePolicy={this.invoiceDeletePolicy}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
                getAccountingMovementsFunction={this.getAccountingMovementsFunction}
                getProductFunctions={this.getProductFunctions}
                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
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
                toggleSimplifiedInvoiceSalesInvoice={this.toggleSimplifiedInvoiceSalesInvoice}
                makeAmendingSaleInvoice={this.makeAmendingSaleInvoice}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                invoiceDeletePolicy={this.invoiceDeletePolicy}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
                getAccountingMovementsFunction={this.getAccountingMovementsFunction}
                getProductFunctions={this.getProductFunctions}
                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
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
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["saleInvoices"] != null ? window.savedSearches["saleInvoices"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
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
                loading={this.loading}
                page={this.offset / this.limit}
                pageSize={this.limit}
                onPageChange={(data) => {
                    this.offset = data.pageSize * data.page;
                    this.limit = data.pageSize;
                    this.search(this.searchText);
                }}
                rowCount={this.rows}
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
