import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesInvoiceRelations from "./../Invoice/SalesInvoiceRelations";
import SalesDeliveryNoteDetails from "./SalesDeliveryNoteDetails";

class SalesDeliveryNotesForm extends Component {
    constructor({ note, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesDeliveryNotes, defaultValueNameCustomer,
        defaultValueNamePaymentMethod, defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameShippingAddress, findProductByName,
        getOrderDetailsDefaults, getSalesInvoiceDetails, getNameProduct, addSalesDeliveryNotes, deleteSalesDeliveryNotes, getSalesDeliveryNoteDetails,
        addWarehouseMovements, deleteWarehouseMovements }) {
        super();

        this.note = note;

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
        this.tabSalesDeliveryNotes = tabSalesDeliveryNotes;

        this.defaultValueNameCustomer = defaultValueNameCustomer;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.getNameProduct = getNameProduct;
        this.addSalesDeliveryNotes = addSalesDeliveryNotes;
        this.deleteSalesDeliveryNotes = deleteSalesDeliveryNotes;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;

        this.currentSelectedCustomerId = note != null ? note.customer : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethod : null;
        this.currentSelectedCurrencyId = note != null ? note.currency : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeries : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddress : null;

        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
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

        this.tabDetails();
    }

    tabDetails() {
        ReactDOM.render(<SalesDeliveryNoteDetails
            noteId={this.note == null ? null : this.note.id}
            warehouseId={this.note == null ? null : this.note.warehouse}
            findProductByName={this.findProductByName}
            getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
            addSalesInvoiceDetail={this.addSalesInvoiceDetail}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
            findProductByName={this.findProductByName}
            getNameProduct={this.getNameProduct}
            addWarehouseMovements={this.addWarehouseMovements}
            deleteWarehouseMovements={this.deleteWarehouseMovements}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabRelations() {
        ReactDOM.render(<SalesInvoiceRelations
            invoiceId={this.note == null ? null : this.note.id}
            getSalesInvoiceRelations={this.getSalesInvoiceRelations}
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
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
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

    getSalesDeliveryNoteFromForm() {
        const deliveryNote = {};
        deliveryNote.customer = parseInt(this.currentSelectedCustomerId);
        deliveryNote.shippingAddress = this.currentSelectedShippingAddress;
        deliveryNote.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        deliveryNote.billingSeries = this.currentSelectedBillingSerieId;
        deliveryNote.currency = parseInt(this.currentSelectedCurrencyId);
        deliveryNote.discountPercent = parseFloat(this.refs.discountPercent.value);
        deliveryNote.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        deliveryNote.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        deliveryNote.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        deliveryNote.warehouse = "W1";
        return deliveryNote;
    }

    add() {
        this.addSalesDeliveryNotes(this.getSalesDeliveryNoteFromForm()).then((ok) => {
            if (ok) {
                this.tabSalesDeliveryNotes();
            }
        });
    }

    delete() {
        this.deleteSalesDeliveryNotes(this.note.id).then((ok) => {
            if (ok) {
                this.tabSalesDeliveryNotes();
            }
        });
    }

    render() {
        return <div id="tabSaleInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h2>Sale Delivery Note {this.note == null ? "" : this.note.id}</h2>
            <div class="form-row">
                <div class="col">
                    <label>Date created</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.note != null ? window.dateFormat(new Date(this.note.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>Customer</label>
                    <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.note != null ? this.note.customer : null}
                        defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                            this.currentSelectedCustomerId = value;
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
                    <button type="button" class="btn btn-secondary" onClick={this.tabSalesDeliveryNotes}>Cancel</button>
                    {this.note == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                </div>
            </div>
        </div>
    }
}

export default SalesDeliveryNotesForm;