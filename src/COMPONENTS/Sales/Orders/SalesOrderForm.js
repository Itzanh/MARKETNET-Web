import { Component } from "react";
import ReactDOM from 'react-dom';
import './../../../CSS/sales_order.css';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesOrderDetails from "./SalesOrderDetails";
import SalesOrderGenerate from "./SalesOrderGenerate";
import SalesOrderDiscounts from "./SalesOrderDiscounts";
import SalesOrderRelations from "./SalesOrderRelations";
import SalesOrderDescription from "./SalesOrderDescription";

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

class SalesOrderForm extends Component {
    constructor({ order, findCustomerByName, defaultValueNameCustomer, findPaymentMethodByName, defaultValueNamePaymentMethod, findCurrencyByName,
        defaultValueNameCurrency, findBillingSerieByName, defaultValueNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder,
        defaultValueNameBillingAddress, defaultValueNameShippingAddress, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail,
        getNameProduct, updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts,
        invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder, manufacturingOrderPartiallySaleOrder }) {
        super();

        this.order = order;

        this.findCustomerByName = findCustomerByName;
        this.defaultValueNameCustomer = defaultValueNameCustomer;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesOrders = tabSalesOrders;
        this.addSalesOrder = addSalesOrder;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
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

        this.currentSelectedCustomerId = order != null ? order.customer : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethod : null;
        this.currentSelectedCurrencyId = order != null ? order.currency : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeries : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddress : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddress : null;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.customerDefaults = this.customerDefaults.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabGenerate = this.tabGenerate.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDescription = this.tabDescription.bind(this);
        this.tabDiscounts = this.tabDiscounts.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.order != null ? this.order.paymentMethod : null}
            defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                this.currentSelectedPaymentMethodId = value;
            }} disabled={this.order != null && this.order.status != "_"} />, this.refs.renderPaymentMethod);

        ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.order != null ? this.order.currency : null}
            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                this.currentSelectedCurrencyId = value;
            }} disabled={this.order != null && this.order.status != "_"} />, this.refs.renderCurrency);

        ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.order != null ? this.order.billingSerie : null}
            defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                this.currentSelectedBillingSerieId = value;
            }} disabled={this.order != null} />, this.refs.renderBillingSerie);

        this.tabDetails();
    }

    tabDetails() {
        ReactDOM.render(<SalesOrderDetails
            orderId={this.order == null ? null : this.order.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesOrderDetails={this.getSalesOrderDetails}
            addSalesOrderDetail={this.addSalesOrderDetail}
            getNameProduct={this.getNameProduct}
            deleteSalesOrderDetail={this.deleteSalesOrderDetail}
        />, this.refs.render);
    }

    tabGenerate() {
        ReactDOM.render(<SalesOrderGenerate
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderDetails={this.getSalesOrderDetails}
            getNameProduct={this.getNameProduct}
            invoiceAllSaleOrder={this.invoiceAllSaleOrder}
            invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
            manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
            manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
        />, this.refs.render);
    }

    tabRelations() {
        ReactDOM.render(<SalesOrderRelations
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderRelations={this.getSalesOrderRelations}
        />, this.refs.render);
    }

    tabDescription() {
        ReactDOM.render(<SalesOrderDescription
            notes={this.notes}
            description={this.description}
            setNotes={(notes) => {
                this.notes = notes;
            }}
            setDescription={(description) => {
                this.description = description;
            }}
        />, this.refs.render);
    }

    tabDiscounts() {
        ReactDOM.render(<SalesOrderDiscounts
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderDiscounts={this.getSalesOrderDiscounts}
            addSalesOrderDiscounts={this.addSalesOrderDiscounts}
            deleteSalesOrderDiscounts={this.deleteSalesOrderDiscounts}
        />, this.refs.render);
    }

    customerDefaults() {
        if (this.currentSelectedCustomerId == "") {
            return;
        }

        this.getCustomerDefaults(this.currentSelectedCustomerId).then((defaults) => {

            this.currentSelectedPaymentMethodId = defaults.paymentMethod;
            ReactDOM.unmountComponentAtNode(this.refs.renderPaymentMethod);
            ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={defaults.paymentMethod}
                defaultValueName={defaults.paymentMethodName} valueChanged={(value) => {
                    this.currentSelectedPaymentMethodId = value;
                }} disabled={this.order != null && this.order.status != "_"} />, this.refs.renderPaymentMethod);

            this.currentSelectedCurrencyId = defaults.currency;
            ReactDOM.unmountComponentAtNode(this.refs.renderCurrency);
            ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={defaults.currency}
                defaultValueName={defaults.currencyName} valueChanged={(value) => {
                    this.currentSelectedCurrencyId = value;
                }} disabled={this.order != null && this.order.status != "_"} />, this.refs.renderCurrency);

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            ReactDOM.unmountComponentAtNode(this.refs.renderBillingSerie);
            ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={defaults.billingSeries}
                defaultValueName={defaults.billingSeriesName} valueChanged={(value) => {
                    this.currentSelectedBillingSerieId = value;
                }} disabled={this.order != null} />, this.refs.renderBillingSerie);

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.refs.billingAddress.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
            this.refs.shippingAddres.value = defaults.mainShippingAddressName;
        });
    }

    locateBillingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateShippingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddres.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    getSalesOrderFromForm() {
        const salesOrder = {};
        salesOrder.reference = this.refs.reference.value;
        salesOrder.customer = parseInt(this.currentSelectedCustomerId);
        salesOrder.billingAddress = this.currentSelectedBillingAddress;
        salesOrder.shippingAddress = this.currentSelectedShippingAddress;
        salesOrder.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        salesOrder.billingSeries = this.currentSelectedBillingSerieId;
        salesOrder.warehouse = "W1";
        salesOrder.currency = parseInt(this.currentSelectedCurrencyId);
        salesOrder.discountPercent = parseFloat(this.refs.discountPercent.value);
        salesOrder.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        salesOrder.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        salesOrder.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        salesOrder.notes = this.notes;
        salesOrder.description = this.description;
        return salesOrder;
    }

    add() {
        this.addSalesOrder(this.getSalesOrderFromForm()).then((ok) => {
            if (ok) {
                this.tabSalesOrders();
            }
        });
    }

    update() {
        const salesOrder = this.getSalesOrderFromForm();
        salesOrder.id = this.order.id;

        this.updateSalesOrder(salesOrder).then((ok) => {
            if (ok) {
                this.tabSalesOrders();
            }
        });
    }

    delete() {
        this.deleteSalesOrder(this.order.id).then((ok) => {
            if (ok) {
                this.tabSalesOrders();
            }
        });
    }

    render() {
        return <div id="tabSaleOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h2>Sale Order {this.order == null ? "" : this.order.id}</h2>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Reference</label>
                            <input type="text" class="form-control" ref="reference" defaultValue={this.order != null ? this.order.reference : ''} />
                        </div>
                        <div class="col">
                            <label>Date created</label>
                            <input type="text" class="form-control" readOnly={true}
                                defaultValue={this.order != null ? window.dateFormat(new Date(this.order.dateCreated)) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Customer</label>
                    <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.order != null ? this.order.customer : null}
                        defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                            this.currentSelectedCustomerId = value;
                            this.customerDefaults();
                        }} />
                </div>
                <div class="col">
                    <label>Billing Address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameBillingAddress} readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Order Number</label>
                            <input type="number" class="form-control" defaultValue={this.order != null ? this.order.orderNumber : ''} readOnly={true} />
                        </div>
                        <div class="col">
                            <label>Date payment accepted</label>
                            <input type="text" class="form-control" defaultValue={this.order != null ? this.order.datePaymetAccepted : ''}
                                readOnly={true} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Payment method</label>
                    <div ref="renderPaymentMethod">

                    </div>
                </div>
                <div class="col">
                    <label>Shipping Address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddres" defaultValue={this.defaultValueNameShippingAddress}
                            readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Billing serie</label>
                            <div ref="renderBillingSerie">

                            </div>
                        </div>
                        <div class="col">
                            <label>Warehouse</label>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Currency</label>
                            <div ref="renderCurrency">

                            </div>
                        </div>
                        <div class="col">
                            <label>Currency exchange</label>
                            <input type="number" class="form-control" ref="currencyChange" readOnly={true}
                                defaultValue={this.order != null ? this.order.currencyChange : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Status</label>
                    <input type="text" class="form-control" defaultValue={this.order != null ? saleOrderStates[this.order.status] : ''}
                        readOnly={true} />
                </div>
            </div>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#" onClick={this.tabDetails}>Order details</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabGenerate}>Generate</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabRelations}>Relations</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Documents</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabDescription}>Description</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabDiscounts}>Discounts</a>
                </li>
            </ul>

            <div ref="render"></div>

            <div id="buttomSaleOrderForm">
                <div class="form-row salesOrderTotals">
                    <div class="col">
                        <label>Total products</label>
                        <input type="number" class="form-control" defaultValue={this.order != null ? this.order.totalProducts : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>VAT amount</label>
                        <input type="number" class="form-control" defaultValue={this.order != null ? this.order.vatAmount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Discount percent</label>
                        <input type="number" class="form-control" ref="discountPercent"
                            defaultValue={this.order != null ? this.order.discountPercent : '0'}
                            readOnly={this.order != null && this.order.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Fix discount</label>
                        <input type="number" class="form-control" ref="fixDiscount"
                            defaultValue={this.order != null ? this.order.fixDiscount : '0'}
                            readOnly={this.order != null && this.order.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping price</label>
                        <input type="number" class="form-control" ref="shippingPrice"
                            defaultValue={this.order != null ? this.order.shippingPrice : '0'}
                            readOnly={this.order != null && this.order.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping discount</label>
                        <input type="number" class="form-control" ref="shippingDiscount"
                            defaultValue={this.order != null ? this.order.shippingDiscount : '0'}
                            readOnly={this.order != null && this.order.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Total with discount</label>
                        <input type="number" class="form-control" defaultValue={this.order != null ? this.order.totalWithDiscount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Total amount</label>
                        <input type="number" class="form-control" defaultValue={this.order != null ? this.order.totalAmount : '0'}
                            readOnly={true} />
                    </div>
                </div>

                <div>
                    {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabSalesOrders}>Cancel</button>
                    {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    {this.order != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                </div>
            </div>
        </div>
    }
}

export default SalesOrderForm;
