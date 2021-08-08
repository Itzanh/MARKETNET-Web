import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import SalesDeliveryNotesForm from "./SalesDeliveryNotesForm";
import SearchField from "../../SearchField";

class SalesDeliveryNotes extends Component {
    constructor({ getSalesDeliveryNotes, searchSalesDeliveryNotes, addSalesDeliveryNotes, deleteSalesDeliveryNotes, findCustomerByName, getCustomerName,
        findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults,
        locateAddress, tabSalesDeliveryNotes, getNameAddress, getSalesDeliveryNoteDetails, findProductByName, getNameProduct, addWarehouseMovements,
        deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, getNameWarehouse, documentFunctions, getCustomerRow, sendEmail,
        getSalesDeliveryNoteRow, locateProduct, locateCustomers }) {
        super();

        this.getSalesDeliveryNotes = getSalesDeliveryNotes;
        this.searchSalesDeliveryNotes = searchSalesDeliveryNotes;
        this.addSalesDeliveryNotes = addSalesDeliveryNotes;
        this.deleteSalesDeliveryNotes = deleteSalesDeliveryNotes;

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
        this.tabSalesDeliveryNotes = tabSalesDeliveryNotes;
        this.getNameAddress = getNameAddress;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.getSalesDeliveryNoteRow = getSalesDeliveryNoteRow;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;

        this.advancedSearchListener = null;
        this.list = [];
        this.sortField = "";
        this.sortAscending = true;
        this.loading = true;
        this.rows = 0;
        this.searchText = "";

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getSalesDeliveryNotes({
            offset: 0,
            limit: 100
        }).then(async (notes) => {
            this.renderDeliveryNotes(notes);
        });
    }

    async search(searchText) {
        this.loading = true;
        this.searchText = searchText;
        const search = {
            search: searchText,
            offset: 0,
            limit: 100
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
        }
        const notes = await this.searchSalesDeliveryNotes(search);
        this.renderDeliveryNotes(notes);
    }

    async renderDeliveryNotes(notes) {
        this.loading = false;
        this.list = notes.notes;
        this.rows = notes.rows;
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
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                getSalesDeliveryNoteRow={this.getSalesDeliveryNoteRow}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        const defaultValueNameCustomer = await this.getCustomerName(note.customer);
        const defaultValueNamePaymentMethod = await this.getNamePaymentMethod(note.paymentMethod);
        const defaultValueNameCurrency = await this.getNameCurrency(note.currency);
        const defaultValueNameBillingSerie = await this.getNameBillingSerie(note.billingSeries);
        const defaultValueNameShippingAddress = await this.getNameAddress(note.shippingAddress);
        const defaultValueNameWarehouse = await this.getNameWarehouse(note.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                note={note}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                getSalesDeliveryNoteRow={this.getSalesDeliveryNoteRow}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameWarehouse={defaultValueNameWarehouse}
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
            <h1>{i18next.t('sales-delivery-notes')}</h1>
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
                    { field: 'deliveryNoteName', headerName: i18next.t('delivery-note-no'), width: 200 },
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
                onPageChange={(data) => {
                    this.searchSalesDeliveryNotes({
                        search: this.searchText,
                        offset: data.pageSize * data.page,
                        limit: data.pageSize
                    }).then(async (notes) => {
                        notes.notes = this.list.concat(notes.notes);
                        this.renderDeliveryNotes(notes);
                    });
                }}
                rowCount={this.rows}
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
