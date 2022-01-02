import { Component } from "react";
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
    'H': 'receiced-by-the-customer'
}



class SalesOrderForm extends Component {
    constructor({ order, findCustomerByName, defaultValueNameCustomer, findPaymentMethodByName, defaultValueNamePaymentMethod, findCurrencyByName,
        defaultValueNameCurrency, findBillingSerieByName, defaultValueNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesOrders, addSalesOrder,
        defaultValueNameBillingAddress, defaultValueNameShippingAddress, getOrderDetailsDefaults, findProductByName, getSalesOrderDetails, addSalesOrderDetail,
        updateSalesOrderDetail, getNameProduct, updateSalesOrder, deleteSalesOrder, deleteSalesOrderDetail, getSalesOrderDiscounts, addSalesOrderDiscounts,
        deleteSalesOrderDiscounts, invoiceAllSaleOrder, invoiceSelectionSaleOrder, getSalesOrderRelations, manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder, deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder, findCarrierByName, defaultValueNameCarrier,
        defaultWarehouse, documentFunctions, getSalesOrderRow, getCustomerRow, sendEmail, locateProduct, locateCustomers, cancelSalesOrderDetail,
        getPurchasesOrderDetailsFromSaleOrderDetail, locateCurrency, locatePaymentMethods, locateCarriers, locateBillingSeries, getRegisterTransactionalLogs,
        getWarehouses, getSalesOrderDetailDigitalProductData, insertSalesOrderDetailDigitalProductData, updateSalesOrderDetailDigitalProductData,
        deleteSalesOrderDetailDigitalProductData, setDigitalSalesOrderDetailAsSent, getAddressesFunctions, getCustomersFunctions, getSalesInvoicesFuntions,
        getSalesDeliveryNotesFunctions, getManufacturingOrdersFunctions, getShippingFunctions, getProductFunctions, getComplexManufacturingOrerFunctions }) {
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
        this.defaultWarehouse = defaultWarehouse;
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
        this.getWarehouses = getWarehouses;
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

        this.currentSelectedCustomerId = order != null ? order.customer : null;
        this.currentSelectedPaymentMethodId = order != null ? order.paymentMethod : null;
        this.currentSelectedCurrencyId = order != null ? order.currency : null;
        this.currentSelectedBillingSerieId = order != null ? order.billingSeries : null;
        this.currentSelectedBillingAddress = order != null ? order.billingAddress : null;
        this.currentSelectedShippingAddress = order != null ? order.shippingAddress : null;
        this.currentSelectedCarrierId = order != null ? order.carrier : null;

        this.notes = order != null ? order.notes : '';
        this.description = order != null ? order.description : '';

        this.tab = 0;

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
        await this.renderPaymentMethod();
        await this.renderCarriers();
        await this.renderBilingSeries();
        await this.renderWarehouses();
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
                ReactDOM.render(components, this.refs.renderCurrency);

                this.refs.renderCurrency.disabled = this.order !== undefined && this.order.status !== "_";
                this.refs.renderCurrency.value = this.order != null ? "" + this.order.currency : "0";
            });
        });
    }

    renderPaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderPaymentMethod);

                this.refs.renderPaymentMethod.disabled = this.order !== undefined && this.order.status !== "_";
                this.refs.renderPaymentMethod.value = this.order != null ? this.order.paymentMethod : "0";
            });
        });
    }

    renderCarriers() {
        return new Promise((resolve) => {
            this.locateCarriers().then((carriers) => {
                resolve();
                const components = carriers.map((carrier, i) => {
                    return <option key={i + 1} value={carrier.id}>{carrier.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderCarriers);

                this.refs.renderCarriers.disabled = this.order !== undefined && this.order.status !== "_";
                this.refs.renderCarriers.value = this.order != null ? this.order.paymentMethod : "0";
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
                ReactDOM.render(components, this.refs.renderBillingSerie);

                this.refs.renderBillingSerie.disabled = this.order !== undefined;
                this.refs.renderBillingSerie.value = this.order != null ? this.order.billingSeries : "0";
            });
        });
    }

    renderWarehouses() {
        return new Promise((resolve) => {
            this.getWarehouses().then((warehouses) => {
                resolve();
                warehouses.unshift({ id: "", name: "." + i18next.t('none') });

                ReactDOM.render(warehouses.map((element, i) => {
                    return <option key={i} value={element.id}
                        selected={this.order == null ? element.id = this.defaultWarehouse : element.id == this.order.warehouse}>{element.name}</option>
                }), this.refs.warehouse);

                this.refs.warehouse.disabled = this.order !== undefined;
            });
        });
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
            customerId={this.order != null ? this.order.customer : null}
            getCustomerRow={this.getCustomerRow}
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
        this.refs.status.value = this.order != null ? i18next.t(saleOrderStates[this.order.status]) : '';
        await this.renderCurrencies();
        await this.renderPaymentMethod();
        await this.renderCarriers();
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
            this.refs.renderPaymentMethod.value = defaults.paymentMethod;
            this.refs.renderPaymentMethod.disabled = this.order !== undefined && this.order.status !== "_";

            this.currentSelectedCurrencyId = defaults.currency;
            this.refs.renderCurrency.disabled = this.order !== undefined && this.order.status !== "_";
            this.refs.renderCurrency.value = defaults.currency == null ? "0" : defaults.currency;
            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            this.refs.renderBillingSerie.value = defaults.billingSeries;
            this.refs.renderBillingSerie.disabled = this.order !== undefined;

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

    async editBillingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedBillingAddress);

        var defaultValueNameCustomer;
        if (address.customer != null)
            defaultValueNameCustomer = await commonProps.getCustomerName(address.customer);
        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await commonProps.getStateName(address.state);
        const defaultValueNameCountry = await commonProps.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameCountry={defaultValueNameCountry}
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
                                this.refs.billingAddress.value = address.address;
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
                    this.refs.shippingAddres.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    async editShippingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedShippingAddress);

        var defaultValueNameCustomer;
        if (address.customer != null)
            defaultValueNameCustomer = await commonProps.getCustomerName(address.customer);
        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await commonProps.getStateName(address.state);
        const defaultValueNameCountry = await commonProps.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameCountry={defaultValueNameCountry}
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
                                this.refs.shippingAddres.value = address.address;
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
        salesOrder.reference = this.refs.reference.value;
        salesOrder.customer = parseInt(this.currentSelectedCustomerId);
        salesOrder.billingAddress = this.currentSelectedBillingAddress;
        salesOrder.shippingAddress = this.currentSelectedShippingAddress;
        salesOrder.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        salesOrder.billingSeries = this.currentSelectedBillingSerieId;
        salesOrder.warehouse = this.refs.warehouse.value;
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
        console.log(salesOrder);
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

            this.refs.status.value = i18next.t(saleOrderStates[order.status]);
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
                this.refs.customerName.value = customer.name;
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
                                    this.refs.customerName.value = customer.name;
                                    this.defaultValueNameCustomer = customer.name;

                                    // delete addresses
                                    this.currentSelectedBillingAddress = null;
                                    this.currentSelectedShippingAddress = null;
                                    this.refs.shippingAddres.value = "";
                                    this.refs.billingAddress.value = "";
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
            <hr className="titleHr" />
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
                        <input type="text" class="form-control" ref="customerName" defaultValue={this.defaultValueNameCustomer}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-address')}</label>
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
                            <div>
                                <select class="form-control" ref="renderPaymentMethod" onChange={() => {
                                    this.currentSelectedPaymentMethodId = this.refs.renderPaymentMethod.value == "0" ? null : this.refs.renderPaymentMethod.value;
                                }}>

                                </select>
                            </div>
                        </div>
                        <div class="col">
                            <label>{i18next.t('carrier')}</label>
                            <select class="form-control" ref="renderCarriers" onChange={() => {
                                this.currentSelectedCarrierId = this.refs.renderCarriers.value == "0" ? null : this.refs.renderCarriers.value;
                            }}>

                            </select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('shipping-address')}</label>
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
                            <div>
                                <select class="form-control" ref="renderBillingSerie" onChange={() => {
                                    this.currentSelectedBillingSerieId = this.refs.renderBillingSerie.value == "0" ? null : this.refs.renderBillingSerie.value;
                                }}>

                                </select>
                            </div>
                        </div>
                        <div class="col">
                            <label>{i18next.t('warehouse')}</label>
                            <select id="warehouse" ref="warehouse" class="form-control" disabled={this.note != null}>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('currency')}</label>
                            <div>
                                <select class="form-control" ref="renderCurrency" onChange={() => {
                                    this.currentSelectedCurrencyId = this.refs.renderCurrency.value == "0" ? null : this.refs.renderCurrency.value;
                                }}>

                                </select>
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
