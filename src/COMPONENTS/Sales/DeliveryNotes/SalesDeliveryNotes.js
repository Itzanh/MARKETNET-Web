import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import SalesDeliveryNotesForm from "./SalesDeliveryNotesForm";
import SearchField from "../../SearchField";
import CustomPagination from "../../VisualComponents/CustomPagination";



class SalesDeliveryNotes extends Component {
    constructor({ getSalesDeliveryNotes, searchSalesDeliveryNotes, addSalesDeliveryNotes, deleteSalesDeliveryNotes, findCustomerByName,
        findPaymentMethodByName, findCurrencyByName, findBillingSerieByName, getCustomerDefaults,
        locateAddress, tabSalesDeliveryNotes, getSalesDeliveryNoteDetails, findProductByName, addWarehouseMovements,
        deleteWarehouseMovements, getSalesDeliveryNotesRelations, documentFunctions, getCustomerRow, sendEmail, getSalesDeliveryNoteRow, locateProduct,
        locateCustomers, locateCurrency, locatePaymentMethods, locateBillingSeries, getRegisterTransactionalLogs, getWarehouses, getAddressesFunctions,
        getCustomersFunctions, getSalesOrdersFunctions, getProductFunctions, getShippingFunctions }) {
        super();

        this.getSalesDeliveryNotes = getSalesDeliveryNotes;
        this.searchSalesDeliveryNotes = searchSalesDeliveryNotes;
        this.addSalesDeliveryNotes = addSalesDeliveryNotes;
        this.deleteSalesDeliveryNotes = deleteSalesDeliveryNotes;

        this.findCustomerByName = findCustomerByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesDeliveryNotes = tabSalesDeliveryNotes;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.getSalesDeliveryNoteRow = getSalesDeliveryNoteRow;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;

        this.getCustomersFunctions = getCustomersFunctions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getProductFunctions = getProductFunctions;
        this.getShippingFunctions = getShippingFunctions;

        this.advancedSearchListener = null;
        this.list = [];
        this.sortField = "";
        this.sortAscending = true;
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.offset = 0;
        this.limit = 100;
        this.footer = { totalProducts: 0, totalAmount: 0 };

        const savedSearch = window.getSavedSearches("saleDeliveryNotes");
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
        const savedSearch = window.getSavedSearches("saleDeliveryNotes");

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
            this.getSalesDeliveryNotes({
                offset: this.offset,
                limit: this.limit
            }).then(async (notes) => {
                this.renderDeliveryNotes(notes);
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

    async search(searchText) {
        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("saleDeliveryNotes");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("saleDeliveryNotes", savedSearch);

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
            const notes = await this.searchSalesDeliveryNotes(search);
            this.renderDeliveryNotes(notes);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("saleDeliveryNotes");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        savedSearch.offset = this.offset;
        savedSearch.limit = this.limit;
        window.addSavedSearches("saleDeliveryNotes", savedSearch);
    }

    renderDeliveryNotes(notes) {
        this.loading = false;
        if (this.offset > 0) {
            this.list = this.list.concat(notes.notes);
        } else {
            this.list = notes.notes;
        }
        this.rows = notes.rows;
        this.footer = notes.footer;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                addSalesDeliveryNotes={this.addSalesDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}

                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                findWarehouseByName={this.findWarehouseByName}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}

                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                getSalesDeliveryNoteRow={this.getSalesDeliveryNoteRow}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getProductFunctions={this.getProductFunctions}
                getShippingFunctions={this.getShippingFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                note={note}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                getSalesDeliveryNoteRow={this.getSalesDeliveryNoteRow}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getProductFunctions={this.getProductFunctions}
                getShippingFunctions={this.getShippingFunctions}

            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <SaleDeliveryNoteAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('sales-delivery-notes')}</h4>
            <div class="form-row">
                <div class="col">
                    {window.getPermission("CANT_MANUALLY_CREATE_SALE_DELIVERY_NOTE") ? null :
                        <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>}
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["saleDeliveryNotes"] != null ? window.savedSearches["saleDeliveryNotes"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'deliveryNoteName', headerName: i18next.t('delivery-note-no'), width: 200 },
                    {
                        field: 'customerName', headerName: i18next.t('customer'), flex: 1, valueGetter: (params) => {
                            return params.row.customer.name;
                        }
                    },
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
                    this.offset = data * this.limit;
                    this.search(this.searchText);
                }}
                rowCount={this.rows}
                components={{
                    Pagination: () => <CustomPagination footer={<div>
                        <p>Total products: {this.footer.totalProducts}€</p>
                        <p>Total amount: {this.footer.totalAmount}€</p>
                    </div>} />,
                }}
            />
        </div>
    }
}



class SaleDeliveryNoteAdvancedSearch extends Component {
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



export default SalesDeliveryNotes;
