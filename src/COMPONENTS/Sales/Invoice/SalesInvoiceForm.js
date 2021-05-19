import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesInvoiceDetails from "./SalesInvoiceDetails";
import SalesInvoiceRelations from "./SalesInvoiceRelations";

class SalesInvoiceForm extends Component {
    constructor({ invoice, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, defaultValueNameCustomer, defaultValueNamePaymentMethod, defaultValueNameCurrency,
        defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail,
        getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice, deleteSalesInvoice, getSalesInvoiceRelations }) {
        super();

        this.invoice = invoice;

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
        this.tabSalesInvoices = tabSalesInvoices;

        this.defaultValueNameCustomer = defaultValueNameCustomer;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.addSalesInvoice = addSalesInvoice;
        this.deleteSalesInvoice = deleteSalesInvoice;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;

        this.currentSelectedCustomerId = invoice != null ? invoice.customer : null;
        this.currentSelectedPaymentMethodId = invoice != null ? invoice.paymentMethod : null;
        this.currentSelectedCurrencyId = invoice != null ? invoice.currency : null;
        this.currentSelectedBillingSerieId = invoice != null ? invoice.billingSeries : null;
        this.currentSelectedBillingAddress = invoice != null ? invoice.billingAddress : null;

        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.invoice != null ? this.invoice.paymentMethod : null}
            defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                this.currentSelectedPaymentMethodId = value;
            }} disabled={this.invoice != null} />, this.refs.renderPaymentMethod);

        ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.invoice != null ? this.invoice.currency : null}
            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                this.currentSelectedCurrencyId = value;
            }} disabled={this.invoice != null} />, this.refs.renderCurrency);

        ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.invoice != null ? this.invoice.billingSerie : null}
            defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                this.currentSelectedBillingSerieId = value;
            }} disabled={this.invoice != null} />, this.refs.renderBillingSerie);

        this.tabDetails();
    }

    tabDetails() {
        ReactDOM.render(<SalesInvoiceDetails
            invoiceId={this.invoice == null ? null : this.invoice.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesInvoiceDetails={this.getSalesInvoiceDetails}
            addSalesInvoiceDetail={this.addSalesInvoiceDetail}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
        />, this.refs.render);
    }

    tabRelations() {
        ReactDOM.render(<SalesInvoiceRelations
            invoiceId={this.invoice == null ? null : this.invoice.id}
            getSalesInvoiceRelations={this.getSalesInvoiceRelations}
        />, this.refs.render);
    }

    locateBillingAddr() {
        if (this.invoice != null) {
            return;
        }

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
                }} disabled={this.invoice != null} />, this.refs.renderPaymentMethod);

            this.currentSelectedCurrencyId = defaults.currency;
            ReactDOM.unmountComponentAtNode(this.refs.renderCurrency);
            ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={defaults.currency}
                defaultValueName={defaults.currencyName} valueChanged={(value) => {
                    this.currentSelectedCurrencyId = value;
                }} disabled={this.invoice != null} />, this.refs.renderCurrency);

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            ReactDOM.unmountComponentAtNode(this.refs.renderBillingSerie);
            ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={defaults.billingSeries}
                defaultValueName={defaults.billingSeriesName} valueChanged={(value) => {
                    this.currentSelectedBillingSerieId = value;
                }} disabled={this.invoice != null} />, this.refs.renderBillingSerie);

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.refs.billingAddress.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getSalesInvoiceFromForm() {
        const salesInvoice = {};
        salesInvoice.customer = parseInt(this.currentSelectedCustomerId);
        salesInvoice.billingAddress = this.currentSelectedBillingAddress;
        salesInvoice.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        salesInvoice.billingSeries = this.currentSelectedBillingSerieId;
        salesInvoice.currency = parseInt(this.currentSelectedCurrencyId);
        salesInvoice.discountPercent = parseFloat(this.refs.discountPercent.value);
        salesInvoice.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        salesInvoice.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        salesInvoice.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        return salesInvoice;
    }

    add() {
        this.addSalesInvoice(this.getSalesInvoiceFromForm()).then((ok) => {
            if (ok) {
                this.tabSalesInvoices();
            }
        });
    }

    delete() {
        this.deleteSalesInvoice(this.invoice.id).then((ok) => {
            if (ok) {
                this.tabSalesInvoices();
            }
        });
    }

    render() {
        return <div id="tabSaleInvoice">
            <div id="renderAddressModal"></div>
            <h2>Sale Invoice {this.invoice == null ? "" : this.invoice.id}</h2>
            <div class="form-row">
                <div class="col">
                    <label>Date created</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>Customer</label>
                    <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.invoice != null ? this.invoice.customer : null}
                        defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                            this.currentSelectedCustomerId = value;
                            this.customerDefaults();
                        }} disabled={this.invoice != null} />
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
                            <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.invoiceNumber : ''} readOnly={true} />
                        </div>
                        <div class="col">
                            <label>Currency</label>
                            <div ref="renderCurrency">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Currency exchange</label>
                            <input type="number" class="form-control" ref="currencyChange" readOnly={true}
                                defaultValue={this.invoice != null ? this.invoice.currencyChange : ''} />
                        </div>
                        <div class="col">
                            <label>Payment method</label>
                            <div ref="renderPaymentMethod">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Billing serie</label>
                    <div ref="renderBillingSerie">

                    </div>
                </div>
            </div>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#" onClick={this.tabDetails}>Invoice details</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabRelations}>Relations</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Documents</a>
                </li>
            </ul>

            <div ref="render"></div>

            <div id="buttomSaleOrderForm">
                <div class="form-row salesOrderTotals">
                    <div class="col">
                        <label>Total products</label>
                        <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>VAT amount</label>
                        <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Discount percent</label>
                        <input type="number" class="form-control" ref="discountPercent"
                            defaultValue={this.invoice != null ? this.invoice.discountPercent : '0'}
                            readOnly={this.invoice != null && this.invoice.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Fix discount</label>
                        <input type="number" class="form-control" ref="fixDiscount"
                            defaultValue={this.invoice != null ? this.invoice.fixDiscount : '0'}
                            readOnly={this.invoice != null && this.invoice.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping price</label>
                        <input type="number" class="form-control" ref="shippingPrice"
                            defaultValue={this.invoice != null ? this.invoice.shippingPrice : '0'}
                            readOnly={this.invoice != null && this.invoice.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping discount</label>
                        <input type="number" class="form-control" ref="shippingDiscount"
                            defaultValue={this.invoice != null ? this.invoice.shippingDiscount : '0'}
                            readOnly={this.invoice != null && this.invoice.status != "_"} />
                    </div>
                    <div class="col">
                        <label>Total with discount</label>
                        <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.totalWithDiscount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Total amount</label>
                        <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.totalAmount : '0'}
                            readOnly={true} />
                    </div>
                </div>

                <div>
                    {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabSalesInvoices}>Cancel</button>
                    {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    {this.invoice != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceForm;
