import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseDeliveryNoteDetails from "./PurchaseDeliveryNoteDetails";
import PurchaseDeliveryNotesRelations from "./PurchaseDeliveryNotesRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";

class PurchaseDeliveryNotesForm extends Component {
    constructor({ note, findSupplierByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseDeliveryNotes, defaultValueNameSupplier,
        defaultValueNamePaymentMethod, defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameShippingAddress, findProductByName,
        getOrderDetailsDefaults, getPurchaseDeliveryNoteDetails, getNameProduct, addPurchaseDeliveryNotes, deletePurchaseDeliveryNotes, getSalesDeliveryNoteDetails,
        addWarehouseMovements, deleteWarehouseMovements, getPurchaseDeliveryNotesRelations, findWarehouseByName, defaultValueNameWarehouse, documentFunctions }) {
        super();

        this.note = note;

        this.findSupplierByName = findSupplierByName;
        this.getCustomerName = getCustomerName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseDeliveryNotes = tabPurchaseDeliveryNotes;
        this.documentFunctions = documentFunctions;

        this.defaultValueNameSupplier = defaultValueNameSupplier;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.getNameProduct = getNameProduct;
        this.addPurchaseDeliveryNotes = addPurchaseDeliveryNotes;
        this.deletePurchaseDeliveryNotes = deletePurchaseDeliveryNotes;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;

        this.currentSelectedSupplierId = note != null ? note.supplier : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethod : null;
        this.currentSelectedCurrencyId = note != null ? note.currency : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeries : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddress : null;
        this.currentSelectedWarehouseId = note != null ? note.warehouse : null;

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.note != null ? this.note.paymentMethod : null}
            defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                this.currentSelectedPaymentMethodId = value;
            }} disabled={this.note != null} />, this.refs.renderPaymentMethod);

        ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.note != null ? this.note.currency : null}
            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                this.currentSelectedCurrencyId = value;
            }} disabled={this.note != null} />, this.refs.renderCurrency);

        ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.note != null ? this.note.billingSerie : null}
            defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                this.currentSelectedBillingSerieId = value;
            }} disabled={this.note != null} />, this.refs.renderBillingSerie);

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
        ReactDOM.render(<PurchaseDeliveryNoteDetails
            noteId={this.note == null ? null : this.note.id}
            warehouseId={this.note == null ? null : this.note.warehouse}
            findProductByName={this.findProductByName}
            getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
            addSalesInvoiceDetail={this.addSalesInvoiceDetail}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
            addWarehouseMovements={this.addWarehouseMovements}
            deleteWarehouseMovements={this.deleteWarehouseMovements}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<PurchaseDeliveryNotesRelations
            noteId={this.note === null ? null : this.note.id}
            getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}

        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            purchaseDeliveryNoteId={this.note == null ? null : this.note.id}
            documentFunctions={this.documentFunctions}
        />, this.refs.render);
    }

    locateShippingAddr() {
        if (this.note != null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedSupplierId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    customerDefaults() {
        if (this.currentSelectedSupplierId === "") {
            return;
        }

        this.getSupplierDefaults(this.currentSelectedSupplierId).then((defaults) => {

            this.currentSelectedPaymentMethodId = defaults.paymentMethod;
            ReactDOM.unmountComponentAtNode(this.refs.renderPaymentMethod);
            ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={defaults.paymentMethod}
                defaultValueName={defaults.paymentMethodName} valueChanged={(value) => {
                    this.currentSelectedPaymentMethodId = value;
                }} disabled={this.note != null} />, this.refs.renderPaymentMethod);

            this.currentSelectedCurrencyId = defaults.currency;
            ReactDOM.unmountComponentAtNode(this.refs.renderCurrency);
            ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={defaults.currency}
                defaultValueName={defaults.currencyName} valueChanged={(value) => {
                    this.currentSelectedCurrencyId = value;
                }} disabled={this.note != null} />, this.refs.renderCurrency);

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            ReactDOM.unmountComponentAtNode(this.refs.renderBillingSerie);
            ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={defaults.billingSeries}
                defaultValueName={defaults.billingSeriesName} valueChanged={(value) => {
                    this.currentSelectedBillingSerieId = value;
                }} disabled={this.note != null} />, this.refs.renderBillingSerie);

            this.currentSelectedShippingAddress = defaults.mainBillingAddress;
            this.refs.billingAddress.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getPurchaseDeliveryNoteFromForm() {
        const deliveryNote = {};
        deliveryNote.supplier = parseInt(this.currentSelectedSupplierId);
        deliveryNote.shippingAddress = this.currentSelectedShippingAddress;
        deliveryNote.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        deliveryNote.billingSeries = this.currentSelectedBillingSerieId;
        deliveryNote.currency = parseInt(this.currentSelectedCurrencyId);
        deliveryNote.discountPercent = parseFloat(this.refs.discountPercent.value);
        deliveryNote.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        deliveryNote.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        deliveryNote.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        deliveryNote.warehouse = this.currentSelectedWarehouseId;
        return deliveryNote;
    }

    isValid(deliveryNote) {
        var errorMessage = "";
        if (deliveryNote.warehouse === null || deliveryNote.warehouse.length === 0) {
            errorMessage = "You must select a warehouse.";
            return errorMessage;
        }
        if (deliveryNote.supplier <= 0 || deliveryNote.supplier === null || isNaN(deliveryNote.supplier)) {
            errorMessage = "You must select a supplier.";
            return errorMessage;
        }
        if (deliveryNote.paymentMethod <= 0 || deliveryNote.paymentMethod === null || isNaN(deliveryNote.paymentMethod)) {
            errorMessage = "You must select a payment method.";
            return errorMessage;
        }
        if (deliveryNote.billingSeries.length === 0 || deliveryNote.billingSeries === null) {
            errorMessage = "You must select a billing series.";
            return errorMessage;
        }
        if (deliveryNote.currency <= 0 || deliveryNote.currency === null || isNaN(deliveryNote.currency)) {
            errorMessage = "You must select a currency.";
            return errorMessage;
        }
        if (deliveryNote.shippingAddress <= 0 || deliveryNote.shippingAddress === null || isNaN(deliveryNote.shippingAddress)) {
            errorMessage = "You must select a shipping address.";
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const deliveryNote = this.getPurchaseDeliveryNoteFromForm();
        const errorMessage = this.isValid(deliveryNote);
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

        this.addPurchaseDeliveryNotes(deliveryNote).then((ok) => {
            if (ok) {
                this.tabPurchaseDeliveryNotes();
            }
        });
    }

    delete() {
        this.deletePurchaseDeliveryNotes(this.note.id).then((ok) => {
            if (ok) {
                this.tabPurchaseDeliveryNotes();
            }
        });
    }

    render() {
        return <div id="tabPurchaseDeliveryNote" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h2>Purchase Delivery Note {this.note == null ? "" : this.note.id}</h2>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Date created</label>
                            <input type="text" class="form-control" readOnly={true}
                                defaultValue={this.note != null ? window.dateFormat(new Date(this.note.dateCreated)) : ''} />
                        </div>
                        <div class="col">
                            <label>Warehouse</label>
                            <AutocompleteField findByName={this.findWarehouseByName} defaultValueId={this.note != null ? this.note.warehouse : null}
                                defaultValueName={this.defaultValueNameWarehouse} valueChanged={(value) => {
                                    this.currentSelectedWarehouseId = value;
                                }} disabled={this.note != null} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Supplier</label>
                    <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.note != null ? this.note.customer : null}
                        defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                            this.currentSelectedSupplierId = value;
                            this.customerDefaults();
                        }} disabled={this.note != null} />
                </div>
                <div class="col">
                    <label>Shipping Address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Order Number</label>
                            <input type="number" class="form-control" defaultValue={this.note != null ? this.note.deliveryNoteNumber : ''} readOnly={true} />
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
                                defaultValue={this.note != null ? this.note.currencyChange : ''} />
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
                        <input type="number" class="form-control" defaultValue={this.note != null ? this.note.totalProducts : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>VAT amount</label>
                        <input type="number" class="form-control" defaultValue={this.note != null ? this.note.vatAmount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Discount percent</label>
                        <input type="number" class="form-control" ref="discountPercent"
                            defaultValue={this.note != null ? this.note.discountPercent : '0'}
                            readOnly={this.note != null} />
                    </div>
                    <div class="col">
                        <label>Fix discount</label>
                        <input type="number" class="form-control" ref="fixDiscount"
                            defaultValue={this.note != null ? this.note.fixDiscount : '0'}
                            readOnly={this.note != null} />
                    </div>
                    <div class="col">
                        <label>Shipping price</label>
                        <input type="number" class="form-control" ref="shippingPrice"
                            defaultValue={this.note != null ? this.note.shippingPrice : '0'}
                            readOnly={this.note != null} />
                    </div>
                    <div class="col">
                        <label>Shipping discount</label>
                        <input type="number" class="form-control" ref="shippingDiscount"
                            defaultValue={this.note != null ? this.note.shippingDiscount : '0'}
                            readOnly={this.note != null} />
                    </div>
                    <div class="col">
                        <label>Total with discount</label>
                        <input type="number" class="form-control" defaultValue={this.note != null ? this.note.totalWithDiscount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Total amount</label>
                        <input type="number" class="form-control" defaultValue={this.note != null ? this.note.totalAmount : '0'}
                            readOnly={true} />
                    </div>
                </div>

                <div>
                    {this.note != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabPurchaseDeliveryNotes}>Cancel</button>
                    {this.note == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                </div>
            </div>
        </div>
    }
}

export default PurchaseDeliveryNotesForm;
