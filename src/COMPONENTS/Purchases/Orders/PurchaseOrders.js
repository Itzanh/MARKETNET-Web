import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import PurchaseOrderForm from './PurchaseOrderForm';
import SearchField from '../../SearchField';



class PurchaseOrders extends Component {
    constructor({ findSupplierByName, getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders, addPurchaseOrder, getPurchaseOrder,
        searchPurchaseOrder, getNameAddress, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails, addPurchaseOrderDetail,
        getNameProduct, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail, getSalesOrderDiscounts,
        addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder, getPurchaseOrderRelations,
        deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, getNameCarrier, findWarehouseByName, getNameWarehouse,
        getPurchaseOrderDefaults, documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail, locateSuppliers, locateProduct,
        getSalesOrderDetailsFromPurchaseOrderDetail, locateCurrency, locatePaymentMethods, locateBillingSeries, getSupplierFuntions, getAddressesFunctions,
        getPurcaseInvoicesFunctions, getPurchaseDeliveryNotesFunctions, getProductFunctions }) {
        super();

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
        this.tabPurchaseOrders = tabPurchaseOrders;
        this.addPurchaseOrder = addPurchaseOrder;
        this.getPurchaseOrder = getPurchaseOrder;
        this.searchPurchaseOrder = searchPurchaseOrder;
        this.getNameAddress = getNameAddress;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.getNameProduct = getNameProduct;
        this.updatePurchaseOrder = updatePurchaseOrder;
        this.deletePurchaseOrder = deletePurchaseOrder;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
        this.invoiceAllPurchaseOrder = invoiceAllPurchaseOrder;
        this.invoicePartiallyPurchaseOrder = invoicePartiallyPurchaseOrder;
        this.getPurchaseOrderRelations = getPurchaseOrderRelations;
        this.deliveryNoteAllPurchaseOrder = deliveryNoteAllPurchaseOrder;
        this.deliveryNotePartiallyPurchaseOrder = deliveryNotePartiallyPurchaseOrder;
        this.findCarrierByName = findCarrierByName;
        this.getNameCarrier = getNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.getPurchaseOrderDefaults = getPurchaseOrderDefaults;
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

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;
        this.getPurchaseDeliveryNotesFunctions = getPurchaseDeliveryNotesFunctions;
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
        this.list = orders;
        this.forceUpdate();
    }

    async add() {
        const defaults = await this.getPurchaseOrderDefaults();

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
                findWarehouseByName={this.findWarehouseByName}
                locateSuppliers={this.locateSuppliers}
                defaultValueNameWarehouse={defaults.warehouseName}
                defaultWarehouse={defaults.warehouse}

                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getPurchaseOrderDetails={this.getPurchaseOrderDetails}
                addPurchaseOrderDetail={this.addPurchaseOrderDetail}
                getNameProduct={this.getNameProduct}
                updatePurchaseOrder={this.updatePurchaseOrder}
                deletePurchaseOrder={this.deletePurchaseOrder}
                deletePurchaseOrderDetail={this.deletePurchaseOrderDetail}
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
                findWarehouseByName={this.findWarehouseByName}
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

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
                getPurchaseDeliveryNotesFunctions={this.getPurchaseDeliveryNotesFunctions}
                getProductFunctions={this.getProductFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(purchaseOrder) {
        var defaultValueNameSupplier;
        if (purchaseOrder.supplier != null)
            defaultValueNameSupplier = await this.getSupplierName(purchaseOrder.supplier);
        var defaultValueNamePaymentMethod;
        if (purchaseOrder.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(purchaseOrder.paymentMethod);
        var defaultValueNameCurrency;
        if (purchaseOrder.currency != null)
            defaultValueNameCurrency = await this.getNameCurrency(purchaseOrder.currency);
        var defaultValueNameBillingSerie;
        if (purchaseOrder.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(purchaseOrder.billingSeries);
        var defaultValueNameBillingAddress;
        if (purchaseOrder.billingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(purchaseOrder.billingAddress);
        var defaultValueNameShippingAddress;
        if (purchaseOrder.shippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(purchaseOrder.shippingAddress);
        var defaultValueNameCarrier;
        if (purchaseOrder.carrier != null)
            defaultValueNameCarrier = await this.getNameCarrier(purchaseOrder.carrier);
        var defaultValueNameWarehouse = await this.getNameWarehouse(purchaseOrder.warehouse);

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
                getNameProduct={this.getNameProduct}
                updatePurchaseOrder={this.updatePurchaseOrder}
                deletePurchaseOrder={this.deletePurchaseOrder}
                deletePurchaseOrderDetail={this.deletePurchaseOrderDetail}
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
                findWarehouseByName={this.findWarehouseByName}
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

                getSupplierFuntions={this.getSupplierFuntions}
                getAddressesFunctions={this.getAddressesFunctions}
                getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
                getPurchaseDeliveryNotesFunctions={this.getPurchaseDeliveryNotesFunctions}
                getProductFunctions={this.getProductFunctions}

                defaultValueNameSupplier={defaultValueNameSupplier}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameCarrier={defaultValueNameCarrier}
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
                <PurchaseOrderAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabPurchaseOrders" className="formRowRoot">
            <h1>{i18next.t('purchase-orders')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-1" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["purchaseOrders"] != null ? window.savedSearches["purchaseOrders"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                    { field: 'supplierReference', headerName: i18next.t('supplier-reference'), width: 240 },
                    { field: 'supplierName', headerName: i18next.t('supplier'), flex: 1 },
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

export default PurchaseOrders;
