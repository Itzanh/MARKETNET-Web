import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesDeliveryNoteDetails from "./SalesDeliveryNoteDetails";
import SalesDeliveryNotesRelations from "./SalesDeliveryNotesRelations";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";
import ReportModal from "../../ReportModal";
import EmailModal from "../../EmailModal";
import HighlightIcon from '@material-ui/icons/Highlight';
import LocateCustomer from "../../Masters/Customers/LocateCustomer";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class SalesDeliveryNotesForm extends Component {
    constructor({ note, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesDeliveryNotes, defaultValueNameCustomer,
        defaultValueNamePaymentMethod, defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameShippingAddress, findProductByName,
        getOrderDetailsDefaults, getSalesInvoiceDetails, getNameProduct, addSalesDeliveryNotes, deleteSalesDeliveryNotes, getSalesDeliveryNoteDetails,
        addWarehouseMovements, deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, defaultValueNameWarehouse, documentFunctions,
        getCustomerRow, sendEmail, getSalesDeliveryNoteRow, locateProduct, locateCustomers }) {
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
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = note != null ? defaultValueNameWarehouse : window.config.defaultWarehouseName;
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.getSalesDeliveryNoteRow = getSalesDeliveryNoteRow;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;

        this.currentSelectedCustomerId = note != null ? note.customer : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethod : null;
        this.currentSelectedCurrencyId = note != null ? note.currency : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeries : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddress : null;
        this.currentSelectedWarehouseId = note != null ? note.warehouse : window.config.defaultWarehouse;

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.report = this.report.bind(this);
        this.email = this.email.bind(this);
        this.locateCustomer = this.locateCustomer.bind(this);
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
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabDetails();
                        break;
                    }
                    case 1: {
                        this.tabRelations();
                        break;
                    }
                    case 2: {
                        this.tabDocuments();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('deliver-note-details')} />
                <Tab label={i18next.t('relations')} />
                <Tab label={i18next.t('documents')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetails(addNow) {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<SalesDeliveryNoteDetails
            addNow={addNow}
            noteId={this.note == null ? null : this.note.id}
            warehouseId={this.note == null ? null : this.note.warehouse}
            findProductByName={this.findProductByName}
            getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
            locateProduct={this.locateProduct}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
            addWarehouseMovements={(detail) => {
                if (this.note == null) {
                    this.add(true);
                    return;
                }
                return new Promise((resolve) => {
                    this.addWarehouseMovements(detail).then((ok) => {
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
            deleteWarehouseMovements={(detailId) => {
                return new Promise((resolve) => {
                    this.deleteWarehouseMovements(detailId).then((ok) => {
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
        ReactDOM.render(<SalesDeliveryNotesRelations
            noteId={this.note == null ? null : this.note.id}
            getSalesDeliveryNotesRelations={this.getSalesDeliveryNotesRelations}

        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            saleDeliveryNoteId={this.note == null ? null : this.note.id}
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
        if (this.currentSelectedCustomerId === "") {
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

    isValid(deliveryNote) {
        var errorMessage = "";
        if (deliveryNote.warehouse === null || deliveryNote.warehouse.length === 0) {
            errorMessage = i18next.t('no-warehouse'); i18next.t('')
            return errorMessage;
        }
        if (deliveryNote.customer === null || deliveryNote.customer <= 0 || isNaN(deliveryNote.customer)) {
            errorMessage = i18next.t('no-customer');
            return errorMessage;
        }
        if (deliveryNote.paymentMethod === null || deliveryNote.paymentMethod <= 0 || isNaN(deliveryNote.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (deliveryNote.billingSeries === null || deliveryNote.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (deliveryNote.currency === null || deliveryNote.currency <= 0 || isNaN(deliveryNote.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (deliveryNote.shippingAddress === null || deliveryNote.shippingAddress <= 0 || isNaN(deliveryNote.shippingAddress)) {
            errorMessage = i18next.t('no-shipping-address');
            return errorMessage;
        }
        return errorMessage;
    }

    add(addNow = false) {
        const deliveryNote = this.getSalesDeliveryNoteFromForm();
        const errorMessage = this.isValid(deliveryNote);
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

        this.addSalesDeliveryNotes(deliveryNote).then((note) => {
            if (note != null) {
                this.note = note;
                this.forceUpdate();
                this.tabDetails(addNow);
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteSalesDeliveryNotes(this.note.id).then((ok) => {
                        if (ok) {
                            this.tabSalesDeliveryNotes();
                        }
                    });
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    report() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ReportModal
                resource="SALES_DELIVERY_NOTE"
                documentId={this.note.id}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            document.getElementById('renderAddressModal'));
    }

    async email() {
        if (this.note == null) {
            return;
        }
        const customer = await this.getCustomerRow(this.note.customer);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={customer.email}
                destinationAddressName={customer.fiscalName}
                subject="Sales delivery note"
                reportId="SALES_DELIVERY_NOTE"
                reportDataId={this.note.id}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            const note = await this.getSalesDeliveryNoteRow(this.note.id);

            this.refs.totalProducts.value = note.totalProducts;
            this.refs.vatAmount.value = note.vatAmount;
            this.refs.totalWithDiscount.value = note.totalWithDiscount;
            this.refs.totalAmount.value = note.totalAmount;
            resolve();
        });
    }

    locateCustomer() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<LocateCustomer
            locateCustomers={this.locateCustomers}
            onSelect={(customer) => {
                this.currentSelectedCustomerId = customer.id;
                this.refs.customerName.value = customer.name;
                this.customerDefaults();
            }}
        />, document.getElementById("renderAddressModal"));
    }

    render() {
        return <div id="tabSaleDeliveryNote" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('sales-delivery-note')} {this.note == null ? "" : this.note.id}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('date-created')}</label>
                            <input type="text" class="form-control" readOnly={true}
                                defaultValue={this.note != null ? window.dateFormat(new Date(this.note.dateCreated)) : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('warehouse')}</label>
                            <AutocompleteField findByName={this.findWarehouseByName} defaultValueId={this.note != null ? this.note.warehouse : null}
                                defaultValueName={this.defaultValueNameWarehouse} valueChanged={(value) => {
                                    this.currentSelectedWarehouseId = value;
                                }} disabled={this.note != null} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('customer')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}
                                disabled={this.note != null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="customerName" defaultValue={this.defaultValueNameCustomer}
                            readOnly={true} style={{ 'width': '90%' }} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('shipping-address')}</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('delivery-note-number')}</label>
                            <input type="number" class="form-control" defaultValue={this.note != null ? this.note.deliveryNoteNumber : ''} readOnly={true} />
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
                                defaultValue={this.note != null ? this.note.currencyChange : ''} />
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
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.note != null ? this.note.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-amount')}</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.note != null ? this.note.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('discount-percent')}</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.note != null ? this.note.discountPercent : '0'}
                                readOnly={this.note != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fix-discount')}</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.note != null ? this.note.fixDiscount : '0'}
                                readOnly={this.note != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-price')}</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.note != null ? this.note.shippingPrice : '0'}
                                readOnly={this.note != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-discount')}</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.note != null ? this.note.shippingDiscount : '0'}
                                readOnly={this.note != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-with-discount')}</label>
                            <input type="number" class="form-control" ref="totalWithDiscount" defaultValue={this.note != null ? this.note.totalWithDiscount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.note != null ? this.note.totalAmount : '0'}
                                readOnly={true} />
                        </div>
                    </div>

                    <div>
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {i18next.t('options')}
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onClick={this.report}>{i18next.t('report')}</a>
                                <a class="dropdown-item" href="#" onClick={this.email}>{i18next.t('email')}</a>
                            </div>
                        </div>
                        {this.note != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabSalesDeliveryNotes}>{i18next.t('cancel')}</button>
                        {this.note == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesDeliveryNotesForm;
