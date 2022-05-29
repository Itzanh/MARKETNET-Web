import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import './../../../CSS/sales_order.css';

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
import LocateCustomer from "../../Masters/Customers/LocateCustomer";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddressModal from "../../Masters/Addresses/AddressModal";
import CustomerForm from "../../Masters/Customers/CustomerForm";

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

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer',
    'Z': 'cancelled'
}



class SalesOrderForm extends Component {
    constructor({ order, findCustomerByName, findPaymentMethodByName, findCurrencyByName, findBillingSerieByName, getCustomerDefaults, locateAddress,
        tabSalesOrders, addSalesOrder, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail, updateSalesOrderDetail,
        updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts,
        invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder, manufacturingOrderPartiallySaleOrder,
        deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName, documentFunctions, getSalesOrderRow, getCustomerRow, sendEmail,
        locateProduct, locateCustomers, cancelSalesOrderDetail, getPurchasesOrderDetailsFromSaleOrderDetail, locateCurrency, locatePaymentMethods,
        locateCarriers, locateBillingSeries, getRegisterTransactionalLogs, getSalesOrderDetailDigitalProductData, insertSalesOrderDetailDigitalProductData,
        updateSalesOrderDetailDigitalProductData, deleteSalesOrderDetailDigitalProductData, setDigitalSalesOrderDetailAsSent, getAddressesFunctions,
        getCustomersFunctions, getSalesInvoicesFuntions, getSalesDeliveryNotesFunctions, getManufacturingOrdersFunctions, getShippingFunctions,
        getProductFunctions, getComplexManufacturingOrerFunctions }) {
        super();

        this.order = order;

        this.findCustomerByName = findCustomerByName;
        this.defaultValueNameCustomer = this.order != null ? this.order.customer.name : '';
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesOrders = tabSalesOrders;
        this.addSalesOrder = addSalesOrder;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.findProductByName = findProductByName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
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
        this.documentFunctions = documentFunctions;
        this.getSalesOrderRow = getSalesOrderRow;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;
        this.cancelSalesOrderDetail = cancelSalesOrderDetail;
        this.getPurchasesOrderDetailsFromSaleOrderDetail = getPurchasesOrderDetailsFromSaleOrderDetail;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateCarriers = locateCarriers;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getSalesOrderDetailDigitalProductData = getSalesOrderDetailDigitalProductData;
        this.insertSalesOrderDetailDigitalProductData = insertSalesOrderDetailDigitalProductData;
        this.updateSalesOrderDetailDigitalProductData = updateSalesOrderDetailDigitalProductData;
        this.deleteSalesOrderDetailDigitalProductData = deleteSalesOrderDetailDigitalProductData;
        this.setDigitalSalesOrderDetailAsSent = setDigitalSalesOrderDetailAsSent;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getCustomersFunctions = getCustomersFunctions;
        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;
        this.getSalesDeliveryNotesFunctions = getSalesDeliveryNotesFunctions;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getShippingFunctions = getShippingFunctions;
        this.getProductFunctions = getProductFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;

        this.currentSelectedCustomerId = order != null ? order.customerId : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethodId : null;
        this.currentSelectedCurrencyId = order != null ? order.currencyId : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeriesId : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddressId : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddressId : null;
        this.currentSelectedCarrierId = order != null ? order.carrierId : null;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.tab = 0;

        this.reference = React.createRef();
        this.customerName = React.createRef();
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
        this.customerDefaults = this.customerDefaults.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.editBillingAddr = this.editBillingAddr.bind(this);
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
        this.locateCustomer = this.locateCustomer.bind(this);
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addBillingAddr = this.addBillingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderSalesOrderPaymentMethod();
        await this.renderSalesOrderCarriers();
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
                ReactDOM.render(components, document.getElementById("renderSalesOrderCurrency"));

                document.getElementById("renderSalesOrderCurrency").disabled = this.order !== undefined && this.order.status !== "_";
                document.getElementById("renderSalesOrderCurrency").value = this.order != null ? "" + this.order.currencyId : "0";
            });
        });
    }

    renderSalesOrderPaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderSalesOrderPaymentMethod"));

                document.getElementById("renderSalesOrderPaymentMethod").disabled = this.order !== undefined && this.order.status !== "_";
                document.getElementById("renderSalesOrderPaymentMethod").value = this.order != null ? this.order.paymentMethodId : "0";
            });
        });
    }

    renderSalesOrderCarriers() {
        return new Promise((resolve) => {
            this.locateCarriers().then((carriers) => {
                resolve();
                const components = carriers.map((carrier, i) => {
                    return <option key={i + 1} value={carrier.id}>{carrier.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderSalesOrderCarriers"));

                document.getElementById("renderSalesOrderCarriers").disabled = this.order !== undefined && this.order.status !== "_";
                document.getElementById("renderSalesOrderCarriers").value =
                    this.order != null ? this.order.carrierId != null ? this.order.carrierId : "0" : "0";
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
                components.unshift(<option key={0} value="">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderSalesOrderBillingSerie"));

                document.getElementById("renderSalesOrderBillingSerie").disabled = this.order !== undefined;
                document.getElementById("renderSalesOrderBillingSerie").value = this.order != null ? this.order.billingSeriesId : "";
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
                    case 5: {
                        this.tabDiscounts();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('order-details')} />
                <Tab label={i18next.t('generate')} />
                <Tab label={i18next.t('relations')} />
                <Tab label={i18next.t('documents')} />
                <Tab label={i18next.t('description')} />
                <Tab label={i18next.t('discounts')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetails(addNow = false) {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<SalesOrderDetails
            addNow={addNow}
            orderId={this.order === undefined ? null : this.order.id}
            waiting={this.order !== undefined && this.order.status === "_"}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesOrderDetails={this.getSalesOrderDetails}
            locateProduct={this.locateProduct}
            cancelSalesOrderDetail={this.cancelSalesOrderDetail}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            getPurchasesOrderDetailsFromSaleOrderDetail={this.getPurchasesOrderDetailsFromSaleOrderDetail}
            getSalesOrderDetailDigitalProductData={this.getSalesOrderDetailDigitalProductData}
            insertSalesOrderDetailDigitalProductData={this.insertSalesOrderDetailDigitalProductData}
            updateSalesOrderDetailDigitalProductData={this.updateSalesOrderDetailDigitalProductData}
            deleteSalesOrderDetailDigitalProductData={this.deleteSalesOrderDetailDigitalProductData}
            setDigitalSalesOrderDetailAsSent={this.setDigitalSalesOrderDetailAsSent}
            customerId={this.order != null ? this.order.customerId : null}
            customer={this.order != null ? this.order.customer : null}
            getProductFunctions={this.getProductFunctions}
            addSalesOrderDetail={(detail) => {
                if (this.order == null) {
                    this.add(true);
                    return;
                }
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
            invoiceAllSaleOrder={(orderId) => {
                return new Promise((resolve) => {
                    this.invoiceAllSaleOrder(orderId).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            invoiceSelectionSaleOrder={(selection) => {
                return new Promise((resolve) => {
                    this.invoiceSelectionSaleOrder(selection).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            manufacturingOrderAllSaleOrder={(orderId) => {
                return new Promise((resolve) => {
                    this.manufacturingOrderAllSaleOrder(orderId).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            manufacturingOrderPartiallySaleOrder={(orderInfo) => {
                return new Promise((resolve) => {
                    this.manufacturingOrderPartiallySaleOrder(orderInfo).then((ok) => {
                        resolve(ok);
                        this.refreshOrder();
                    });
                });
            }}
            deliveryNoteAllSaleOrder={this.deliveryNoteAllSaleOrder}
            deliveryNotePartiallySaleOrder={this.deliveryNotePartiallySaleOrder}
        />, this.refs.render);
    }

    async refreshOrder() {
        const order = await this.getSalesOrderRow(this.order.id);
        this.order = order;
        this.forceUpdate();
        this.status.current.value = this.order != null ? i18next.t(saleOrderStates[this.order.status]) : '';
        await this.renderCurrencies();
        await this.renderSalesOrderPaymentMethod();
        await this.renderSalesOrderCarriers();
        await this.renderBilingSeries();
    }

    tabRelations() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<SalesOrderRelations
            orderId={this.order == null ? null : this.order.id}
            getSalesOrderRelations={this.getSalesOrderRelations}
            getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
            getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
            getManufacturingOrdersFunctions={this.getManufacturingOrdersFunctions}
            getShippingFunctions={this.getShippingFunctions}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
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
            document.getElementById("renderSalesOrderPaymentMethod").value = defaults.paymentMethod == null ? '0' : defaults.paymentMethod;
            document.getElementById("renderSalesOrderPaymentMethod").disabled = this.order !== undefined && this.order.status !== "_";

            this.currentSelectedCurrencyId = defaults.currency;
            document.getElementById("renderSalesOrderCurrency").disabled = this.order !== undefined && this.order.status !== "_";
            document.getElementById("renderSalesOrderCurrency").value = defaults.currency == null ? "0" : defaults.currency;
            this.currencyChange.current.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            document.getElementById("renderSalesOrderBillingSerie").value = defaults.billingSeries == null ? '' : defaults.billingSeries;
            document.getElementById("renderSalesOrderBillingSerie").disabled = this.order !== undefined;

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
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.billingAddress.current.value = addressName;
                }}
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
                defaultValueNameCustomer={this.order == null ? '' : this.order.customer.name}
            />,
            document.getElementById('renderAddressModal'));
    }

    async addBillingAddr() {
        if (this.currentSelectedCustomerId == null || this.currentSelectedCustomerId <= 0) {
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
                defaultValueNameCustomer={this.defaultValueNameCustomer}
                defaultCustomerId={this.currentSelectedCustomerId}
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
                    this.shippingAddress.current.value = addressName;
                }}
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
                defaultValueNameCustomer={this.order == null ? '' : this.order.customer.name}
            />,
            document.getElementById('renderAddressModal'));
    }

    async addShippingAddr() {
        if (this.currentSelectedCustomerId == null || this.currentSelectedCustomerId <= 0) {
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
                defaultValueNameCustomer={this.defaultValueNameCustomer}
                defaultCustomerId={this.currentSelectedCustomerId}
            />,
            document.getElementById('renderAddressModal'));

    }

    getSalesOrderFromForm() {
        const salesOrder = {};
        salesOrder.reference = this.reference.current.value;
        salesOrder.customerId = parseInt(this.currentSelectedCustomerId);
        salesOrder.billingAddressId = this.currentSelectedBillingAddress;
        salesOrder.shippingAddressId = this.currentSelectedShippingAddress;
        salesOrder.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        salesOrder.billingSeriesId = this.currentSelectedBillingSerieId;
        salesOrder.currencyId = parseInt(this.currentSelectedCurrencyId);
        salesOrder.discountPercent = parseFloat(this.discountPercent.current.value);
        salesOrder.fixDiscount = parseFloat(this.fixDiscount.current.value);
        salesOrder.shippingPrice = parseFloat(this.shippingPrice.current.value);
        salesOrder.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        salesOrder.notes = this.notes;
        salesOrder.description = this.description;
        if (this.currentSelectedCarrierId === undefined || this.currentSelectedCarrierId === "" || this.currentSelectedCarrierId === 0) {
            salesOrder.carrierId = null;
        } else {
            salesOrder.carrierId = parseInt(this.currentSelectedCarrierId);
        }
        return salesOrder;
    }

    isValid(salesOrder) {
        var errorMessage = "";
        if (salesOrder.reference.length > 9) {
            errorMessage = i18next.t('reference-9');
            return errorMessage;
        }
        if (salesOrder.customerId === null || salesOrder.customerId <= 0 || isNaN(salesOrder.customerId)) {
            errorMessage = i18next.t('no-customer');
            return errorMessage;
        }
        if (salesOrder.paymentMethodId === null || salesOrder.paymentMethodId <= 0 || isNaN(salesOrder.paymentMethodId)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (salesOrder.billingSeriesId === null || salesOrder.billingSeriesId.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (salesOrder.currencyId === null || salesOrder.currencyId <= 0 || isNaN(salesOrder.currencyId)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (salesOrder.billingAddressId === null || salesOrder.billingAddressId <= 0 || isNaN(salesOrder.billingAddressId)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        if (salesOrder.shippingAddressId === null || salesOrder.shippingAddressId <= 0 || isNaN(salesOrder.shippingAddressId)) {
            errorMessage = i18next.t('no-shipping-address');
            return errorMessage;
        }
        if (salesOrder.notes.length > 250) {
            errorMessage = i18next.t('notes-250');
            return errorMessage;
        }
        return errorMessage;
    }

    add(addNow = false) {
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

        this.addSalesOrder(salesOrder).then((order) => {
            if (order != null) {
                this.order = order;
                this.forceUpdate();
                this.tabDetails(addNow);
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
                        if (ok.ok) {
                            this.tabSalesOrders();
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
                                        case 3: {
                                            baseText += i18next.t('there-are-complex-manufacturing-orders-already-created');
                                            break;
                                        }
                                        case 4: {
                                            baseText += i18next.t('there-are-manufacturing-orders-already-created');
                                            break;
                                        }
                                        case 5: {
                                            baseText += i18next.t('there-is-digital-product-data-that-must-be-deleted-first');
                                            break;
                                        }
                                        case 6: {
                                            baseText += i18next.t('the-product-has-been-packaged');
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
            // an order detail or a discount has been added, refresh the totals and status
            const order = await this.getSalesOrderRow(this.order.id);

            this.status.current.value = i18next.t(saleOrderStates[order.status]);
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
        const customer = this.order.customer;

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={customer.email}
                destinationAddressName={customer.fiscalName}
                subject={i18next.t('sale-order')}
                reportId="SALES_ORDER"
                reportDataId={this.order.id}
                languageId={customer.languageId}
            />,
            document.getElementById('renderAddressModal'));
    }

    transactionLog() {
        if (this.order == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"sales_order"}
            registerId={this.order.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    locateCustomer() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<LocateCustomer
            locateCustomers={this.locateCustomers}
            onSelect={(customer) => {
                this.currentSelectedCustomerId = customer.id;
                this.customerName.current.value = customer.name;
                this.defaultValueNameCustomer = customer.name;
                this.customerDefaults();
            }}
        />, document.getElementById("renderAddressModal"));
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

    async editCustomer() {
        if (this.currentSelectedCustomerId == null) {
            return;
        }

        const commonProps = this.getCustomersFunctions();
        const customer = await this.getCustomerRow(this.currentSelectedCustomerId);

        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('customer')}
            </this.DialogTitle>
            <DialogContent>
                <CustomerForm
                    {...commonProps}
                    tabCustomers={() => {
                        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
                    }}
                    customer={customer}
                />
            </DialogContent>
        </Dialog>, document.getElementById("renderAddressModal"));
    }

    addCustomer() {
        const commonProps = this.getCustomersFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('customer')}
            </this.DialogTitle>
            <DialogContent>
                <CustomerForm
                    {...commonProps}
                    tabCustomers={() => {
                        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
                    }}
                    addCustomer={(customer) => {
                        return new Promise((resolve) => {
                            commonProps.addCustomer(customer).then((res) => {
                                resolve(res);
                                if (res.id > 0) {
                                    this.currentSelectedCustomerId = res.id;
                                    this.customerName.current.value = customer.name;
                                    this.defaultValueNameCustomer = customer.name;

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
        return <div id="tabSaleOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('sale-order')} {this.order == null ? "" : this.order.orderName}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField id="reference" inputRef={this.reference} label={i18next.t('reference')} variant="outlined" fullWidth size="small"
                                defaultValue={this.order != null ? this.order.reference : ''} inputProps={{ maxLength: 15 }} />
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
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editCustomer}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addCustomer}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('customer')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.customerName} defaultValue={this.defaultValueNameCustomer} />
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
                            inputRef={this.billingAddress} defaultValue={this.order != null ? this.order.billingAddress.address : ''} />
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
                            <TextField label={i18next.t('date-payment-accepted')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.order != null && this.order.datePaymentAccepted != null ? window.dateFormat(this.order.datePaymentAccepted) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderSalesOrderPaymentMethod"
                                    onChange={(e) => {
                                        this.currentSelectedPaymentMethodId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('carrier')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderSalesOrderCarriers"
                                    onChange={(e) => {
                                        this.currentSelectedCarrierId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
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
                            inputRef={this.shippingAddress} defaultValue={this.order != null ? this.order.shippingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="renderSalesOrderBillingSerie"
                            onChange={(e) => {
                                this.currentSelectedBillingSerieId = e.target.value == "" ? null : e.target.value;
                            }}
                        >

                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('currency')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderSalesOrderCurrency"
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
                    <TextField label={i18next.t('status')} inputRef={this.status} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.order != null ? i18next.t(saleOrderStates[this.order.status]) : ''} />
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
