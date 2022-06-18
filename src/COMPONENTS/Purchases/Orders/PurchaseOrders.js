import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import './../../../CSS/purchase_order.css';

import PurchaseOrderForm from './PurchaseOrderForm';
import SearchField from '../../SearchField';
import CustomPagination from '../../VisualComponents/CustomPagination';



class PurchaseOrders extends Component {
    constructor({ findSupplierByName, findPaymentMethodByName, findCurrencyByName, findBillingSerieByName, getSupplierDefaults, locateAddress,
        tabPurchaseOrders, addPurchaseOrder, getPurchaseOrder, searchPurchaseOrder, getOrderDetailsDefaults, findProductByName,
        getPurchaseOrderDetails, addPurchaseOrderDetail, updatePurchaseOrderDetail, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail,
        cancelPurchaseOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder,
        invoicePartiallyPurchaseOrder, getPurchaseOrderRelations, deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName,
        documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail, locateSuppliers, locateProduct, getSalesOrderDetailsFromPurchaseOrderDetail,
        locateCurrency, locatePaymentMethods, locateBillingSeries, getRegisterTransactionalLogs, getComplexManufacturingOrdersFromPurchaseOrderDetail,
        getSupplierFuntions, getAddressesFunctions, getPurcaseInvoicesFunctions, getPurchaseDeliveryNotesFunctions, getProductFunctions,
        getComplexManufacturingOrerFunctions }) {
        super();

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseOrders = tabPurchaseOrders;
        this.addPurchaseOrder = addPurchaseOrder;
        this.getPurchaseOrder = getPurchaseOrder;
        this.searchPurchaseOrder = searchPurchaseOrder;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.updatePurchaseOrder = updatePurchaseOrder;
        this.deletePurchaseOrder = deletePurchaseOrder;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.cancelPurchaseOrderDetail = cancelPurchaseOrderDetail;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
        this.invoiceAllPurchaseOrder = invoiceAllPurchaseOrder;
        this.invoicePartiallyPurchaseOrder = invoicePartiallyPurchaseOrder;
        this.getPurchaseOrderRelations = getPurchaseOrderRelations;
        this.deliveryNoteAllPurchaseOrder = deliveryNoteAllPurchaseOrder;
        this.deliveryNotePartiallyPurchaseOrder = deliveryNotePartiallyPurchaseOrder;
        this.findCarrierByName = findCarrierByName;
        this.documentFunctions = documentFunctions;
        this.getPurchaseOrderRow = getPurchaseOrderRow;
        this.getSupplierRow = getSupplierRow;
        this.sendEmail = sendEmail;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSalesOrderDetailsFromPurchaseOrderDetail = getSalesOrderDetailsFromPurchaseOrderDetail;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getComplexManufacturingOrdersFromPurchaseOrderDetail = getComplexManufacturingOrdersFromPurchaseOrderDetail;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;
        this.getPurchaseDeliveryNotesFunctions = getPurchaseDeliveryNotesFunctions;
        this.getProductFunctions = getProductFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;

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
        const savedSearch = window.getSavedSearches("purchaseOrders");
        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getPurchaseOrder().then((orders) => {
                this.renderOrders(orders);
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
            var savedSearch = window.getSavedSearches("purchaseOrders");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("purchaseOrders", savedSearch);

            const search = {
                search: searchText
            };

            if (this.advancedSearchListener != null) {
                const s = this.advancedSearchListener();
                search.dateStart = s.dateStart;
                search.dateEnd = s.dateEnd;
                search.invoicedStatus = s.invoicedStatus;
                search.deliveryNoteStatus = s.deliveryNoteStatus;
            }
            const orders = await this.searchPurchaseOrder(search);
            this.renderOrders(orders);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("purchaseOrders");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        window.addSavedSearches("purchaseOrders", savedSearch);
    }

    renderOrders(orders) {
        this.list = orders.orders;
        this.footer = orders.footer;
        this.forceUpdate();
    }

    async add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseOrderForm
                findSupplierByName={this.findSupplierByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getSupplierDefaults={this.getSupplierDefaults}
                locateAddress={this.locateAddress}
                tabPurchaseOrders={this.tabPurchaseOrders}
                addPurchaseOrder={this.addPurchaseOrder}
                findCarrierByName={this.findCarrierByName}
                locateSuppliers={this.locateSuppliers}

                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getPurchaseOrderDetails={this.getPurchaseOrderDetails}
                addPurchaseOrderDetail={this.addPurchaseOrderDetail}
                updatePurchaseOrderDetail={this.updatePurchaseOrderDetail}
                updatePurchaseOrder={this.updatePurchaseOrder}
                deletePurchaseOrder={this.deletePurchaseOrder}
                deletePurchaseOrderDetail={this.deletePurchaseOrderDetail}
                cancelPurchaseOrderDetail={this.cancelPurchaseOrderDetail}
                getSalesOrderDiscounts={this.getSalesOrderDiscounts}
                addSalesOrderDiscounts={this.addSalesOrderDiscounts}
                deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
                invoiceAllPurchaseOrder={this.invoiceAllPurchaseOrder}
                invoicePartiallyPurchaseOrder={this.invoicePartiallyPurchaseOrder}
                getPurchaseOrderRelations={this.getPurchaseOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllPurchaseOrder={this.deliveryNoteAllPurchaseOrder}
                deliveryNotePartiallyPurchaseOrder={this.deliveryNotePartiallyPurchaseOrder}
                findCarrierByName={this.findCarrierByName}
                documentFunctions={this.documentFunctions}
                getPurchaseOrderRow={this.getPurchaseOrderRow}
                getSupplierRow={this.getSupplierRow}
                sendEmail={this.sendEmail}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSalesOrderDetailsFromPurchaseOrderDetail={this.getSalesOrderDetailsFromPurchaseOrderDetail}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getComplexManufacturingOrdersFromPurchaseOrderDetail={this.getComplexManufacturingOrdersFromPurchaseOrderDetail}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
                getPurchaseDeliveryNotesFunctions={this.getPurchaseDeliveryNotesFunctions}
                getProductFunctions={this.getProductFunctions}
                getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(purchaseOrder) {

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PurchaseOrderForm
                order={purchaseOrder}

                findSupplierByName={this.findSupplierByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getSupplierDefaults={this.getSupplierDefaults}
                locateAddress={this.locateAddress}
                tabPurchaseOrders={this.tabPurchaseOrders}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getPurchaseOrderDetails={this.getPurchaseOrderDetails}
                addPurchaseOrderDetail={this.addPurchaseOrderDetail}
                updatePurchaseOrderDetail={this.updatePurchaseOrderDetail}
                updatePurchaseOrder={this.updatePurchaseOrder}
                deletePurchaseOrder={this.deletePurchaseOrder}
                deletePurchaseOrderDetail={this.deletePurchaseOrderDetail}
                cancelPurchaseOrderDetail={this.cancelPurchaseOrderDetail}
                getSalesOrderDiscounts={this.getSalesOrderDiscounts}
                addSalesOrderDiscounts={this.addSalesOrderDiscounts}
                deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
                invoiceAllPurchaseOrder={this.invoiceAllPurchaseOrder}
                invoicePartiallyPurchaseOrder={this.invoicePartiallyPurchaseOrder}
                getPurchaseOrderRelations={this.getPurchaseOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllPurchaseOrder={this.deliveryNoteAllPurchaseOrder}
                deliveryNotePartiallyPurchaseOrder={this.deliveryNotePartiallyPurchaseOrder}
                findCarrierByName={this.findCarrierByName}
                documentFunctions={this.documentFunctions}
                getPurchaseOrderRow={this.getPurchaseOrderRow}
                getSupplierRow={this.getSupplierRow}
                sendEmail={this.sendEmail}
                locateSuppliers={this.locateSuppliers}
                locateProduct={this.locateProduct}
                getSalesOrderDetailsFromPurchaseOrderDetail={this.getSalesOrderDetailsFromPurchaseOrderDetail}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getComplexManufacturingOrdersFromPurchaseOrderDetail={this.getComplexManufacturingOrdersFromPurchaseOrderDetail}

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
                getPurchaseDeliveryNotesFunctions={this.getPurchaseDeliveryNotesFunctions}
                getProductFunctions={this.getProductFunctions}
                getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
            />,
            document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <PurchaseOrderAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabPurchaseOrders" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('purchase-orders')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-1" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["purchaseOrders"] != null ? window.savedSearches["purchaseOrders"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch" id="purchaseOrderAdvancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                    { field: 'supplierReference', headerName: i18next.t('supplier-reference'), width: 240 },
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
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 },
                    {
                        field: '', headerName: i18next.t('invoice') + "/" + i18next.t('delivery-note'), width: 250,
                        valueGetter: (params) => {
                            if (params.row.linesNumber == 0) {
                                return "";
                            }
                            return (params.row.invoicedLines === 0 ? i18next.t('not-invoiced') :
                                (params.row.invoicedLines === params.row.linesNumber
                                    ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                                + "/" +
                                i18next.t(params.row.deliveryNoteLines === 0 ? i18next.t('no-delivery-note') :
                                    (params.row.deliveryNoteLines === params.row.linesNumber ?
                                        i18next.t('delivery-note-generated') : i18next.t('partially-delivered')))
                        }
                    }
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



class PurchaseOrderAdvancedSearch extends Component {
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
        search.invoicedStatus = this.refs.invoicedStatus.value;
        search.deliveryNoteStatus = this.refs.deliveryNoteStatus.value;
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
                    <label>{i18next.t('invoice-status')}</label>
                    <select class="form-control" ref="invoicedStatus">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="A">{i18next.t('invoiced')}</option>
                        <option value="B">{i18next.t('not-invoiced')}</option>
                        <option value="C">{i18next.t('partially-invoiced')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('delivery-status')}</label>
                    <select class="form-control" ref="deliveryNoteStatus">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="A">{i18next.t('delivered')}</option>
                        <option value="B">{i18next.t('not-delivered')}</option>
                        <option value="C">{i18next.t('partially-delivered')}</option>
                    </select>
                </div>
            </div>
        </div>
    }
}



export default PurchaseOrders;
