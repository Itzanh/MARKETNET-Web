import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import PurchaseDeliveryNotesForm from "./PurchaseDeliveryNotesForm";
import SearchField from "../../SearchField";

class PurchaseDeliveryNotes extends Component {
    constructor({ getPurchaseDeliveryNotes, searchPurchaseDeliveryNotes, addPurchaseDeliveryNotes, deletePurchaseDeliveryNotes, findSupplierByName,
        getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie,
        getSupplierDefaults, locateAddress, tabPurchaseDeliveryNotes, getNameAddress, getPurchaseDeliveryNoteDetails, findProductByName, getNameProduct,
        addWarehouseMovements, deleteWarehouseMovements, getPurchaseDeliveryNotesRelations, findWarehouseByName, getNameWarehouse, documentFunctions,
        getPurchaseDeliveryNoteRow, locateSuppliers, locateProduct, getSupplierRow, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getSupplierFuntions, getAddressesFunctions, getPurchaseOrdersFunctions, getProductFunctions }) {
        super();

        this.getPurchaseDeliveryNotes = getPurchaseDeliveryNotes;
        this.searchPurchaseDeliveryNotes = searchPurchaseDeliveryNotes;
        this.addPurchaseDeliveryNotes = addPurchaseDeliveryNotes;
        this.deletePurchaseDeliveryNotes = deletePurchaseDeliveryNotes;

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
        this.tabPurchaseDeliveryNotes = tabPurchaseDeliveryNotes;
        this.getNameAddress = getNameAddress;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.documentFunctions = documentFunctions;
        this.getPurchaseDeliveryNoteRow = getPurchaseDeliveryNoteRow;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSupplierRow = getSupplierRow;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getProductFunctions = getProductFunctions;

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
        const savedSearch = window.getSavedSearches("purchaseDeliveryNote");
        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getPurchaseDeliveryNotes().then((notes) => {
                this.renderPurchaseDeliveryNotes(notes);
                if (savedSearch != null && savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        }
    }

    async search(searchText) {
        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("purchaseDeliveryNote");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("purchaseDeliveryNote", savedSearch);

            const search = {
                search: searchText
            };

            if (this.advancedSearchListener != null) {
                const s = this.advancedSearchListener();
                search.dateStart = s.dateStart;
                search.dateEnd = s.dateEnd;
            }
            const notes = await this.searchPurchaseDeliveryNotes(search);
            this.renderPurchaseDeliveryNotes(notes);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("purchaseDeliveryNote");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        window.addSavedSearches("purchaseDeliveryNote", savedSearch);
    }

    renderPurchaseDeliveryNotes(notes) {
        this.list = notes;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseDeliveryNotesForm
                addPurchaseDeliveryNotes={this.addPurchaseDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}

                findSupplierByName={this.findSupplierByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getSupplierDefaults={this.getSupplierDefaults}
                locateAddress={this.locateAddress}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                findWarehouseByName={this.findWarehouseByName}
                locateSuppliers={this.locateSuppliers}

                deletePurchaseDeliveryNotes={this.deletePurchaseDeliveryNotes}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getPurchaseDeliveryNoteRow={this.getPurchaseDeliveryNoteRow}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getProductFunctions={this.getProductFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        const defaultValueNameSupplier = await this.getSupplierName(note.supplier);
        const defaultValueNamePaymentMethod = await this.getNamePaymentMethod(note.paymentMethod);
        const defaultValueNameCurrency = await this.getNameCurrency(note.currency);
        const defaultValueNameBillingSerie = await this.getNameBillingSerie(note.billingSeries);
        const defaultValueNameShippingAddress = await this.getNameAddress(note.shippingAddress);
        const defaultValueNameWarehouse = await this.getNameWarehouse(note.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseDeliveryNotesForm
                note={note}
                deletePurchaseDeliveryNotes={this.deletePurchaseDeliveryNotes}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getPurchaseDeliveryNoteRow={this.getPurchaseDeliveryNoteRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getProductFunctions={this.getProductFunctions}

                defaultValueNameSupplier={defaultValueNameSupplier}
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
                <PurchaseDeliveryNoteAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>{i18next.t('purchase-delivery-notes')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["purchaseDeliveryNote"] != null ? window.savedSearches["purchaseDeliveryNote"].search : ""} />
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

class PurchaseDeliveryNoteAdvancedSearch extends Component {
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

export default PurchaseDeliveryNotes;
