import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseInvoiceDetails from "./PurchaseInvoiceDetails";
import PurchaseInvoiceRelations from "./PurchaseInvoiceRelations";
import PurchaseInvoiceAmending from "./PurchaseInvoiceAmending";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import ConfirmDelete from "../../ConfirmDelete";
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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import AccountingMovementForm from "../../Accounting/AccountingMovements/AccountingMovementForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class PurchaseInvoiceForm extends Component {
    constructor({ invoice, findSupplierByName, findPaymentMethodByName, findCurrencyByName, findBillingSerieByName,
        getSupplierDefaults, locateAddress, tabPurcaseInvoices,
        findProductByName, getOrderDetailsDefaults,
        getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice,
        getPurchaseInvoiceRelations, documentFunctions, getPurchaseInvoiceRow, locateSuppliers, locateProduct, makeAmendingPurchaseInvoice,
        getSupplierRow, locateCurrency, locatePaymentMethods, locateBillingSeries, invoiceDeletePolicy, getRegisterTransactionalLogs, getSupplierFuntions,
        getAddressesFunctions, getPurchaseOrdersFunctions, getAccountingMovementsFunction, getProductFunctions, getPurcaseInvoicesFunctions }) {
        super();

        this.invoice = invoice;

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findCurrencyByName = findCurrencyByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurcaseInvoices = tabPurcaseInvoices;
        this.makeAmendingPurchaseInvoice = makeAmendingPurchaseInvoice;

        this.defaultValueNameSupplier = this.invoice == null ? '' : this.invoice.supplier.name;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.addPurchaseInvoice = addPurchaseInvoice;
        this.deletePurchaseInvoice = deletePurchaseInvoice;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
        this.documentFunctions = documentFunctions;
        this.getPurchaseInvoiceRow = getPurchaseInvoiceRow;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSupplierRow = getSupplierRow;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.invoiceDeletePolicy = invoiceDeletePolicy;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getAccountingMovementsFunction = getAccountingMovementsFunction;
        this.getProductFunctions = getProductFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

        this.currentSelectedSupplierId = invoice != null ? invoice.supplierId : null;
        this.currentSelectedPaymentMethodId = invoice != null ? invoice.paymentMethodId : null;
        this.currentSelectedCurrencyId = invoice != null ? invoice.currencyId : null;
        this.currentSelectedBillingSerieId = invoice != null ? invoice.billingSeriesId : null;
        this.currentSelectedBillingAddress = invoice != null ? invoice.billingAddressId : null;

        this.tab = 0;
        this.incomeTax = this.invoice == null ? false : this.invoice.incomeTax;
        this.rent = this.invoice == null ? false : this.invoice.rent;

        this.supplierName = React.createRef();
        this.billingAddress = React.createRef();
        this.currencyChange = React.createRef();

        this.totalProducts = React.createRef();
        this.vatAmount = React.createRef();
        this.discountPercent = React.createRef();
        this.fixDiscount = React.createRef();
        this.shippingPrice = React.createRef();
        this.shippingDiscount = React.createRef();
        this.totalWithDiscount = React.createRef();
        this.totalAmount = React.createRef();

        this.tabs = this.tabs.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.locateSupplier = this.locateSupplier.bind(this);
        this.amendingInvoice = this.amendingInvoice.bind(this);
        this.editSupplier = this.editSupplier.bind(this);
        this.addSupplier = this.addSupplier.bind(this);
        this.addBillingAddr = this.addBillingAddr.bind(this);
        this.editBillingAddr = this.editBillingAddr.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPurchaseInvoicePaymentMethod();
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
                ReactDOM.render(components, document.getElementById("renderPurchaseInvoiceCurrency"));

                document.getElementById("renderPurchaseInvoiceCurrency").disabled = this.invoice !== undefined;
                document.getElementById("renderPurchaseInvoiceCurrency").value = this.invoice != null ? "" + this.invoice.currencyId : "0";
            });
        });
    }

    renderPurchaseInvoicePaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderPurchaseInvoicePaymentMethod"));

                document.getElementById("renderPurchaseInvoicePaymentMethod").disabled = this.invoice !== undefined;
                document.getElementById("renderPurchaseInvoicePaymentMethod").value = this.invoice != null ? this.invoice.paymentMethodId : "0";
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
                ReactDOM.render(components, document.getElementById("renderPurchaseInvoiceBillingSerie"));

                document.getElementById("renderPurchaseInvoiceBillingSerie").disabled = this.invoice !== undefined;
                document.getElementById("renderPurchaseInvoiceBillingSerie").value = this.invoice != null ? this.invoice.billingSeriesId : "";
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
                        this.tabRelations();
                        break;
                    }
                    case 2: {
                        this.tabDocuments();
                        break;
                    }
                    case 3: {
                        this.tabAccountingMovement();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('invoice-details')} />
                <Tab label={i18next.t('relations')} />
                <Tab label={i18next.t('documents')} />
                {this.invoice != null && this.invoice.accountingMovement ? <Tab label={i18next.t('accounting-movement')} /> : null}
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabDetails(addNow = false) {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<PurchaseInvoiceDetails
            addNow={addNow}
            invoiceId={this.invoice == null ? null : this.invoice.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getPurchaseInvoiceDetails={this.getPurchaseInvoiceDetails}
            getProductFunctions={this.getProductFunctions}
            locateProduct={this.locateProduct}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            addPurchaseInvoiceDetail={(detail) => {
                if (this.invoice == null) {
                    this.add(true);
                    return;
                }
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
            invoicePosted={this.invoice != null && this.invoice.accountingMovementId != null}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<PurchaseInvoiceRelations
            invoiceId={this.invoice == null ? null : this.invoice.id}
            getPurchaseInvoiceRelations={this.getPurchaseInvoiceRelations}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
            getPurcaseInvoicesFunctions={this.getPurcaseInvoicesFunctions}
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

    async tabAccountingMovement() {
        this.tab = 3;
        this.tabs();

        const commonProps = await this.getAccountingMovementsFunction();
        const movement = await commonProps.getAccountingMovementRow(this.invoice.accountingMovementId);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<AccountingMovementForm
            {...commonProps}
            movement={movement}
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
                    this.billingAddress.current.value = addressName;
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
            document.getElementById("renderPurchaseInvoicePaymentMethod").value = defaults.paymentMethod == null ? '0' : defaults.paymentMethod;
            document.getElementById("renderPurchaseInvoicePaymentMethod").disabled = this.invoice != null;

            this.currentSelectedCurrencyId = defaults.currency;
            document.getElementById("renderPurchaseInvoiceCurrency").value = defaults.currency == null ? '0' : defaults.currency;
            document.getElementById("renderPurchaseInvoiceCurrency").disabled = this.invoice != null;
            this.currencyChange.current.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            document.getElementById("renderPurchaseInvoiceBillingSerie").value = defaults.billingSeries == null ? '' : defaults.billingSeries;
            document.getElementById("renderPurchaseInvoiceBillingSerie").disabled = this.invoice != null;

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.billingAddress.current.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getPurchaseInvoiceFromForm() {
        const invoice = {};
        invoice.supplierId = parseInt(this.currentSelectedSupplierId);
        invoice.billingAddressId = this.currentSelectedBillingAddress;
        invoice.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        invoice.billingSeriesId = this.currentSelectedBillingSerieId;
        invoice.currencyId = parseInt(this.currentSelectedCurrencyId);
        invoice.discountPercent = parseFloat(this.discountPercent.current.value);
        invoice.fixDiscount = parseFloat(this.fixDiscount.current.value);
        invoice.shippingPrice = parseFloat(this.shippingPrice.current.value);
        invoice.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        if (this.incomeTax) {
            invoice.incomeTax = this.incomeTax;
            invoice.incomeTaxPercentage = parseFloat(this.refs.incomeTaxPercentage.value);
        }
        if (this.rent) {
            invoice.rent = this.rent;
            invoice.rentPercentage = parseFloat(this.refs.rentPercentage.value);
        }
        return invoice;
    }

    isValid(invoice) {
        var errorMessage = "";
        if (invoice.supplierId === null || invoice.supplierId <= 0 || isNaN(invoice.supplierId)) {
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (invoice.paymentMethodId === null || invoice.paymentMethodId <= 0 || isNaN(invoice.paymentMethodId)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (invoice.billingSeriesId === null || invoice.billingSeriesId.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (invoice.currencyId === null || invoice.currencyId <= 0 || isNaN(invoice.currencyId)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (invoice.billingAddressId === null || invoice.billingAddressId <= 0 || isNaN(invoice.billingAddressId)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        return errorMessage;
    }

    add(addNow = false) {
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

        this.addPurchaseInvoice(invoice).then((invoice) => {
            if (invoice != null) {
                this.invoice = invoice;
                this.forceUpdate();
                this.tabDetails(addNow);
                document.getElementById("renderPurchaseInvoicePaymentMethod").disabled = this.invoice != null;
                document.getElementById("renderPurchaseInvoiceCurrency").disabled = this.invoice != null;
                document.getElementById("renderPurchaseInvoiceBillingSerie").disabled = this.invoice != null;
            }
        });
    }

    delete() {
        if (this.invoiceDeletePolicy == 2) { // Never allow invoice deletion
            ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('cant-delete-invoice')}
                    modalText={i18next.t('invoice-deletion-disabled-by-admin')}
                />,
                document.getElementById('renderAddressModal'));
        } else {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
            ReactDOM.render(
                <ConfirmDelete
                    onDelete={() => {
                        this.deletePurchaseInvoice(this.invoice.id).then((ok) => {
                            if (ok.ok) {
                                this.tabPurcaseInvoices();
                            } else if (this.invoiceDeletePolicy == 1) { // Only allow the deletion of the latest invoice in the billing serie
                                ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                ReactDOM.render(
                                    <AlertModal
                                        modalTitle={i18next.t('cant-delete-invoice')}
                                        modalText={i18next.t('only-allowed-delete-latest-invoice')}
                                    />,
                                    document.getElementById('renderAddressModal'));
                            }
                        });
                    }}
                />,
                document.getElementById('renderAddressModal'));
        }
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            // an order detail has been added, refresh the totals and status
            const order = await this.getPurchaseInvoiceRow(this.invoice.id);

            this.totalProducts.current.value = order.totalProducts;
            this.vatAmount.current.value = order.vatAmount;
            this.totalWithDiscount.current.value = order.totalWithDiscount;
            this.totalAmount.current.value = order.totalAmount;
            resolve();
        });
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
        if (this.invoice == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"purchase_invoice"}
            registerId={this.invoice.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    amendingInvoice() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<PurchaseInvoiceAmending
            invoiceId={this.invoice.id}
            makeAmendingPurchaseInvoice={this.makeAmendingPurchaseInvoice}
        />, document.getElementById("renderAddressModal"));
    }

    async editBillingAddr() {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(this.currentSelectedBillingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                address={address}
                defaultValueNameSupplier={this.defaultValueNameSupplier}
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
        return <div id="tabPurchaseInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('purchase-invoice')} {this.invoice == null ? "" : this.invoice.invoiceName}</h4>
            <div className="bagdes">
                {this.invoice != null && this.invoice.simplifiedInvoice ? <span class="badge badge-primary">{i18next.t('simplified-invoice')}</span> : null}
                {this.invoice != null && this.invoice.accountingMovementId != null ?
                    <span class="badge badge-danger">{i18next.t('posted')}</span> : <span class="badge badge-warning">{i18next.t('not-posted')}</span>}
                {this.invoice != null && this.invoice.amending ? <span class="badge badge-info">{i18next.t('amending-invoice')}</span> : null}
            </div>
            <br />
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}
                                disabled={this.invoice != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editSupplier}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addSupplier}
                                disabled={this.invoice != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('supplier')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.supplierName} defaultValue={this.defaultValueNameSupplier} />
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.invoice != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editBillingAddr}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addBillingAddr}
                                disabled={this.invoice != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('billing-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.billingAddress} defaultValue={this.invoice != null ? this.invoice.billingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('invoice-number')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.invoice != null ? this.invoice.invoiceNumber : ''} />
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPurchaseInvoiceBillingSerie"
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
                                    id="renderPurchaseInvoiceCurrency"
                                    onChange={(e) => {
                                        this.currentSelectedCurrencyId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('currency-exchange')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.invoice != null ? this.invoice.currencyChange : '0'} inputRef={this.currencyChange} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="renderPurchaseInvoicePaymentMethod"
                            onChange={(e) => {
                                this.currentSelectedPaymentMethodId = e.target.value == "0" ? null : e.target.value;
                            }}
                        >

                        </NativeSelect>
                    </FormControl>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="custom-control custom-switch mt-2-5-mb-2-5">
                        <input type="checkbox" class="custom-control-input" ref="incomeTax" id="incomeTax"
                            defaultChecked={this.invoice != null && this.invoice.incomeTax} onChange={() => {
                                this.incomeTax = !this.incomeTax;
                                this.forceUpdate();
                            }} disabled={this.invoice != null} />
                        <label class="custom-control-label" htmlFor="incomeTax">{i18next.t('income-tax')}</label>
                    </div>
                </div>
                {this.incomeTax ?
                    <div class="col">
                        <label>{i18next.t('income-tax-base')}</label>
                        <input type="number" class="form-control" id="incomeTaxBase" ref="incomeTaxBase" min="0"
                            defaultValue={this.invoice == null ? 0 : this.invoice.incomeTaxBase} readOnly={true} />
                    </div> : null}
                {this.incomeTax ?
                    <div class="col">
                        <label>{i18next.t('income-tax-percentage')}</label>
                        <input type="number" class="form-control" id="incomeTaxPercentage" ref="incomeTaxPercentage" min="0" max="100"
                            defaultValue={this.invoice == null ? 0 : this.invoice.incomeTaxPercentage} readOnly={this.invoice != null} />
                    </div> : null}
                {this.incomeTax ?
                    <div class="col">
                        <label>{i18next.t('income-tax-value')}</label>
                        <input type="number" class="form-control" id="incomeTaxValue" ref="incomeTaxValue" readOnly={true}
                            defaultValue={this.invoice == null ? 0 : this.invoice.incomeTaxValue} readOnly={this.invoice != null} readOnly={true} />
                    </div> : null}
                <div class="col">
                    <div class="custom-control custom-switch mt-2-5-mb-2-5">
                        <input type="checkbox" class="custom-control-input" ref="rent" id="rent"
                            defaultChecked={this.invoice != null && this.invoice.rent} onChange={() => {
                                this.rent = !this.rent;
                                this.forceUpdate();
                            }} disabled={this.invoice != null} />
                        <label class="custom-control-label" htmlFor="rent">{i18next.t('rent')}</label>
                    </div>
                </div>
                {this.rent ?
                    <div class="col">
                        <label>{i18next.t('rent-base')}</label>
                        <input type="number" class="form-control" id="rentBase" ref="rentBase" min="0"
                            defaultValue={this.invoice == null ? 0 : this.invoice.rentBase} readOnly={true} />
                    </div> : null}
                {this.rent ?
                    <div class="col">
                        <label>{i18next.t('rent-percentage')}</label>
                        <input type="number" class="form-control" id="rentPercentage" ref="rentPercentage" min="0" max="100"
                            defaultValue={this.invoice == null ? 0 : this.invoice.rentPercentage} readOnly={this.invoice != null} />
                    </div> : null}
                {this.rent ?
                    <div class="col">
                        <label>{i18next.t('rent-value')}</label>
                        <input type="number" class="form-control" id="rentValue" ref="rentValue" readOnly={true}
                            defaultValue={this.invoice == null ? 0 : this.invoice.rentValue} readOnly={true} />
                    </div> : null}
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="form-row salesOrderTotals">
                        <div class="col">
                            <TextField label={i18next.t('total-products')} inputRef={this.totalProducts} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('vat-amount')} inputRef={this.vatAmount} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('discount-percent')} inputRef={this.discountPercent} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.invoice !== undefined && this.invoice.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.discountPercent : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('fix-discount')} inputRef={this.fixDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.invoice !== undefined && this.invoice.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.fixDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-price')} inputRef={this.shippingPrice} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.invoice !== undefined && this.invoice.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.shippingPrice : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-discount')} inputRef={this.shippingDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.invoice !== undefined && this.invoice.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.shippingDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-with-discount')} inputRef={this.totalWithDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.totalWithDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-amount')} inputRef={this.totalAmount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.invoice !== undefined ? this.invoice.totalAmount : '0'} />
                        </div>
                    </div>

                    <div>
                        {this.invoice != null ? <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Options
                        </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onClick={this.amendingInvoice}>{i18next.t('amending-invoice')}</a>
                                {this.invoice != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                            </div>
                        </div> : null}
                        {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurcaseInvoices}>{i18next.t('cancel')}</button>
                        {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div >
    }
}

export default PurchaseInvoiceForm;
