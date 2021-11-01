import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import SalesOrderForm from './SalesOrderForm';
import SearchField from '../../SearchField';
import { DataGrid } from '@material-ui/data-grid';

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer',
    'Z': 'cancelled'
}



class SalesOrders extends Component {
    constructor({ findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder, getSalesOrder, getSalesOrderRow,
        searchSalesOrder, getNameAddress, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail, updateSalesOrderDetail,
        getNameProduct, updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts,
        invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder, manufacturingOrderPartiallySaleOrder,
        deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName, getNameCarrier, findWarehouseByName, getNameWarehouse, salesOrderDefaults,
        documentFunctions, getCustomerRow, sendEmail, locateProduct, locateCustomers, cancelSalesOrderDetail, getPurchasesOrderDetailsFromSaleOrderDetail,
        locateCurrency, locatePaymentMethods, locateCarriers, locateBillingSeries, getAddressesFunctions, getCustomersFunctions, getSalesInvoicesFuntions,
        getSalesDeliveryNotesFunctions, getManufacturingOrdersFunctions, getShippingFunctions, getProductFunctions }) {
        super();

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
        this.tabSalesOrders = tabSalesOrders;
        this.addSalesOrder = addSalesOrder;
        this.getSalesOrder = getSalesOrder;
        this.getSalesOrderRow = getSalesOrderRow;
        this.searchSalesOrder = searchSalesOrder;
        this.getNameAddress = getNameAddress;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.getNameProduct = getNameProduct;
        this.updateSalesOrder = updateSalesOrder;
        this.deleteSalesOrder = deleteSalesOrder;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.getSalesOrderRelations = getSalesOrderRelations;
        this.manufacturingOrderAllSaleOrder = manufacturingOrderAllSaleOrder;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;
        this.findCarrierByName = findCarrierByName;
        this.getNameCarrier = getNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.salesOrderDefaults = salesOrderDefaults;
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;
        this.cancelSalesOrderDetail = cancelSalesOrderDetail;
        this.getPurchasesOrderDetailsFromSaleOrderDetail = getPurchasesOrderDetailsFromSaleOrderDetail;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateCarriers = locateCarriers;
        this.locateBillingSeries = locateBillingSeries;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getCustomersFunctions = getCustomersFunctions;
        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;
        this.getSalesDeliveryNotesFunctions = getSalesDeliveryNotesFunctions;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getShippingFunctions = getShippingFunctions;
        this.getProductFunctions = getProductFunctions;

        this.advancedSearchListener = null;
        this.list = [];
        this.sortField = "";
        this.sortAscending = true;
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.offset = 0;
        this.limit = 100;

        const savedSearch = window.getSavedSearches("saleOrders");
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
        const savedSearch = window.getSavedSearches("saleOrders");

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
            this.getSalesOrder({
                offset: this.offset,
                limit: this.limit
            }).then((salesOrders) => {
                this.renderSaleOrder(salesOrders);
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
            var savedSearch = window.getSavedSearches("saleOrders");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("saleOrders", savedSearch);

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
                search.status = s.status;
            }
            const salesOrders = await this.searchSalesOrder(search);
            this.renderSaleOrder(salesOrders);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("saleOrders");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        savedSearch.offset = this.offset;
        savedSearch.limit = this.limit;
        window.addSavedSearches("saleOrders", savedSearch);
    }

    async renderSaleOrder(salesOrders) {
        this.loading = false;
        if (this.offset > 0) {
            this.list = this.list.concat(salesOrders.orders);
        } else {
            this.list = salesOrders.orders;
        }
        this.rows = salesOrders.rows;
        this.forceUpdate();
    }

    async add() {
        const defaults = await this.salesOrderDefaults();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesOrderForm
                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesOrders={this.tabSalesOrders}
                addSalesOrder={this.addSalesOrder}
                findCarrierByName={this.findCarrierByName}
                findWarehouseByName={this.findWarehouseByName}
                locateCustomers={this.locateCustomers}
                defaultValueNameWarehouse={defaults.warehouseName}
                defaultWarehouse={defaults.warehouse}

                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getSalesOrderDetails={this.getSalesOrderDetails}
                addSalesOrderDetail={this.addSalesOrderDetail}
                updateSalesOrderDetail={this.updateSalesOrderDetail}
                getNameProduct={this.getNameProduct}
                updateSalesOrder={this.updateSalesOrder}
                deleteSalesOrder={this.deleteSalesOrder}
                deleteSalesOrderDetail={this.deleteSalesOrderDetail}
                getSalesOrderDiscounts={this.getSalesOrderDiscounts}
                addSalesOrderDiscounts={this.addSalesOrderDiscounts}
                deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
                invoiceAllSaleOrder={this.invoiceAllSaleOrder}
                invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
                getSalesOrderRelations={this.getSalesOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
                deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
                findCarrierByName={this.findCarrierByName}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getSalesOrderRow={this.getSalesOrderRow}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
                cancelSalesOrderDetail={this.cancelSalesOrderDetail}
                getPurchasesOrderDetailsFromSaleOrderDetail={this.getPurchasesOrderDetailsFromSaleOrderDetail}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateCarriers={this.locateCarriers}
                locateBillingSeries={this.locateBillingSeries}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
                getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
                getManufacturingOrdersFunctions={this.getManufacturingOrdersFunctions}
                getShippingFunctions={this.getShippingFunctions}
                getProductFunctions={this.getProductFunctions}
            />,
            document.getElementById('renderTab'));
    }

    async edit(saleOrder) {
        var defaultValueNameCustomer;
        if (saleOrder.customer != null)
            defaultValueNameCustomer = await this.getCustomerName(saleOrder.customer);
        var defaultValueNamePaymentMethod;
        if (saleOrder.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(saleOrder.paymentMethod);
        var defaultValueNameCurrency;
        if (saleOrder.currency != null)
            defaultValueNameCurrency = await this.getNameCurrency(saleOrder.currency);
        var defaultValueNameBillingSerie;
        if (saleOrder.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(saleOrder.billingSeries);
        var defaultValueNameBillingAddress;
        if (saleOrder.billingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(saleOrder.billingAddress);
        var defaultValueNameShippingAddress;
        if (saleOrder.shippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(saleOrder.shippingAddress);
        var defaultValueNameCarrier;
        if (saleOrder.carrier != null)
            defaultValueNameCarrier = await this.getNameCarrier(saleOrder.carrier);
        var defaultValueNameWarehouse = await this.getNameWarehouse(saleOrder.warehouse);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesOrderForm
                order={saleOrder}

                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesOrders={this.tabSalesOrders}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                findProductByName={this.findProductByName}
                getSalesOrderDetails={this.getSalesOrderDetails}
                addSalesOrderDetail={this.addSalesOrderDetail}
                updateSalesOrderDetail={this.updateSalesOrderDetail}
                getNameProduct={this.getNameProduct}
                updateSalesOrder={this.updateSalesOrder}
                deleteSalesOrder={this.deleteSalesOrder}
                deleteSalesOrderDetail={this.deleteSalesOrderDetail}
                getSalesOrderDiscounts={this.getSalesOrderDiscounts}
                addSalesOrderDiscounts={this.addSalesOrderDiscounts}
                deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
                invoiceAllSaleOrder={this.invoiceAllSaleOrder}
                invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
                getSalesOrderRelations={this.getSalesOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
                deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
                findCarrierByName={this.findCarrierByName}
                findWarehouseByName={this.findWarehouseByName}
                documentFunctions={this.documentFunctions}
                getSalesOrderRow={this.getSalesOrderRow}
                getCustomerRow={this.getCustomerRow}
                sendEmail={this.sendEmail}
                locateProduct={this.locateProduct}
                locateCustomers={this.locateCustomers}
                cancelSalesOrderDetail={this.cancelSalesOrderDetail}
                getPurchasesOrderDetailsFromSaleOrderDetail={this.getPurchasesOrderDetailsFromSaleOrderDetail}
                locateCurrency={this.locateCurrency}
                locatePaymentMethods={this.locatePaymentMethods}
                locateCarriers={this.locateCarriers}
                locateBillingSeries={this.locateBillingSeries}

                getAddressesFunctions={this.getAddressesFunctions}
                getCustomersFunctions={this.getCustomersFunctions}
                getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
                getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
                getManufacturingOrdersFunctions={this.getManufacturingOrdersFunctions}
                getShippingFunctions={this.getShippingFunctions}
                getProductFunctions={this.getProductFunctions}

                defaultValueNameCustomer={defaultValueNameCustomer}
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
                <SaleOrderAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <h1>{i18next.t('sales-orders')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["saleOrders"] != null ? window.savedSearches["saleOrders"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                    { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 },
                    {
                        field: 'status', headerName: i18next.t('status'), width: 250, valueGetter: (params) => {
                            return i18next.t(saleOrderStates[params.row.status])
                        }
                    },
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

class SaleOrderAdvancedSearch extends Component {
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
        search.status = this.refs.status.value;
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
            <div class="col">
                <label>Status</label>
                <select class="form-control" ref="status">
                    <option value="">.{i18next.t('all')}</option>
                    <option value="_">{i18next.t('waiting-for-payment')}</option>
                    <option value="A">{i18next.t('waiting-for-purchase-order')}</option>
                    <option value="B">{i18next.t('purchase-order-pending')}</option>
                    <option value="C">{i18next.t('waiting-for-manufacturing-orders')}</option>
                    <option value="D">{i18next.t('manufacturing-orders-pending')}</option>
                    <option value="E">{i18next.t('sent-to-preparation')}</option>
                    <option value="F">{i18next.t('awaiting-for-shipping')}</option>
                    <option value="G">{i18next.t('shipped')}</option>
                    <option value="H">{i18next.t('receiced-by-the-customer')}</option>
                </select>
            </div>
        </div>
    }
}

export default SalesOrders;
