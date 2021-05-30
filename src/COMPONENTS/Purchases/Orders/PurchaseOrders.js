import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PurchaseOrderForm from './PurchaseOrderForm';



class PurchaseOrders extends Component {
    constructor({ findSupplierByName, getSupplierName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders, addPurchaseOrder, getPurchaseOrder, getNameAddress,
        getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails, addPurchaseOrderDetail, updatePurchaseOrderDetail, getNameProduct,
        updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts,
        invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName,
        getNameCarrier, findWarehouseByName, getNameWarehouse, getPurchaseOrderDefaults }) {
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
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.getSalesOrderRelations = getSalesOrderRelations;
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;
        this.findCarrierByName = findCarrierByName;
        this.getNameCarrier = getNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.getPurchaseOrderDefaults = getPurchaseOrderDefaults;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPurchaseOrder().then(async (orders) => {
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
        });
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
                invoiceAllSaleOrder={this.invoiceAllSaleOrder}
                invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
                getSalesOrderRelations={this.getSalesOrderRelations}
                manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
                manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
                deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
                deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
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

    render() {
        return <div id="tabPurchaseOrders">
            <h1>Purchase Orders</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
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

export default PurchaseOrders;
