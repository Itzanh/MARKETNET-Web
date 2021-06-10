import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesInvoiceDetails from "./SalesInvoiceDetails";
import SalesInvoiceRelations from "./SalesInvoiceRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";

class SalesInvoiceForm extends Component {
    constructor({ invoice, findCustomerByName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, defaultValueNameCustomer, defaultValueNamePaymentMethod,
        defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails,
        addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice, deleteSalesInvoice, getSalesInvoiceRelations, documentFunctions,
        getSalesInvoicesRow }) {
        super();

        this.invoice = invoice;

        this.findCustomerByName = findCustomerByName;
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
        this.documentFunctions = documentFunctions;
        this.getSalesInvoicesRow = getSalesInvoicesRow;

        this.currentSelectedCustomerId = invoice != null ? invoice.customer : null;
        this.currentSelectedPaymentMethodId = invoice != null ? invoice.paymentMethod : null;
        this.currentSelectedCurrencyId = invoice != null ? invoice.currency : null;
        this.currentSelectedBillingSerieId = invoice != null ? invoice.billingSeries : null;
        this.currentSelectedBillingAddress = invoice != null ? invoice.billingAddress : null;

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
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

        this.tabs();
        this.tabDetails();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>Invoice details</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabRelations}>Relations</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabDocuments}>Documents</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<SalesInvoiceDetails
            invoiceId={this.invoice == null ? null : this.invoice.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesInvoiceDetails={this.getSalesInvoiceDetails}
            addSalesInvoiceDetail={(detail) => {
                return new Promise((resolve) => {
                    this.addSalesInvoiceDetail(detail).then((ok) => {
                        if (ok) {
                            this.refreshTotals().then(() => {
                                resolve(ok);
                            });
                        } else {
                            resolve(ok);
                        }
                    });
                });
            }}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.deleteSalesInvoiceDetail(detailId).then((ok) => {
                        if (ok) {
                            this.refreshTotals().then(() => {
                                resolve(ok);
                            });
                        } else {
                            resolve(ok);
                        }
                    });
                });
            }}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<SalesInvoiceRelations
            invoiceId={this.invoice == null ? null : this.invoice.id}
            getSalesInvoiceRelations={this.getSalesInvoiceRelations}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            saleInvoiceId={this.invoice == null ? null : this.invoice.id}
            documentFunctions={this.documentFunctions}
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
        if (this.currentSelectedCustomerId === "") {
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

    isValid(invoices) {
        var errorMessage = "";
        if (invoices.customer <= 0 || invoices.customer === null || isNaN(invoices.customer)) {
            errorMessage = "You must select a customer.";
            return errorMessage;
        }
        if (invoices.paymentMethod <= 0 || invoices.paymentMethod === null || isNaN(invoices.paymentMethod)) {
            errorMessage = "You must select a payment method.";
            return errorMessage;
        }
        if (invoices.billingSeries.length === 0 || invoices.billingSeries === null) {
            errorMessage = "You must select a billing series.";
            return errorMessage;
        }
        if (invoices.currency <= 0 || invoices.currency === null || isNaN(invoices.currency)) {
            errorMessage = "You must select a currency.";
            return errorMessage;
        }
        if (invoices.billingAddress <= 0 || invoices.billingAddress === null || isNaN(invoices.billingAddress)) {
            errorMessage = "You must select a billing address.";
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const invoices = this.getSalesInvoiceFromForm();
        const errorMessage = this.isValid(invoices);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={"VALIDATION ERROR"}
                    modalText={errorMessage}
                />,
                document.getElementById('renderAddressModal'));
            return;
        }

        this.addSalesInvoice(invoices).then((ok) => {
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

    refreshTotals() {
        return new Promise(async (resolve) => {
            const invoice = await this.getSalesInvoicesRow(this.invoice.id);
            console.log(invoice);

            this.refs.totalProducts.value = invoice.totalProducts;
            this.refs.vatAmount.value = invoice.vatAmount;
            this.refs.totalWithDiscount.value = invoice.totalWithDiscount;
            this.refs.totalAmount.value = invoice.totalAmount;
            resolve();
        });
    }

    render() {
        return <div id="tabSaleInvoice" className="formRowRoot">
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

            <div ref="tabs"></div>

            <div ref="render"></div>

            <div id="buttomBottomForm">
                <div class="form-row salesOrderTotals">
                    <div class="col">
                        <label>Total products</label>
                        <input type="number" class="form-control" ref="totalProducts"
                            defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>VAT amount</label>
                        <input type="number" class="form-control" ref="vatAmount"
                            defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Discount percent</label>
                        <input type="number" class="form-control" ref="discountPercent"
                            defaultValue={this.invoice !== undefined ? this.invoice.discountPercent : '0'}
                            readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                    </div>
                    <div class="col">
                        <label>Fix discount</label>
                        <input type="number" class="form-control" ref="fixDiscount"
                            defaultValue={this.invoice !== undefined ? this.invoice.fixDiscount : '0'}
                            readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping price</label>
                        <input type="number" class="form-control" ref="shippingPrice"
                            defaultValue={this.invoice !== undefined ? this.invoice.shippingPrice : '0'}
                            readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                    </div>
                    <div class="col">
                        <label>Shipping discount</label>
                        <input type="number" class="form-control" ref="shippingDiscount"
                            defaultValue={this.invoice !== undefined ? this.invoice.shippingDiscount : '0'}
                            readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                    </div>
                    <div class="col">
                        <label>Total with discount</label>
                        <input type="number" class="form-control" ref="totalWithDiscount"
                            defaultValue={this.invoice !== undefined ? this.invoice.totalWithDiscount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Total amount</label>
                        <input type="number" class="form-control" ref="totalAmount"
                            defaultValue={this.invoice !== undefined ? this.invoice.totalAmount : '0'}
                            readOnly={true} />
                    </div>
                </div>

                <div>
                    {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabSalesInvoices}>Cancel</button>
                    {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceForm;
