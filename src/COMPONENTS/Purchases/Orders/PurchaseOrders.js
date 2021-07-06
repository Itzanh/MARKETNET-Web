import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import PurchaseOrderForm from './PurchaseOrderForm';
import SearchField from '../../SearchField';
import TableContextMenu from '../../VisualComponents/TableContextMenu';



class PurchaseOrders extends Component {
    constructor({ findSupplierByName, getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders, addPurchaseOrder, getPurchaseOrder,
        searchPurchaseOrder, getNameAddress, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails, addPurchaseOrderDetail,
        updatePurchaseOrderDetail, getNameProduct, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail, getSalesOrderDiscounts,
        addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder, getPurchaseOrderRelations,
        deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, getNameCarrier, findWarehouseByName, getNameWarehouse,
        getPurchaseOrderDefaults, documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail }) {
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
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
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

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getPurchaseOrder().then((orders) => {
            this.renderOrders(orders);
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
        const orders = await this.searchPurchaseOrder(search);
        this.renderOrders(orders);
    }

    async renderOrders(orders) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        var totalProducts = 0;
        var totalAmount = 0;
        ReactDOM.render(orders.map((element, i) => {
            element.dateCreated = new Date(element.dateCreated);

            totalProducts += element.totalProducts;
            totalAmount += element.totalAmount;
            return <PurchaseOrder key={i}
                order={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.refs.rows.innerText = orders.length;
        this.refs.totalProducts.innerText = totalProducts;
        this.refs.totalAmount.innerText = totalAmount;
        
        this.list = orders;
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
                defaultValueNameWarehouse={defaults.warehouseName}
                defaultWarehouse={defaults.warehouse}
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
                updatePurchaseOrderDetail={this.updatePurchaseOrderDetail}
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
        return <div id="tabPurchaseOrders" className="formRowRoot menu">
            <h1>{i18next.t('purchase-orders')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderOrders(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="orderName" scope="col">{i18next.t('order-no')}</th>
                        <th field="supplierReference" scope="col">{i18next.t('supplier-reference')}</th>
                        <th field="supplierName" scope="col">{i18next.t('supplier')}</th>
                        <th field="dateCreated" scope="col">{i18next.t('date')}</th>
                        <th field="totalProducts" scope="col">{i18next.t('total-products')}</th>
                        <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderOrders(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "orderName", "supplierReference", "supplierName", "dateCreated", "totalProducts", "totalAmount"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
                <tfoot>
                    <tr>
                        <th ref="rows" scope="row">0</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td ref="totalProducts">0</td>
                        <td ref="totalAmount">0</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    }
}

class PurchaseOrder extends Component {
    constructor({ order, edit, pos }) {
        super();

        this.order = order;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.order);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.order.id}</th>
            <td field="orderName">{this.order.orderName}</td>
            <td field="supplierReference">{this.order.supplierReference}</td>
            <td field="supplierName">{this.order.supplierName}</td>
            <td field="dateCreated">{window.dateFormat(this.order.dateCreated)}</td>
            <td field="totalProducts">{this.order.totalProducts}</td>
            <td field="totalAmount">{this.order.totalAmount}</td>
        </tr>
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
