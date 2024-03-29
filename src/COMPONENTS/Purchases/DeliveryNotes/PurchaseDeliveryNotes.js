﻿/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import './../../../CSS/purchase_delivery_note.css';

import PurchaseDeliveryNotesForm from "./PurchaseDeliveryNotesForm";
import SearchField from "../../SearchField";
import CustomPagination from "../../VisualComponents/CustomPagination";



class PurchaseDeliveryNotes extends Component {
    constructor({ getPurchaseDeliveryNotes, searchPurchaseDeliveryNotes, addPurchaseDeliveryNotes, deletePurchaseDeliveryNotes, findSupplierByName,
        findPaymentMethodByName, findCurrencyByName, findBillingSerieByName, getSupplierDefaults, locateAddress, tabPurchaseDeliveryNotes,
        getPurchaseDeliveryNoteDetails, findProductByName, addWarehouseMovements, deleteWarehouseMovements, getPurchaseDeliveryNotesRelations,
        documentFunctions, getPurchaseDeliveryNoteRow, locateSuppliers, locateProduct, getSupplierRow, locateCurrency, locatePaymentMethods,
        locateBillingSeries, getRegisterTransactionalLogs, getWarehouses, getSupplierFuntions, getAddressesFunctions, getPurchaseOrdersFunctions,
        getProductFunctions }) {
        super();

        this.getPurchaseDeliveryNotes = getPurchaseDeliveryNotes;
        this.searchPurchaseDeliveryNotes = searchPurchaseDeliveryNotes;
        this.addPurchaseDeliveryNotes = addPurchaseDeliveryNotes;
        this.deletePurchaseDeliveryNotes = deletePurchaseDeliveryNotes;

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseDeliveryNotes = tabPurchaseDeliveryNotes;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
        this.documentFunctions = documentFunctions;
        this.getPurchaseDeliveryNoteRow = getPurchaseDeliveryNoteRow;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSupplierRow = getSupplierRow;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getProductFunctions = getProductFunctions;

        this.advancedSearchListener = null;
        this.list = [];
        this.sortField = "";
        this.sortAscending = true;
        this.footer = { totalProducts: 0, totalAmount: 0 };

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
                search.billingSeries = s.billingSeries;
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
        this.list = notes.notes;
        this.footer = notes.footer;
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
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseDeliveryNoteRow={this.getPurchaseDeliveryNoteRow}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getProductFunctions={this.getProductFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseDeliveryNotesForm
                note={note}
                deletePurchaseDeliveryNotes={this.deletePurchaseDeliveryNotes}
                tabPurchaseDeliveryNotes={this.tabPurchaseDeliveryNotes}
                getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseDeliveryNoteRow={this.getPurchaseDeliveryNoteRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getProductFunctions={this.getProductFunctions}

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
                    locateBillingSeries={this.locateBillingSeries}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabPurchaseDeliveryNotes" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('purchase-delivery-notes')}</h4>
            <div class="form-row">
                <div class="col">
                    {window.getPermission("CANT_MANUALLY_CREATE_PURCHASE_DELIVERY_NOTE") ? null :
                        <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>}
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["purchaseDeliveryNote"] != null ? window.savedSearches["purchaseDeliveryNote"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch" id="purchaseDeliveryNoteAdvancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'deliveryNoteName', headerName: i18next.t('delivery-note-no'), width: 200 },
                    {
                        field: 'supplierName', headerName: i18next.t('supplier'), flex: 1, valueGetter: (params) => {
                            return params.row.supplier.name;
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
                pageSize={100}
                rowCount={this.list.length}
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



class PurchaseDeliveryNoteAdvancedSearch extends Component {
    constructor({ subscribe, locateBillingSeries }) {
        super();

        this.locateBillingSeries = locateBillingSeries;

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    componentDidMount() {
        this.locateBillingSeries().then((series) => {
            const components = series.map((serie, i) => {
                return <option key={i + 1} value={serie.id}>{serie.name}</option>
            });
            components.unshift(<option key={0} value="">.{i18next.t('all')}</option>);
            ReactDOM.render(components, this.refs.billingSeries);
        });
    }

    getFormData() {
        const search = {};
        if (this.refs.start.value !== "") {
            search.dateStart = new Date(this.refs.start.value);
        }
        if (this.refs.end.value !== "") {
            search.dateEnd = new Date(this.refs.end.value);
        }
        search.billingSeries = this.refs.billingSeries.value;
        if (search.billingSeries == "") {
            search.billingSeries = null;
        }
        return search;
    }

    render() {
        return <div className="advancedSearchContent">
            <div class="form-row">
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
                <div class="col">
                    <label>{i18next.t('billing-series')}</label>
                    <select class="form-control" ref="billingSeries">

                    </select>
                </div>
            </div>
        </div>
    }
}



export default PurchaseDeliveryNotes;
