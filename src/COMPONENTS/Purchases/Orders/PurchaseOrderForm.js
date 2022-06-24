/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import './../../../CSS/sales_order.css';

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
import LocateSupplier from "../../Masters/Suppliers/LocateSupplier";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SupplierForm from "../../Masters/Suppliers/SupplierForm";
import AddressModal from "../../Masters/Addresses/AddressModal";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class PurchaseOrderForm extends Component {
    constructor({ order, findSupplierByName, findPaymentMethodByName, findCurrencyByName, findBillingSerieByName, getSupplierDefaults, locateAddress,
        tabPurchaseOrders, addPurchaseOrder, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails, addPurchaseOrderDetail,
        updatePurchaseOrderDetail, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail, cancelPurchaseOrderDetail, getSalesOrderDiscounts,
        addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder, getPurchaseOrderRelations,
        deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail,
        locateSuppliers, locateProduct, getSalesOrderDetailsFromPurchaseOrderDetail, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getRegisterTransactionalLogs, getComplexManufacturingOrdersFromPurchaseOrderDetail, getSupplierFuntions, getAddressesFunctions,
        getPurcaseInvoicesFunctions, getPurchaseDeliveryNotesFunctions, getProductFunctions, getComplexManufacturingOrerFunctions }) {
        super();

        this.order = order;

        this.findSupplierByName = findSupplierByName;
        this.defaultValueNameSupplier = this.order == null ? '' : this.order.supplier.name;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseOrders = tabPurchaseOrders;
        this.addPurchaseOrder = addPurchaseOrder;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.updatePurchaseOrderDetail = updatePurchaseOrderDetail;
        this.updatePurchaseOrder = updatePurchaseOrder;
        this.deletePurchaseOrder = deletePurchaseOrder;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.cancelPurchaseOrderDetail = cancelPurchaseOrderDetail;
        this.getSalesOrderDiscounts = getSalesOrderDiscounts;
        this.addSalesOrderDiscounts = addSalesOrderDiscounts;
        this.deleteSalesOrderDiscounts = deleteSalesOrderDiscounts;
        this.invoiceAllPurchaseOrder = invoiceAllPurchaseOrder;
        this.invoicePartiallyPurchaseOrder = invoicePartiallyPurchaseOrder;
        this.getPurchaseOrderRelations = getPurchaseOrderRelations;
        this.deliveryNoteAllPurchaseOrder = deliveryNoteAllPurchaseOrder;
        this.deliveryNotePartiallyPurchaseOrder = deliveryNotePartiallyPurchaseOrder;
        this.findCarrierByName = findCarrierByName;
        this.documentFunctions = documentFunctions;
        this.getPurchaseOrderRow = getPurchaseOrderRow;
        this.getSupplierRow = getSupplierRow;
        this.sendEmail = sendEmail;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSalesOrderDetailsFromPurchaseOrderDetail = getSalesOrderDetailsFromPurchaseOrderDetail;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getComplexManufacturingOrdersFromPurchaseOrderDetail = getComplexManufacturingOrdersFromPurchaseOrderDetail;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;
        this.getPurchaseDeliveryNotesFunctions = getPurchaseDeliveryNotesFunctions;
        this.getProductFunctions = getProductFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;

        this.currentSelectedSupplierId = order != null ? order.supplierId : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethodId : null;
        this.currentSelectedCurrencyId = order != null ? order.currencyId : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeriesId : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddressId : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddressId : null;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.tab = 0;

        this.reference = React.createRef();
        this.supplierName = React.createRef();
        this.billingAddress = React.createRef();
        this.shippingAddress = React.createRef();
        this.currencyChange = React.createRef();
        this.status = React.createRef();

        this.totalProducts = React.createRef();
        this.vatAmount = React.createRef();
        this.discountPercent = React.createRef();
        this.fixDiscount = React.createRef();
        this.shippingPrice = React.createRef();
        this.shippingDiscount = React.createRef();
        this.totalWithDiscount = React.createRef();
        this.totalAmount = React.createRef();

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
        this.locateSupplier = this.locateSupplier.bind(this);
        this.editSupplier = this.editSupplier.bind(this);
        this.addSupplier = this.addSupplier.bind(this);
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addBillingAddr = this.addBillingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.editBillingAddr = this.editBillingAddr.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPurchaseOrderPaymentMethod();
        await this.renderBilingSeries();
        this.tabs();
        this.tabDetails();
    }

    renderCurrencies() {
        return new Promise((resolve) => {
            this.locateCurrency().then((currencies) => {
                resolve();
                const components = currencies.map((currency, i) => {
                    return <option key={i + 1} value={currency.id}>{currency.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderPurchaseOrderCurrency"));

                document.getElementById("renderPurchaseOrderCurrency").disabled = this.order !== undefined && this.order.status !== "_";
                document.getElementById("renderPurchaseOrderCurrency").value = this.order != null ? "" + this.order.currencyId : "0";
            });
        });
    }

    renderPurchaseOrderPaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderPurchaseOrderPaymentMethod"));

                document.getElementById("renderPurchaseOrderPaymentMethod").disabled = this.order !== undefined && this.order.status !== "_";
                document.getElementById("renderPurchaseOrderPaymentMethod").value = this.order != null ? this.order.paymentMethodId : "0";
            });
        });
    }

    renderBilingSeries() {
        return new Promise((resolve) => {
            this.locateBillingSeries().then((series) => {
                resolve();
                const components = series.map((serie, i) => {
                    return <option key={i + 1} value={serie.id}>{serie.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderPurchaseOrderBillingSerie"));

                document.getElementById("renderPurchaseOrderBillingSerie").disabled = this.order !== undefined;
                document.getElementById("renderPurchaseOrderBillingSerie").value = this.order != null ? this.order.billingSeriesId : "0";
            });
        });
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabDetails();
                        break;
                    }
                    case 1: {
                        this.tabGenerate();
                        break;
                    }
                    case 2: {
                        this.tabRelations();
                        break;
                    }
                    case 3: {
                        this.tabDocuments();
                        break;
                    }
                    case 4: {
                        this.tabDescription();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('order-details')} />
                <Tab label={i18next.t('generate')} />
                <Tab label={i18next.t('relations')} />
                <Tab label={i18next.t('documents')} />
                <Tab label={i18next.t('description')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetails(addNow = false) {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<PurchaseOrderDetails
            addNow={addNow}
            orderId={this.order === undefined ? null : this.order.id}
            waiting={this.order !== undefined && this.order.invoicedLines === 0}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getPurchaseOrderDetails={this.getPurchaseOrderDetails}
            locateProduct={this.locateProduct}
            getSalesOrderDetailsFromPurchaseOrderDetail={this.getSalesOrderDetailsFromPurchaseOrderDetail}
            getProductFunctions={this.getProductFunctions}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            getComplexManufacturingOrdersFromPurchaseOrderDetail={this.getComplexManufacturingOrdersFromPurchaseOrderDetail}
            getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
            addPurchaseOrderDetail={(detail) => {
                if (this.order == null) {
                    this.add(true);
                    return;
                }
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
            cancelPurchaseOrderDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.cancelPurchaseOrderDetail(detailId).then((ok) => {
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
            invoiceAllPurchaseOrder={(orderId) => {
                return new Promise((resolve) => {
                    this.invoiceAllPurchaseOrder(orderId).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            invoicePartiallyPurchaseOrder={(selection) => {
                return new Promise((resolve) => {
                    this.invoicePartiallyPurchaseOrder(selection).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            deliveryNoteAllPurchaseOrder={this.deliveryNoteAllPurchaseOrder}
            deliveryNotePartiallyPurchaseOrder={this.deliveryNotePartiallyPurchaseOrder}
        />, this.refs.render);
    }

    async refreshOrder() {
        const order = await this.getPurchaseOrderRow(this.order.id);
        this.order = order;
        this.forceUpdate();
        await this.renderCurrencies();
        await this.renderPurchaseOrderPaymentMethod();
        await this.renderBilingSeries();
    }

    tabRelations() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<PurchaseOrderRelations
            orderId={this.order == null ? null : this.order.id}
            getPurchaseOrderRelations={this.getPurchaseOrderRelations}
            getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
            getPurchaseDeliveryNotesFunctions={this.getPurchaseDeliveryNotesFunctions}
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
            document.getElementById("renderPurchaseOrderPaymentMethod").value = defaults.paymentMethod == null ? '0' : defaults.paymentMethod;
            document.getElementById("renderPurchaseOrderPaymentMethod").disabled = this.order !== undefined && this.order.invoicedLines !== 0;

            this.currentSelectedCurrencyId = defaults.currency;
            this.currencyChange.current.value = defaults.currencyChange;
            document.getElementById("renderPurchaseOrderCurrency").value = defaults.currency == null ? "0" : defaults.currency;
            document.getElementById("renderPurchaseOrderCurrency").disabled = this.order !== undefined && this.order.invoicedLines !== 0;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            document.getElementById("renderPurchaseOrderBillingSerie").value = defaults.billingSeries == null ? '' : defaults.billingSeries;
            document.getElementById("renderPurchaseOrderBillingSerie").disabled = this.order !== undefined;

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.billingAddress.current.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
            this.shippingAddress.current.value = defaults.mainShippingAddressName;
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
                    this.billingAddress.current.value = addressName;
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
                    this.shippingAddress.current.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    getPurchaseOrderFromForm() {
        const order = {};
        order.reference = this.reference.current.value;
        order.supplierId = parseInt(this.currentSelectedSupplierId);
        order.billingAddressId = this.currentSelectedBillingAddress;
        order.shippingAddressId = this.currentSelectedShippingAddress;
        order.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        order.billingSeriesId = this.currentSelectedBillingSerieId;
        order.currencyId = parseInt(this.currentSelectedCurrencyId);
        order.discountPercent = parseFloat(this.discountPercent.current.value);
        order.fixDiscount = parseFloat(this.fixDiscount.current.value);
        order.shippingPrice = parseFloat(this.shippingPrice.current.value);
        order.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        order.notes = this.notes;
        order.description = this.description;
        return order;
    }

    isValid(order) {
        var errorMessage = "";
        if (order.reference.length > 9) {
            errorMessage = i18next.t('reference-9');
            return errorMessage;
        }
        if (order.supplierId === null || order.supplierId <= 0 || isNaN(order.supplierId)) {
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (order.paymentMethodId === null || order.paymentMethodId <= 0 || isNaN(order.paymentMethodId)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (order.billingSeriesId === null || order.billingSeriesId.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (order.currencyId === null || order.currencyId <= 0 || isNaN(order.currencyId)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (order.billingAddressId === null || order.billingAddressId <= 0 || isNaN(order.billingAddressId)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        if (order.shippingAddressId === null || order.shippingAddressId <= 0 || isNaN(order.shippingAddressId)) {
            errorMessage = i18next.t('no-shipping-address');
            return errorMessage;
        }
        if (order.notes.length > 250) {
            errorMessage = i18next.t('notes-250');
            return errorMessage;
        }
        return errorMessage;
    }

    add(addNow = false) {
        const order = this.getPurchaseOrderFromForm();
        const errorMessage = this.isValid(order);
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

        this.addPurchaseOrder(order).then((order) => {
            if (order != null) {
                this.order = order;
                this.forceUpdate();
                this.tabDetails(addNow);
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
                    modalTitle={i18next.t('VALIDATION-ERROR')}
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
                        if (ok.ok) {
                            this.tabPurchaseOrders();
                        } else {
                            switch (ok.errorCode) {
                                case 1: {
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={i18next.t('the-order-is-already-invoiced')}
                                    />, document.getElementById('renderAddressModal'));
                                    break;
                                }
                                case 2: {
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={i18next.t('the-order-has-delivery-notes-generated')}
                                    />, document.getElementById('renderAddressModal'));
                                    break;
                                }
                                case 3: {
                                    var baseText = i18next.t('cannot-delete-the-sale-order-detail-with-product') + ": " + ok.extraData[1] + ": ";
                                    switch (parseInt(ok.extraData[0])) {
                                        case 1: {
                                            baseText += i18next.t('the-detail-is-already-invoiced');
                                            break;
                                        }
                                        case 2: {
                                            baseText += i18next.t('the-detail-has-a-delivery-note-generated');
                                            break;
                                        }
                                        default: // 0
                                            baseText += i18next.t('an-unknown-error-ocurred');
                                    }
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={baseText}
                                    />, document.getElementById('renderAddressModal'));
                                    break;
                                }
                                default: // 0
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={i18next.t('an-unknown-error-ocurred')}
                                    />, document.getElementById('renderAddressModal'));
                            }
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

            this.totalProducts.current.value = order.totalProducts;
            this.vatAmount.current.value = order.vatAmount;
            this.totalWithDiscount.current.value = order.totalWithDiscount;
            this.totalAmount.current.value = order.totalAmount;
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

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={this.order.supplier.email}
                destinationAddressName={this.order.supplier.fiscalName}
                subject={i18next.t("purchase-order")}
                reportId="PURCHASE_ORDER"
                reportDataId={this.order.id}
                languageId={this.order.supplier.languageId}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                this.supplierName.current.value = supplier.name;
                this.defaultValueNameSupplier = supplier.name;
                this.supplierDefaults();
            }}
        />, document.getElementById("renderAddressModal"));
    }

    transactionLog() {
        if (this.order == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"purchase_order"}
            registerId={this.order.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    async editBillingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedBillingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameSupplier={this.order == null ? '' : this.order.supplier.name}
                defaultSupplierId={this.currentSelectedSupplierId}
            />,
            document.getElementById('renderAddressModal'));
    }

    async addBillingAddr() {
        if (this.currentSelectedSupplierId == null || this.currentSelectedSupplierId <= 0) {
            return;
        }

        const commonProps = this.getAddressesFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                addAddress={(address) => {
                    return new Promise((resolve) => {
                        commonProps.addAddress(address).then((result) => {
                            if (result.id > 0) {
                                this.currentSelectedBillingAddress = result.id;
                                this.billingAddress.current.value = address.address;
                            }
                            resolve(result);
                        });
                    });
                }}
                defaultValueNameSupplier={this.defaultValueNameSupplier}
                defaultSupplierId={this.currentSelectedSupplierId}
            />,
            document.getElementById('renderAddressModal'));

    }

    async editShippingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedShippingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameSupplier={this.order == null ? '' : this.order.supplier.name}
                defaultSupplierId={this.currentSelectedSupplierId}
            />,
            document.getElementById('renderAddressModal'));
    }

    async addShippingAddr() {
        if (this.currentSelectedSupplierId == null || this.currentSelectedSupplierId <= 0) {
            return;
        }

        const commonProps = this.getAddressesFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                addAddress={(address) => {
                    return new Promise((resolve) => {
                        commonProps.addAddress(address).then((result) => {
                            if (result.id > 0) {
                                this.currentSelectedShippingAddress = result.id;
                                this.shippingAddress.current.value = address.address;
                            }
                            resolve(result);
                        });
                    });
                }}
                defaultValueNameSupplier={this.defaultValueNameSupplier}
                defaultSupplierId={this.currentSelectedSupplierId}
            />,
            document.getElementById('renderAddressModal'));

    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
                }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    async editSupplier() {
        if (this.currentSelectedSupplierId == null) {
            return;
        }

        const commonProps = this.getSupplierFuntions();
        const supplier = await this.getSupplierRow(this.currentSelectedSupplierId);

        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('supplier')}
            </this.DialogTitle>
            <DialogContent>
                <SupplierForm
                    {...commonProps}
                    tabSuppliers={() => {
                        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
                    }}
                    supplier={supplier}
                />
            </DialogContent>
        </Dialog>, document.getElementById("renderAddressModal"));
    }

    addSupplier() {
        const commonProps = this.getSupplierFuntions();

        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('supplier')}
            </this.DialogTitle>
            <DialogContent>
                <SupplierForm
                    {...commonProps}
                    tabSuppliers={() => {
                        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
                    }}
                    addSupplier={(supplier) => {
                        return new Promise((resolve) => {
                            commonProps.addSupplier(supplier).then((res) => {
                                resolve(res);
                                if (res.id > 0) {
                                    this.currentSelectedSupplierId = res.id;
                                    this.supplierName.current.value = supplier.name;
                                    this.defaultValueNameSupplier = supplier.name;

                                    // delete addresses
                                    this.currentSelectedBillingAddress = null;
                                    this.currentSelectedShippingAddress = null;
                                    this.shippingAddress.current.value = "";
                                    this.billingAddress.current.value = "";
                                }
                            })
                        })
                    }}
                />
            </DialogContent>
        </Dialog>, document.getElementById("renderAddressModal"));
    }

    render() {
        return <div id="tabPurchaseOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('purchase-order')} {this.order == null ? "" : this.order.orderName}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField id="supplier-reference" inputRef={this.reference} label={i18next.t('reference')} variant="outlined" fullWidth size="small"
                                defaultValue={this.order != null ? this.order.reference : ''} inputProps={{ maxLength: 40 }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.order != null ? window.dateFormat(new Date(this.order.dateCreated)) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editSupplier}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addSupplier}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('supplier')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.supplierName} defaultValue={this.defaultValueNameSupplier} />
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editBillingAddr}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addBillingAddr}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('billing-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.billingAddress} defaultValue={this.order == null ? '' : this.order.billingAddress.address} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('order-number')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.order != null ? this.order.orderNumber : ''} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('date-paid')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.order != null && this.order.datePaid != null ? window.dateFormat(this.order.datePaid) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="renderPurchaseOrderPaymentMethod"
                            onChange={(e) => {
                                this.currentSelectedPaymentMethodId = e.target.value == "0" ? null : e.target.value;
                            }}
                        >

                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editShippingAddr}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addShippingAddr}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('shipping-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.shippingAddress} defaultValue={this.order == null ? '' : this.order.shippingAddress.address} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPurchaseOrderBillingSerie"
                                    onChange={(e) => {
                                        this.currentSelectedBillingSerieId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('currency')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPurchaseOrderCurrency"
                                    onChange={(e) => {
                                        this.currentSelectedCurrencyId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('currency-exchange')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.order != null ? this.order.currencyChange : '0'} inputRef={this.currencyChange} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <TextField label={i18next.t('invoice') + "/" + i18next.t('delivery-note')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={(this.order == null ? '' : (
                            this.order.invoicedLines === 0 ? i18next.t('not-invoiced') :
                                (this.order.invoicedLines === this.order.linesNumber
                                    ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                            + "/" +
                            i18next.t(this.order.deliveryNoteLines === 0 ? i18next.t('no-delivery-note') :
                                (this.order.deliveryNoteLines === this.order.linesNumber ?
                                    i18next.t('delivery-note-generated') : i18next.t('partially-delivered'))))}
                    />
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="form-row salesOrderTotals">
                        <div class="col">
                            <TextField label={i18next.t('total-products')} inputRef={this.totalProducts} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.order != null ? this.order.totalProducts : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('vat-amount')} inputRef={this.vatAmount} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.order != null ? this.order.vatAmount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('discount-percent')} inputRef={this.discountPercent} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.order !== undefined && this.order.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.discountPercent : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('fix-discount')} inputRef={this.fixDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.order !== undefined && this.order.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.fixDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-price')} inputRef={this.shippingPrice} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.order !== undefined && this.order.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.shippingPrice : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-discount')} inputRef={this.shippingDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.order !== undefined && this.order.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.shippingDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-with-discount')} inputRef={this.totalWithDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.totalWithDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-amount')} inputRef={this.totalAmount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.order !== undefined ? this.order.totalAmount : '0'} />
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
                                {this.order != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                            </div>
                        </div>
                        {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurchaseOrders}>{i18next.t('cancel')}</button>
                        {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.order != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseOrderForm;
