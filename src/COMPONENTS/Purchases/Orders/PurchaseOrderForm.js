import { Component } from "react";
import ReactDOM from 'react-dom';
import './../../../CSS/sales_order.css';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseOrderDetails from "./PurchaseOrderDetails";
import PurchaseOrderDescription from "./PurchaseOrderDescription";
import PurchaseOrderGenerate from "./PurchaseOrderGenerate";
import PurchaseOrderRelations from "./PurchaseOrderRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";
import ReportModal from "../../ReportModal";
import EmailModal from "../../EmailModal";



class PurchaseOrderForm extends Component {
    constructor({ order, findSupplierByName, defaultValueNameSupplier, findPaymentMethodByName, defaultValueNamePaymentMethod, findCurrencyByName,
        defaultValueNameCurrency, findBillingSerieByName, defaultValueNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders,
        addPurchaseOrder, defaultValueNameBillingAddress, defaultValueNameShippingAddress, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails,
        addPurchaseOrderDetail, updatePurchaseOrderDetail, getNameProduct, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail,
        getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder,
        getPurchaseOrderRelations, deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, defaultValueNameCarrier,
        findWarehouseByName, defaultValueNameWarehouse, defaultWarehouse, documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail }) {
        super();

        this.order = order;

        this.findSupplierByName = findSupplierByName;
        this.defaultValueNameSupplier = defaultValueNameSupplier;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseOrders = tabPurchaseOrders;
        this.addPurchaseOrder = addPurchaseOrder;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
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
        this.defaultValueNameCarrier = defaultValueNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.defaultWarehouse = defaultWarehouse;
        this.documentFunctions = documentFunctions;
        this.getPurchaseOrderRow = getPurchaseOrderRow;
        this.getSupplierRow = getSupplierRow;
        this.sendEmail = sendEmail;

        this.currentSelectedSupplierId = order != null ? order.supplier : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethod : null;
        this.currentSelectedCurrencyId = order != null ? order.currency : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeries : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddress : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddress : null;
        this.currentSelectedWarehouseId = order != null ? order.warehouse : defaultWarehouse;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.customerDefaults = this.supplierDefaults.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabGenerate = this.tabGenerate.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.tabDescription = this.tabDescription.bind(this);
        this.report = this.report.bind(this);
        this.email = this.email.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.order != null ? this.order.paymentMethod : null}
            defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                this.currentSelectedPaymentMethodId = value;
            }} disabled={this.order !== undefined && this.order.invoicedLines !== 0} />, this.refs.renderPaymentMethod);

        ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.order != null ? this.order.currency : null}
            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                this.currentSelectedCurrencyId = value;
            }} disabled={this.order !== undefined && this.order.invoicedLines !== 0} />, this.refs.renderCurrency);

        ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.order != null ? this.order.billingSerie : null}
            defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                this.currentSelectedBillingSerieId = value;
            }} disabled={this.order !== undefined} />, this.refs.renderBillingSerie);

        this.tabs();
        this.tabDetails();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>Order details</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabGenerate}>Generate</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabRelations}>Relations</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#" onClick={this.tabDocuments}>Documents</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 4 ? " active" : "")} href="#" onClick={this.tabDescription}>Description</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<PurchaseOrderDetails
            orderId={this.order === undefined ? null : this.order.id}
            waiting={this.order !== undefined && this.order.invoicedLines === 0}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getPurchaseOrderDetails={this.getPurchaseOrderDetails}
            addPurchaseOrderDetail={(detail) => {
                return new Promise((resolve) => {
                    this.addPurchaseOrderDetail(detail).then((ok) => {
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
            updatePurchaseOrderDetail={(detail) => {
                return new Promise((resolve) => {
                    this.updatePurchaseOrderDetail(detail).then((ok) => {
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
            deletePurchaseOrderDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.deletePurchaseOrderDetail(detailId).then((ok) => {
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

    tabGenerate() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<PurchaseOrderGenerate
            orderId={this.order == null ? null : this.order.id}
            getPurchaseOrderDetails={this.getPurchaseOrderDetails}
            getNameProduct={this.getNameProduct}
            invoiceAllPurchaseOrder={this.invoiceAllPurchaseOrder}
            invoicePartiallyPurchaseOrder={this.invoicePartiallyPurchaseOrder}
            deliveryNoteAllPurchaseOrder={this.deliveryNoteAllPurchaseOrder}
            deliveryNotePartiallyPurchaseOrder={this.deliveryNotePartiallyPurchaseOrder}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<PurchaseOrderRelations
            orderId={this.order == null ? null : this.order.id}
            getPurchaseOrderRelations={this.getPurchaseOrderRelations}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            purchaseOrderId={this.order == null ? null : this.order.id}
            documentFunctions={this.documentFunctions}
        />, this.refs.render);
    }

    tabDescription() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<PurchaseOrderDescription
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

    supplierDefaults() {
        if (this.currentSelectedSupplierId === null || this.currentSelectedSupplierId === "") {
            return;
        }

        this.getSupplierDefaults(this.currentSelectedSupplierId).then((defaults) => {

            this.currentSelectedPaymentMethodId = defaults.paymentMethod;
            ReactDOM.unmountComponentAtNode(this.refs.renderPaymentMethod);
            ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={defaults.paymentMethod}
                defaultValueName={defaults.paymentMethodName} valueChanged={(value) => {
                    this.currentSelectedPaymentMethodId = value;
                }} disabled={this.order !== undefined && this.order.invoicedLines !== 0} />, this.refs.renderPaymentMethod);

            this.currentSelectedCurrencyId = defaults.currency;
            ReactDOM.unmountComponentAtNode(this.refs.renderCurrency);
            ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={defaults.currency}
                defaultValueName={defaults.currencyName} valueChanged={(value) => {
                    this.currentSelectedCurrencyId = value;
                }} disabled={this.order !== undefined && this.order.invoicedLines !== 0} />, this.refs.renderCurrency);

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            ReactDOM.unmountComponentAtNode(this.refs.renderBillingSerie);
            ReactDOM.render(<AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={defaults.billingSeries}
                defaultValueName={defaults.billingSeriesName} valueChanged={(value) => {
                    this.currentSelectedBillingSerieId = value;
                }} disabled={this.order !== undefined} />, this.refs.renderBillingSerie);

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
                    return this.locateAddress(this.currentSelectedSupplierId);
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
                    return this.locateAddress(this.currentSelectedSupplierId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddres.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    getPurchaseOrderFromForm() {
        const order = {};
        order.reference = this.refs.reference.value;
        order.supplier = parseInt(this.currentSelectedSupplierId);
        order.billingAddress = this.currentSelectedBillingAddress;
        order.shippingAddress = this.currentSelectedShippingAddress;
        order.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        order.billingSeries = this.currentSelectedBillingSerieId;
        order.warehouse = this.currentSelectedWarehouseId;
        order.currency = parseInt(this.currentSelectedCurrencyId);
        order.discountPercent = parseFloat(this.refs.discountPercent.value);
        order.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        order.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        order.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        order.notes = this.notes;
        order.description = this.description;
        return order;
    }

    isValid(order) {
        var errorMessage = "";
        if (order.warehouse === null || order.warehouse.length === 0) {
            errorMessage = "You must select a warehouse.";
            return errorMessage;
        }
        if (order.reference.length > 9) {
            errorMessage = "The reference can't be longer than 9 characters.";
            return errorMessage;
        }
        if (order.supplier === null || order.supplier <= 0 || isNaN(order.supplier)) {
            errorMessage = "You must select a supplier.";
            return errorMessage;
        }
        if (order.paymentMethod === null || order.paymentMethod <= 0 || isNaN(order.paymentMethod)) {
            errorMessage = "You must select a payment method.";
            return errorMessage;
        }
        if (order.billingSeries === null || order.billingSeries.length === 0) {
            errorMessage = "You must select a billing series.";
            return errorMessage;
        }
        if (order.currency === null || order.currency <= 0 || isNaN(order.currency)) {
            errorMessage = "You must select a currency.";
            return errorMessage;
        }
        if (order.billingAddress === null || order.billingAddress <= 0 || isNaN(order.billingAddress)) {
            errorMessage = "You must select a billing address.";
            return errorMessage;
        }
        if (order.shippingAddress === null || order.shippingAddress <= 0 || isNaN(order.shippingAddress)) {
            errorMessage = "You must select a shipping address.";
            return errorMessage;
        }
        if (order.notes.length > 250) {
            errorMessage = "The notes can't be longer than 250 characters.";
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const order = this.getPurchaseOrderFromForm();
        const errorMessage = this.isValid(order);
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

        this.addPurchaseOrder(order).then((ok) => {
            if (ok) {
                this.tabPurchaseOrders();
            }
        });
    }

    update() {
        const order = this.getPurchaseOrderFromForm();
        const errorMessage = this.isValid(order);
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
        order.id = this.order.id;

        this.updatePurchaseOrder(order).then((ok) => {
            if (ok) {
                this.tabPurchaseOrders();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deletePurchaseOrder(this.order.id).then((ok) => {
                        if (ok) {
                            this.tabPurchaseOrders();
                        }
                    });
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            // an order detail has been added, refresh the totals and status
            const order = await this.getPurchaseOrderRow(this.order.id);

            this.refs.totalProducts.value = order.totalProducts;
            this.refs.vatAmount.value = order.vatAmount;
            this.refs.totalWithDiscount.value = order.totalWithDiscount;
            this.refs.totalAmount.value = order.totalAmount;
            resolve();
        });
    }

    report() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ReportModal
                resource="PURCHASE_ORDER"
                documentId={this.order.id}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            document.getElementById('renderAddressModal'));
    }

    async email() {
        if (this.order == null) {
            return;
        }
        const supplier = await this.getSupplierRow(this.order.supplier);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={supplier.email}
                destinationAddressName={supplier.fiscalName}
                subject="Purchase order"
                reportId="PURCHASE_ORDER"
                reportDataId={this.order.id}
            />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div id="tabPurchaseOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h2>Purchase Order {this.order == null ? "" : this.order.id}</h2>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Supplier Reference</label>
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
                    <label>Supplier</label>
                    <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.order != null ? this.order.supplier : null}
                        defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                            this.currentSelectedSupplierId = value;
                            this.supplierDefaults();
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
                            <label>Date paid</label>
                            <input type="text" class="form-control"
                                defaultValue={this.order != null && this.order.datePaid != null ? window.dateFormat(this.order.datePaid) : ''}
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
                            <AutocompleteField findByName={this.findWarehouseByName}
                                defaultValueId={this.order != null ? this.order.warehouse : this.defaultWarehouse}
                                defaultValueName={this.defaultValueNameWarehouse} valueChanged={(value) => {
                                    this.currentSelectedWarehouseId = value;
                                }} disabled={this.order != null} />
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
                    <label>Invoice/Delivery Note</label>
                    <input type="text" class="form-control" defaultValue={this.order != null ? this.order.status : ''}
                        readOnly={true} />
                </div>
            </div>

            <div ref="tabs"></div>

            <div ref="render"></div>

            <div id="buttomBottomForm">
                <div class="form-row salesOrderTotals">
                    <div class="col">
                        <label>Total products</label>
                        <input type="number" class="form-control" ref="totalProducts" defaultValue={this.order !== undefined ? this.order.totalProducts : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>VAT amount</label>
                        <input type="number" class="form-control" ref="vatAmount" defaultValue={this.order !== undefined ? this.order.vatAmount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Discount percent</label>
                        <input type="number" class="form-control" ref="discountPercent"
                            defaultValue={this.order !== undefined ? this.order.discountPercent : '0'}
                            readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                    </div>
                    <div class="col">
                        <label>Fix discount</label>
                        <input type="number" class="form-control" ref="fixDiscount"
                            defaultValue={this.order !== undefined ? this.order.fixDiscount : '0'}
                            readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                    </div>
                    <div class="col">
                        <label>Shipping price</label>
                        <input type="number" class="form-control" ref="shippingPrice"
                            defaultValue={this.order !== undefined ? this.order.shippingPrice : '0'}
                            readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                    </div>
                    <div class="col">
                        <label>Shipping discount</label>
                        <input type="number" class="form-control" ref="shippingDiscount"
                            defaultValue={this.order !== undefined ? this.order.shippingDiscount : '0'}
                            readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                    </div>
                    <div class="col">
                        <label>Total with discount</label>
                        <input type="number" class="form-control" ref="totalWithDiscount"
                            defaultValue={this.order !== undefined ? this.order.totalWithDiscount : '0'}
                            readOnly={true} />
                    </div>
                    <div class="col">
                        <label>Total amount</label>
                        <input type="number" class="form-control" ref="totalAmount"
                            defaultValue={this.order !== undefined ? this.order.totalAmount : '0'}
                            readOnly={true} />
                    </div>
                </div>

                <div>
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Options
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onClick={this.report}>Report</a>
                            <a class="dropdown-item" href="#" onClick={this.email}>Email</a>
                        </div>
                    </div>
                    {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabPurchaseOrders}>Cancel</button>
                    {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    {this.order != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                </div>
            </div>
        </div>
    }
}

export default PurchaseOrderForm;
