import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
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
import HighlightIcon from '@material-ui/icons/Highlight';
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

// IMG
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';



class PurchaseOrderForm extends Component {
    constructor({ order, findSupplierByName, defaultValueNameSupplier, findPaymentMethodByName, defaultValueNamePaymentMethod, findCurrencyByName,
        defaultValueNameCurrency, findBillingSerieByName, defaultValueNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseOrders,
        addPurchaseOrder, defaultValueNameBillingAddress, defaultValueNameShippingAddress, getOrderDetailsDefaults, findProductByName, getPurchaseOrderDetails,
        addPurchaseOrderDetail, updatePurchaseOrderDetail, getNameProduct, updatePurchaseOrder, deletePurchaseOrder, deletePurchaseOrderDetail,
        getSalesOrderDiscounts, addSalesOrderDiscounts, deleteSalesOrderDiscounts, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder,
        getPurchaseOrderRelations, deliveryNoteAllPurchaseOrder, deliveryNotePartiallyPurchaseOrder, findCarrierByName, defaultValueNameCarrier,
        findWarehouseByName, defaultValueNameWarehouse, defaultWarehouse, documentFunctions, getPurchaseOrderRow, getSupplierRow, sendEmail,
        locateSuppliers, locateProduct, getSalesOrderDetailsFromPurchaseOrderDetail, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getSupplierFuntions, getAddressesFunctions, getPurcaseInvoicesFunctions, getPurchaseDeliveryNotesFunctions, getProductFunctions }) {
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
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSalesOrderDetailsFromPurchaseOrderDetail = getSalesOrderDetailsFromPurchaseOrderDetail;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;
        this.getPurchaseDeliveryNotesFunctions = getPurchaseDeliveryNotesFunctions;
        this.getProductFunctions = getProductFunctions;

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
        this.locateSupplier = this.locateSupplier.bind(this);
        this.editSupplier = this.editSupplier.bind(this);
        this.addSupplier = this.addSupplier.bind(this);
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addBillingAddr = this.addBillingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.editBillingAddr = this.editBillingAddr.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPaymentMethod();
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
            this.refs.renderPaymentMethod.value = defaults.paymentMethod;
            this.refs.renderPaymentMethod.disabled = this.order !== undefined && this.order.invoicedLines !== 0;

            this.currentSelectedCurrencyId = defaults.currency;
            this.refs.currencyChange.value = defaults.currencyChange;
            this.refs.renderCurrency.value = defaults.currency;
            this.refs.renderCurrency.disabled = this.order !== undefined && this.order.invoicedLines !== 0;

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
            errorMessage = i18next.t('no-warehouse');
            return errorMessage;
        }
        if (order.reference.length > 9) {
            errorMessage = i18next.t('reference-9');
            return errorMessage;
        }
        if (order.supplier === null || order.supplier <= 0 || isNaN(order.supplier)) {
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (order.paymentMethod === null || order.paymentMethod <= 0 || isNaN(order.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (order.billingSeries === null || order.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (order.currency === null || order.currency <= 0 || isNaN(order.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (order.billingAddress === null || order.billingAddress <= 0 || isNaN(order.billingAddress)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        if (order.shippingAddress === null || order.shippingAddress <= 0 || isNaN(order.shippingAddress)) {
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

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                this.refs.supplierName.value = supplier.name;
                this.defaultValueNameSupplier = supplier.name;
                this.supplierDefaults();
            }}
        />, document.getElementById("renderAddressModal"));
    }

    async editBillingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedBillingAddress);

        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await commonProps.getStateName(address.state);
        const defaultValueNameCountry = await commonProps.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameSupplier={this.defaultValueNameSupplier}
                defaultSupplierId={this.currentSelectedSupplierId}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameCountry={defaultValueNameCountry}
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
                                this.refs.billingAddress.value = address.address;
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

        var defaultValueNameSupplier;
        if (address.supplier != null)
            defaultValueNameSupplier = await commonProps.getSupplierName(address.supplier);
        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await commonProps.getStateName(address.state);
        const defaultValueNameCountry = await commonProps.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameSupplier={defaultValueNameSupplier}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameCountry={defaultValueNameCountry}
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
                                this.refs.shippingAddres.value = address.address;
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
                                    this.refs.supplierName.value = supplier.name;
                                    this.defaultValueNameSupplier = supplier.name;

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
        return <div id="tabPurchaseOrder" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('purchase-order')} {this.order == null ? "" : this.order.id}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('supplier-reference')}</label>
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
                    <label>{i18next.t('supplier')}</label>
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
                        <input type="text" class="form-control" ref="supplierName" defaultValue={this.defaultValueNameSupplier}
                            readOnly={true} style={{ 'width': '70%' }} />
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
                            <label>{i18next.t('date-paid')}</label>
                            <input type="text" class="form-control"
                                defaultValue={this.order != null && this.order.datePaid != null ? window.dateFormat(this.order.datePaid) : ''}
                                readOnly={true} />
                        </div>
                    </div>
                </div>
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
                    <label>{i18next.t('invoice')}/{i18next.t('delivery-note')}</label>
                    <input type="text" class="form-control" defaultValue={this.order != null ? this.order.status : ''}
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
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.order !== undefined ? this.order.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-amount')}</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.order !== undefined ? this.order.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('discount-percent')}</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.order !== undefined ? this.order.discountPercent : '0'}
                                readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fix-discount')}</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.order !== undefined ? this.order.fixDiscount : '0'}
                                readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-price')}</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.order !== undefined ? this.order.shippingPrice : '0'}
                                readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-discount')}</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.order !== undefined ? this.order.shippingDiscount : '0'}
                                readOnly={this.order !== undefined && this.order.invoicedLines !== 0} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-with-discount')}</label>
                            <input type="number" class="form-control" ref="totalWithDiscount"
                                defaultValue={this.order !== undefined ? this.order.totalWithDiscount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount"
                                defaultValue={this.order !== undefined ? this.order.totalAmount : '0'}
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
