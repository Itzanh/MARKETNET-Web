import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import './../../../CSS/sales_order.css';

import AutocompleteField from "../../AutocompleteField";
import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesOrderDetails from "./SalesOrderDetails";
import SalesOrderGenerate from "./SalesOrderGenerate";
import SalesOrderDiscounts from "./SalesOrderDiscounts";
import SalesOrderRelations from "./SalesOrderRelations";
import SalesOrderDescription from "./SalesOrderDescription";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";
import ReportModal from "../../ReportModal";
import EmailModal from "../../EmailModal";

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer'
}

class SalesOrderForm extends Component {
    constructor({ order, findCustomerByName, defaultValueNameCustomer, findPaymentMethodByName, defaultValueNamePaymentMethod, findCurrencyByName,
        defaultValueNameCurrency, findBillingSerieByName, defaultValueNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder,
        defaultValueNameBillingAddress, defaultValueNameShippingAddress, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail,
        updateSalesOrderDetail, getNameProduct, updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts,
        deleteSalesOrderDiscounts, invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder, deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName, defaultValueNameCarrier,
        findWarehouseByName, defaultValueNameWarehouse, defaultWarehouse, documentFunctions, getSalesOrderRow, getCustomerRow, sendEmail }) {
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
        this.updateSalesOrderDetail = updateSalesOrderDetail;
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
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;
        this.findCarrierByName = findCarrierByName;
        this.defaultValueNameCarrier = defaultValueNameCarrier;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.defaultWarehouse = defaultWarehouse;
        this.documentFunctions = documentFunctions;
        this.getSalesOrderRow = getSalesOrderRow;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;

        this.currentSelectedCustomerId = order != null ? order.customer : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethod : null;
        this.currentSelectedCurrencyId = order != null ? order.currency : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeries : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddress : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddress : null;
        this.currentSelectedCarrierId = order != null ? order.carrier : null;
        this.currentSelectedWarehouseId = order != null ? order.warehouse : defaultWarehouse;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.customerDefaults = this.customerDefaults.bind(this);
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
        this.tabDiscounts = this.tabDiscounts.bind(this);
        this.report = this.report.bind(this);
        this.email = this.email.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.order != null ? this.order.paymentMethod : null}
            defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                this.currentSelectedPaymentMethodId = value;
            }} disabled={this.order !== undefined && this.order.status !== "_"} />, this.refs.renderPaymentMethod);

        ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={this.order != null ? this.order.currency : null}
            defaultValueName={this.defaultValueNameCurrency} valueChanged={(value) => {
                this.currentSelectedCurrencyId = value;
            }} disabled={this.order !== undefined && this.order.status !== "_"} />, this.refs.renderCurrency);

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
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>{i18next.t('order-details')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabGenerate}>{i18next.t('generate')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabRelations}>{i18next.t('relations')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#" onClick={this.tabDocuments}>{i18next.t('documents')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 4 ? " active" : "")} href="#" onClick={this.tabDescription}>{i18next.t('description')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 5 ? " active" : "")} href="#" onClick={this.tabDiscounts}>{i18next.t('discounts')}</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<SalesOrderDetails
            orderId={this.order === undefined ? null : this.order.id}
            waiting={this.order !== undefined && this.order.status === "_"}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesOrderDetails={this.getSalesOrderDetails}
            addSalesOrderDetail={(detail) => {
                return new Promise((resolve) => {
                    this.addSalesOrderDetail(detail).then((ok) => {
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
            updateSalesOrderDetail={(detail) => {
                return new Promise((resolve) => {
                    this.updateSalesOrderDetail(detail).then((ok) => {
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
            deleteSalesOrderDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.deleteSalesOrderDetail(detailId).then((ok) => {
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
        ReactDOM.render(<SalesOrderGenerate
            orderId={this.order === undefined ? null : this.order.id}
            getSalesOrderDetails={this.getSalesOrderDetails}
            getNameProduct={this.getNameProduct}
            invoiceAllSaleOrder={this.invoiceAllSaleOrder}
            invoiceSelectionSaleOrder={this.invoiceSelectionSaleOrder}
            manufacturingOrderAllSaleOrder={this.manufacturingOrderAllSaleOrder}
            manufacturingOrderPartiallySaleOrder={this.manufacturingOrderPartiallySaleOrder}
            deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
            deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<SalesOrderRelations
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderRelations={this.getSalesOrderRelations}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            saleOrderId={this.order == null ? null : this.order.id}
            documentFunctions={this.documentFunctions}
        />, this.refs.render);
    }

    tabDescription() {
        this.tab = 4;
        this.tabs();
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
        this.tab = 5;
        this.tabs();
        ReactDOM.render(<SalesOrderDiscounts
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderDiscounts={this.getSalesOrderDiscounts}
            addSalesOrderDiscounts={(discount) => {
                return new Promise((resolve) => {
                    this.addSalesOrderDiscounts(discount).then((ok) => {
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
            deleteSalesOrderDiscounts={(discountId) => {
                return new Promise((resolve) => {
                    this.deleteSalesOrderDiscounts(discountId).then((ok) => {
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

    customerDefaults() {
        if (this.currentSelectedCustomerId === null || this.currentSelectedCustomerId === "") {
            return;
        }

        this.getCustomerDefaults(this.currentSelectedCustomerId).then((defaults) => {

            this.currentSelectedPaymentMethodId = defaults.paymentMethod;
            ReactDOM.unmountComponentAtNode(this.refs.renderPaymentMethod);
            ReactDOM.render(<AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={defaults.paymentMethod}
                defaultValueName={defaults.paymentMethodName} valueChanged={(value) => {
                    this.currentSelectedPaymentMethodId = value;
                }} disabled={this.order !== undefined && this.order.status !== "_"} />, this.refs.renderPaymentMethod);

            this.currentSelectedCurrencyId = defaults.currency;
            ReactDOM.unmountComponentAtNode(this.refs.renderCurrency);
            ReactDOM.render(<AutocompleteField findByName={this.findCurrencyByName} defaultValueId={defaults.currency}
                defaultValueName={defaults.currencyName} valueChanged={(value) => {
                    this.currentSelectedCurrencyId = value;
                }} disabled={this.order !== undefined && this.order.status !== "_"} />, this.refs.renderCurrency);

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
        salesOrder.warehouse = this.currentSelectedWarehouseId;
        salesOrder.currency = parseInt(this.currentSelectedCurrencyId);
        salesOrder.discountPercent = parseFloat(this.refs.discountPercent.value);
        salesOrder.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        salesOrder.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        salesOrder.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        salesOrder.notes = this.notes;
        salesOrder.description = this.description;
        if (this.currentSelectedCarrierId === undefined || this.currentSelectedCarrierId === "" || this.currentSelectedCarrierId === 0) {
            salesOrder.carrier = null;
        } else {
            salesOrder.carrier = parseInt(this.currentSelectedCarrierId);
        }
        return salesOrder;
    }

    isValid(salesOrder) {
        var errorMessage = "";
        if (salesOrder.warehouse === null || salesOrder.warehouse.length === 0) {
            errorMessage = i18next.t('no-warehouse');
            return errorMessage;
        }
        if (salesOrder.reference.length > 9) {
            errorMessage = i18next.t('reference-9');
            return errorMessage;
        }
        if (salesOrder.customer === null || salesOrder.customer <= 0 || isNaN(salesOrder.customer)) {
            errorMessage = i18next.t('no-customer');
            return errorMessage;
        }
        if (salesOrder.paymentMethod === null || salesOrder.paymentMethod <= 0 || isNaN(salesOrder.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (salesOrder.billingSeries === null || salesOrder.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (salesOrder.currency === null || salesOrder.currency <= 0 || isNaN(salesOrder.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (salesOrder.billingAddress === null || salesOrder.billingAddress <= 0 || isNaN(salesOrder.billingAddress)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        if (salesOrder.shippingAddress === null || salesOrder.shippingAddress <= 0 || isNaN(salesOrder.shippingAddress)) {
            errorMessage = i18next.t('no-shipping-addres');
            return errorMessage;
        }
        if (salesOrder.notes.length > 250) {
            errorMessage = i18next.t('notes-250');
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const salesOrder = this.getSalesOrderFromForm();
        const errorMessage = this.isValid(salesOrder);
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

        this.addSalesOrder(salesOrder).then((ok) => {
            if (ok) {
                this.tabSalesOrders();
            }
        });
    }

    update() {
        const salesOrder = this.getSalesOrderFromForm();
        const errorMessage = this.isValid(salesOrder);
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
        salesOrder.id = this.order.id;

        this.updateSalesOrder(salesOrder).then((ok) => {
            if (ok) {
                this.tabSalesOrders();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteSalesOrder(this.order.id).then((ok) => {
                        if (ok) {
                            this.tabSalesOrders();
                        }
                    });
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            // an order detail or a discount has been added, refresh the totals and status
            const order = await this.getSalesOrderRow(this.order.id);

            this.refs.status.value = saleOrderStates[order.status];
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
                resource="SALES_ORDER"
                documentId={this.order.id}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            document.getElementById('renderAddressModal'));
    }

    async email() {
        if (this.order == null) {
            return;
        }
        const customer = await this.getCustomerRow(this.order.customer);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={customer.email}
                destinationAddressName={customer.fiscalName}
                subject="Sales order"
                reportId="SALES_ORDER"
                reportDataId={this.order.id}
            />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div id="tabSaleOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('sale-order')} {this.order == null ? "" : this.order.id}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('reference')}</label>
                            <input type="text" class="form-control" ref="reference" defaultValue={this.order != null ? this.order.reference : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('date-created')}</label>
                            <input type="text" class="form-control" readOnly={true}
                                defaultValue={this.order != null ? window.dateFormat(new Date(this.order.dateCreated)) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('customer')}</label>
                    <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.order != null ? this.order.customer : null}
                        defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                            this.currentSelectedCustomerId = value;
                            this.customerDefaults();
                        }} />
                </div>
                <div class="col">
                    <label>{i18next.t('billing-address')}</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}>{i18next.t('LOCATE')}</button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameBillingAddress} readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('order-number')}</label>
                            <input type="number" class="form-control" defaultValue={this.order != null ? this.order.orderNumber : ''} readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('date-payment-accepted')}</label>
                            <input type="text" class="form-control"
                                defaultValue={this.order != null && this.order.datePaymetAccepted != null ? window.dateFormat(this.order.datePaymetAccepted) : ''}
                                readOnly={true} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('payment-method')}</label>
                            <div ref="renderPaymentMethod">

                            </div>
                        </div>
                        <div class="col">
                            <label>{i18next.t('carrier')}</label>
                            <AutocompleteField findByName={this.findCarrierByName} defaultValueId={this.order != null ? this.order.carrier : null}
                                defaultValueName={this.defaultValueNameCarrier} valueChanged={(value) => {
                                    this.currentSelectedCarrierId = value;
                                }} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('shipping-address')}</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}>{i18next.t('LOCATE')}</button>
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
                            <label>{i18next.t('billing-serie')}</label>
                            <div ref="renderBillingSerie">

                            </div>
                        </div>
                        <div class="col">
                            <label>{i18next.t('warehouse')}</label>
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
                            <label>{i18next.t('currency')}</label>
                            <div ref="renderCurrency">

                            </div>
                        </div>
                        <div class="col">
                            <label>{i18next.t('currency-exchange')}</label>
                            <input type="number" class="form-control" ref="currencyChange" readOnly={true}
                                defaultValue={this.order != null ? this.order.currencyChange : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('status')}</label>
                    <input type="text" class="form-control" ref="status" defaultValue={this.order != null ? i18next.t(saleOrderStates[this.order.status]) : ''}
                        readOnly={true} />
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="form-row salesOrderTotals">
                        <div class="col">
                            <label>{i18next.t('total-products')}</label>
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.order != null ? this.order.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-amount')}</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.order != null ? this.order.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('discount-percent')}</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.order !== undefined ? this.order.discountPercent : '0'}
                                readOnly={this.order !== undefined && this.order.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fix-discount')}</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.order !== undefined ? this.order.fixDiscount : '0'}
                                readOnly={this.order !== undefined && this.order.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-price')}</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.order !== undefined ? this.order.shippingPrice : '0'}
                                readOnly={this.order !== undefined && this.order.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-discount')}</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.order !== undefined ? this.order.shippingDiscount : '0'}
                                readOnly={this.order !== undefined && this.order.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-with-discount')}</label>
                            <input type="number" class="form-control" ref="totalWithDiscount"
                                defaultValue={this.order !== undefined ? this.order.totalWithDiscount : '0'} readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.order !== undefined ? this.order.totalAmount : '0'}
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
                        {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabSalesOrders}>{i18next.t('cancel')}</button>
                        {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.order != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesOrderForm;
