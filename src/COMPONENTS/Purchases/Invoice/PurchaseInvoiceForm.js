import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseInvoiceDetails from "./PurchaseInvoiceDetails";
import PurchaseInvoiceRelations from "./PurchaseInvoiceRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";
import HighlightIcon from '@material-ui/icons/Highlight';
import LocateSupplier from "../../Masters/Suppliers/LocateSupplier";

class PurchaseInvoiceForm extends Component {
    constructor({ invoice, findSupplierByName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurcaseInvoices, defaultValueNameSupplier, defaultValueNamePaymentMethod,
        defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults,
        getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, getNameProduct, deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice,
        getPurchaseInvoiceRelations, documentFunctions, getPurchaseInvoiceRow, locateSuppliers, locateProduct }) {
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
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;

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
        this.locateSupplier = this.locateSupplier.bind(this);
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
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>{i18next.t('invoice-details')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabRelations}>{i18next.t('relations')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabDocuments}>{i18next.t('documents')}</a>
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
            locateProduct={this.locateProduct}
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
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (invoice.paymentMethod === null || invoice.paymentMethod <= 0 || isNaN(invoice.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (invoice.billingSeries === null || invoice.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (invoice.currency === null || invoice.currency <= 0 || isNaN(invoice.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (invoice.billingAddress === null || invoice.billingAddress <= 0 || isNaN(invoice.billingAddress)) {
            errorMessage = i18next.t('no-billing-address');
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
                    modalTitle={i18next.t('VALIDATION-ERROR')}
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

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                this.refs.supplierName.value = supplier.name;
                this.supplierDefaults();
            }}
        />, document.getElementById("renderAddressModal"));
    }

    render() {
        return <div id="tabPurchaseInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('purchase-invoice')} {this.invoice == null ? "" : this.invoice.id}</h4>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>{i18next.t('supplier')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}
                                disabled={this.invoice != null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="supplierName" defaultValue={this.defaultValueNameSupplier}
                            readOnly={true} style={{ 'width': '90%' }} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-address')}</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}><HighlightIcon /></button>
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
                            <label>{i18next.t('currency')}</label>
                            <div ref="renderCurrency">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('currency-exchange')}</label>
                            <input type="number" class="form-control" ref="currencyChange" readOnly={true}
                                defaultValue={this.invoice != null ? this.invoice.currencyChange : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('payment-method')}</label>
                            <div ref="renderPaymentMethod">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-serie')}</label>
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
                            <label>{i18next.t('total-products')}</label>
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-amount')}</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('discount-percent')}</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.invoice != null ? this.invoice.discountPercent : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fix-discount')}</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.invoice != null ? this.invoice.fixDiscount : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-price')}</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.invoice != null ? this.invoice.shippingPrice : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-discount')}</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.invoice != null ? this.invoice.shippingDiscount : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-with-discount')}</label>
                            <input type="number" class="form-control" ref="totalWithDiscount"
                                defaultValue={this.invoice !== undefined ? this.invoice.totalWithDiscount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.invoice !== undefined ? this.invoice.totalAmount : '0'}
                                readOnly={true} />
                        </div>
                    </div>

                    <div>
                        {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurcaseInvoices}>{i18next.t('cancel')}</button>
                        {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseInvoiceForm;
