import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseInvoiceDetails from "./PurchaseInvoiceDetails";
import PurchaseInvoiceRelations from "./PurchaseInvoiceRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";

class PurchaseInvoiceForm extends Component {
    constructor({ invoice, findSupplierByName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurcaseInvoices, defaultValueNameSupplier, defaultValueNamePaymentMethod,
        defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults,
        getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, getNameProduct, deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice,
        getPurchaseInvoiceRelations, documentFunctions, getPurchaseInvoiceRow }) {
        super();

        this.invoice = invoice;

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurcaseInvoices = tabPurcaseInvoices;

        this.defaultValueNameSupplier = defaultValueNameSupplier;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.addPurchaseInvoice = addPurchaseInvoice;
        this.deletePurchaseInvoice = deletePurchaseInvoice;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
        this.documentFunctions = documentFunctions;
        this.getPurchaseInvoiceRow = getPurchaseInvoiceRow;

        this.currentSelectedSupplierId = invoice != null ? invoice.supplier : null;
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
        ReactDOM.render(<PurchaseInvoiceDetails
            invoiceId={this.invoice == null ? null : this.invoice.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
            addPurchaseInvoiceDetail={(detail) => {
                return new Promise((resolve) => {
                    this.addPurchaseInvoiceDetail(detail).then((ok) => {
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
            deletePurchaseInvoiceDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.deletePurchaseInvoiceDetail(detailId).then((ok) => {
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
        ReactDOM.render(<PurchaseInvoiceRelations
            invoiceId={this.invoice == null ? null : this.invoice.id}
            getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            purchaseInvoiceId={this.invoice == null ? null : this.invoice.id}
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
                    return this.locateAddress(this.currentSelectedSupplierId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    supplierDefaults() {
        if (this.currentSelectedSupplierId === "") {
            return;
        }

        this.getSupplierDefaults(this.currentSelectedSupplierId).then((defaults) => {

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

    getPurchaseInvoiceFromForm() {
        const invoice = {};
        invoice.supplier = parseInt(this.currentSelectedSupplierId);
        invoice.billingAddress = this.currentSelectedBillingAddress;
        invoice.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        invoice.billingSeries = this.currentSelectedBillingSerieId;
        invoice.currency = parseInt(this.currentSelectedCurrencyId);
        invoice.discountPercent = parseFloat(this.refs.discountPercent.value);
        invoice.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        invoice.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        invoice.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        return invoice;
    }

    isValid(invoice) {
        var errorMessage = "";
        if (invoice.supplier === null || invoice.supplier <= 0 || isNaN(invoice.supplier)) {
            errorMessage = "You must select a supplier.";
            return errorMessage;
        }
        if (invoice.paymentMethod === null || invoice.paymentMethod <= 0 || isNaN(invoice.paymentMethod)) {
            errorMessage = "You must select a payment method.";
            return errorMessage;
        }
        if (invoice.billingSeries === null || invoice.billingSeries.length === 0) {
            errorMessage = "You must select a billing series.";
            return errorMessage;
        }
        if (invoice.currency === null || invoice.currency <= 0 || isNaN(invoice.currency)) {
            errorMessage = "You must select a currency.";
            return errorMessage;
        }
        if (invoice.billingAddress === null || invoice.billingAddress <= 0 || isNaN(invoice.billingAddress)) {
            errorMessage = "You must select a billing address.";
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const invoice = this.getPurchaseInvoiceFromForm();
        const errorMessage = this.isValid(invoice);
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

        this.addPurchaseInvoice(invoice).then((ok) => {
            if (ok) {
                this.tabPurcaseInvoices();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deletePurchaseInvoice(this.invoice.id).then((ok) => {
                        if (ok) {
                            this.tabPurcaseInvoices();
                        }
                    });
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            // an order detail has been added, refresh the totals and status
            const order = await this.getPurchaseInvoiceRow(this.invoice.id);

            this.refs.totalProducts.value = order.totalProducts;
            this.refs.vatAmount.value = order.vatAmount;
            this.refs.totalWithDiscount.value = order.totalWithDiscount;
            this.refs.totalAmount.value = order.totalAmount;
            resolve();
        });
    }

    render() {
        return <div id="tabPurchaseInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>Purchase Invoice {this.invoice == null ? "" : this.invoice.id}</h4>
            <div class="form-row">
                <div class="col">
                    <label>Date created</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>Supplier</label>
                    <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.invoice != null ? this.invoice.customer : null}
                        defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                            this.currentSelectedSupplierId = value;
                            this.supplierDefaults();
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

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="form-row salesOrderTotals">
                        <div class="col">
                            <label>Total products</label>
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>VAT amount</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>Discount percent</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.invoice != null ? this.invoice.discountPercent : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>Fix discount</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.invoice != null ? this.invoice.fixDiscount : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>Shipping price</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.invoice != null ? this.invoice.shippingPrice : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>Shipping discount</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.invoice != null ? this.invoice.shippingDiscount : '0'}
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
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.invoice !== undefined ? this.invoice.totalAmount : '0'}
                                readOnly={true} />
                        </div>
                    </div>

                    <div>
                        {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurcaseInvoices}>Cancel</button>
                        {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseInvoiceForm;
