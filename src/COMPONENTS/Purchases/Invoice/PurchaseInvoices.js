/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import './../../../CSS/purchase_invoice.css';

import PurchaseInvoiceForm from "./PurchaseInvoiceForm";
import SearchField from "../../SearchField";
import CustomPagination from "../../VisualComponents/CustomPagination";



class PurchaseInvoices extends Component {
    constructor({ getPurchaseInvoices, searchPurchaseInvoices, findSupplierByName, findPaymentMethodByName, findCurrencyByName, findBillingSerieByName,
        getSupplierDefaults, locateAddress, tabPurcaseInvoices, findProductByName, getOrderDetailsDefaults, getPurchaseInvoiceDetails,
        addPurchaseInvoiceDetail, deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice, getPurchaseInvoiceRelations, documentFunctions,
        getPurchaseInvoiceRow, locateSuppliers, locateProduct, makeAmendingPurchaseInvoice, getSupplierRow, locateCurrency, locatePaymentMethods,
        locateBillingSeries, invoiceDeletePolicy, getRegisterTransactionalLogs, getSupplierFuntions, getAddressesFunctions, getPurchaseOrdersFunctions,
        getAccountingMovementsFunction, getProductFunctions, getPurcaseInvoicesFunctions }) {
        super();

        this.getPurchaseInvoices = getPurchaseInvoices;
        this.searchPurchaseInvoices = searchPurchaseInvoices;

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurcaseInvoices = tabPurcaseInvoices;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.addPurchaseInvoice = addPurchaseInvoice;
        this.deletePurchaseInvoice = deletePurchaseInvoice;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
        this.documentFunctions = documentFunctions;
        this.getPurchaseInvoiceRow = getPurchaseInvoiceRow;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.makeAmendingPurchaseInvoice = makeAmendingPurchaseInvoice;
        this.getSupplierRow = getSupplierRow;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.invoiceDeletePolicy = invoiceDeletePolicy;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getAccountingMovementsFunction = getAccountingMovementsFunction;
        this.getProductFunctions = getProductFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

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
        const savedSearch = window.getSavedSearches("purchaseInvoices");
        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getPurchaseInvoices().then(async (invoices) => {
                this.renderInvoices(invoices);
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
            var savedSearch = window.getSavedSearches("purchaseInvoices");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("purchaseInvoices", savedSearch);

            const search = {
                search: searchText
            };

            if (this.advancedSearchListener != null) {
                const s = this.advancedSearchListener();
                search.dateStart = s.dateStart;
                search.dateEnd = s.dateEnd;
                search.postedStatus = s.postedStatus;
                search.simplifiedInvoice = s.simplifiedInvoice;
                search.amending = s.amending;
                search.billingSeries = s.billingSeries;
            }
            const invoices = await this.searchPurchaseInvoices(search);
            this.renderInvoices(invoices);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("purchaseInvoices");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        window.addSavedSearches("purchaseInvoices", savedSearch);
    }

    renderInvoices(invoices) {
        this.list = invoices.invoices;
        this.footer = invoices.footer;
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

                getCustomerDefaults={this.getCustomerDefaults}

                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
                addPurchaseInvoiceDetail={this.addPurchaseInvoiceDetail}
                deletePurchaseInvoiceDetail={this.deletePurchaseInvoiceDetail}
                deletePurchaseInvoice={this.deletePurchaseInvoice}
                getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseInvoiceRow={this.getPurchaseInvoiceRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                invoiceDeletePolicy={this.invoiceDeletePolicy}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getAccountingMovementsFunction={this.getAccountingMovementsFunction}
                getProductFunctions={this.getProductFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(invoice) {

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseInvoiceForm
                invoice={invoice}

                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabPurcaseInvoices={this.tabPurcaseInvoices}
                makeAmendingPurchaseInvoice={this.makeAmendingPurchaseInvoice}

                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
                addPurchaseInvoiceDetail={this.addPurchaseInvoiceDetail}
                deletePurchaseInvoiceDetail={this.deletePurchaseInvoiceDetail}
                deletePurchaseInvoice={this.deletePurchaseInvoice}
                getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
                documentFunctions={this.documentFunctions}
                getPurchaseInvoiceRow={this.getPurchaseInvoiceRow}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSupplierRow={this.getSupplierRow}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                invoiceDeletePolicy={this.invoiceDeletePolicy}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getAccountingMovementsFunction={this.getAccountingMovementsFunction}
                getProductFunctions={this.getProductFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
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
                    locateBillingSeries={this.locateBillingSeries}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabPurchaseInvoices" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('purchase-invoices')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["purchaseInvoices"] != null
                            ? window.savedSearches["purchaseInvoices"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch" id="purchaseInvoiceAdvancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 175 },
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



class PurchaseInvoiceAdvancedSearch extends Component {
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
        search.postedStatus = this.refs.postedStatus.value;
        search.simplifiedInvoice = this.refs.simplifiedInvoice.value;
        search.amending = this.refs.amending.value;
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
                    <label>{i18next.t('posted')}</label>
                    <select class="form-control" ref="postedStatus">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="P">{i18next.t('posted')}</option>
                        <option value="N">{i18next.t('not-posted')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('simplified-invoice')}</label>
                    <select class="form-control" ref="simplifiedInvoice">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="S">{i18next.t('simplified')}</option>
                        <option value="F">{i18next.t('full')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('amending')}</label>
                    <select class="form-control" ref="amending">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="A">{i18next.t('amending')}</option>
                        <option value="R">{i18next.t('regular')}</option>
                    </select>
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



export default PurchaseInvoices;
