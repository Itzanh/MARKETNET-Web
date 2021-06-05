import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PurchaseOrderForm from './PurchaseOrderForm';
import SearchField from '../../SearchField';



class PurchaseOrders extends Component {
    constructor({ findSupplierByName, getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders, addPurchaseOrder, getPurchaseOrder,
        searchPurchaseOrder, getNameAddress, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails, addPurchaseOrderDetail,
        updatePurchaseOrderDetail, getNameProduct, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail, getSalesOrderDiscounts,
        addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder, getPurchaseOrderRelations,
        deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, getNameCarrier, findWarehouseByName, getNameWarehouse,
        getPurchaseOrderDefaults }) {
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

        this.advancedSearchListener = null;

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
        ReactDOM.render(orders.map((element, i) => {
            element.supplierName = "...";
            return <PurchaseOrder key={i}
                order={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < orders.length; i++) {
            orders[i].supplierName = await this.getSupplierName(orders[i].supplier);
        }

        ReactDOM.render(orders.map((element, i) => {
            return <PurchaseOrder key={i}
                order={element}
                edit={this.edit}
            />
        }), this.refs.render);
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
            <h1>Purchase Orders</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order no.</th>
                        <th scope="col">Supplier Reference</th>
                        <th scope="col">Supplier</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total products</th>
                        <th scope="col">Total amount</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PurchaseOrder extends Component {
    constructor({ order, edit }) {
        super();

        this.order = order;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.order);
        }}>
            <th scope="row">{this.order.id}</th>
            <td>{this.order.orderName}</td>
            <td>{this.order.reference}</td>
            <td>{this.order.supplierName}</td>
            <td>{window.dateFormat(new Date(this.order.dateCreated))}</td>
            <td>{this.order.totalProducts}</td>
            <td>{this.order.totalAmount}</td>
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
                <label for="start">Start date:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">End date:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default PurchaseOrders;
