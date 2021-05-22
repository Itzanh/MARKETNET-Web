import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SalesOrderForm from './SalesOrderForm';

const saleOrderStates = {
    '_': "Waiting for payment",
    'A': "Waiting for purchase order",
    'B': "Purchase order pending",
    'C': "Waiting for manufacturing orders",
    'D': "Manufacturing orders pending",
    'E': "Sent to preparation",
    'F': "Awaiting for shipping",
    'G': "Shipped",
    'H': "Receiced by the customer"
}


class SalesOrders extends Component {
    constructor({ findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder, getSalesOrder, getNameAddress,
        getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail, getNameProduct, updateSalesOrder, deleteSalesOrder,
        deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllSaleOrder, invoiceSelectionSaleOrder,
        getSalesOrderRelations, manufacturingOrderAllSaleOrder, manufacturingOrderPartiallySaleOrder }) {
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
        this.getNameAddress = getNameAddress;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getSalesOrder().then(async (salesOrders) => {
            ReactDOM.render(salesOrders.map((element, i) => {
                element.customerName = "...";
                return <SaleOrder key={i}
                    saleOrder={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < salesOrders.length; i++) {
                salesOrders[i].customerName = await this.getCustomerName(salesOrders[i].customer);
            }

            ReactDOM.render(salesOrders.map((element, i) => {
                return <SaleOrder key={i}
                    saleOrder={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
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

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSalesOrders">
            <h1>Sales Orders</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order no.</th>
                        <th scope="col">Reference</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total products</th>
                        <th scope="col">Total amount</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SaleOrder extends Component {
    constructor({ saleOrder, edit }) {
        super();

        this.saleOrder = saleOrder;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.saleOrder);
        }}>
            <th scope="row">{this.saleOrder.id}</th>
            <td>{this.saleOrder.orderName}</td>
            <td>{this.saleOrder.reference}</td>
            <td>{this.saleOrder.customerName}</td>
            <td>{window.dateFormat(new Date(this.saleOrder.dateCreated))}</td>
            <td>{this.saleOrder.totalProducts}</td>
            <td>{this.saleOrder.totalAmount}</td>
            <td>{saleOrderStates[this.saleOrder.status]}</td>
        </tr>
    }
}

export default SalesOrders;
