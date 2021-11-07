import { Component } from "react";
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

// IMG
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import AccountingMovementForm from "../../Accounting/AccountingMovements/AccountingMovementForm";



class PurchaseInvoiceForm extends Component {
    constructor({ invoice, findSupplierByName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurcaseInvoices, defaultValueNameSupplier, defaultValueNamePaymentMethod,
        defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults,
        getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, getNameProduct, deletePurchaseInvoiceDetail, addPurchaseInvoice, deletePurchaseInvoice,
        getPurchaseInvoiceRelations, documentFunctions, getPurchaseInvoiceRow, locateSuppliers, locateProduct, makeAmendingPurchaseInvoice,
        getSupplierRow, locateCurrency, locatePaymentMethods, locateBillingSeries, invoiceDeletePolicy, getSupplierFuntions, getAddressesFunctions,
        getPurchaseOrdersFunctions, getAccountingMovementsFunction, getProductFunctions, getPurcaseInvoicesFunctions }) {
        super();

        this.invoice = invoice;

        this.findSupplierByName = findSupplierByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurcaseInvoices = tabPurcaseInvoices;
        this.makeAmendingPurchaseInvoice = makeAmendingPurchaseInvoice;

        this.defaultValueNameSupplier = defaultValueNameSupplier;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.getNameProduct = getNameProduct;
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

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getAccountingMovementsFunction = getAccountingMovementsFunction;
        this.getProductFunctions = getProductFunctions;
        this.getPurcaseInvoicesFunctions = getPurcaseInvoicesFunctions;

        this.currentSelectedSupplierId = invoice != null ? invoice.supplier : null;
        this.currentSelectedPaymentMethodId = invoice != null ? invoice.paymentMethod : null;
        this.currentSelectedCurrencyId = invoice != null ? invoice.currency : null;
        this.currentSelectedBillingSerieId = invoice != null ? invoice.billingSeries : null;
        this.currentSelectedBillingAddress = invoice != null ? invoice.billingAddress : null;

        this.tab = 0;

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

                this.refs.renderCurrency.disabled = this.invoice !== undefined;
                this.refs.renderCurrency.value = this.invoice != null ? "" + this.invoice.currency : "0";
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

                this.refs.renderPaymentMethod.disabled = this.invoice !== undefined;
                this.refs.renderPaymentMethod.value = this.invoice != null ? this.invoice.paymentMethod : "0";
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

                this.refs.renderBillingSerie.disabled = this.invoice !== undefined;
                this.refs.renderBillingSerie.value = this.invoice != null ? this.invoice.billingSeries : "0";
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
            getNameProduct={this.getNameProduct}
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
        const movement = await commonProps.getAccountingMovementRow(this.invoice.accountingMovement);

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
                    this.refs.billingAddress.value = addressName;
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
            this.refs.renderPaymentMethod.value = defaults.paymentMethod;
            this.refs.renderPaymentMethod.disabled = this.invoice != null;

            this.currentSelectedCurrencyId = defaults.currency;
            this.refs.renderCurrency.value = defaults.currency;
            this.refs.renderCurrency.disabled = this.invoice != null;

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            this.refs.renderBillingSerie.value = defaults.billingSeries;
            this.refs.renderBillingSerie.disabled = this.invoice != null;

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.refs.billingAddress.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getPurchaseInvoiceFromForm() {
        const invoice = {};
        invoice.supplier = parseInt(this.currentSelectedSupplierId);
        invoice.billingAddress = this.currentSelectedBillingAddress;
        invoice.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        invoice.billingSeries = this.currentSelectedBillingSerieId;
        invoice.currency = parseInt(this.currentSelectedCurrencyId);
        invoice.discountPercent = parseFloat(this.refs.discountPercent.value);
        invoice.fixDiscount = parseFloat(this.refs.fixDiscount.value);
        invoice.shippingPrice = parseFloat(this.refs.shippingPrice.value);
        invoice.shippingDiscount = parseFloat(this.refs.shippingDiscount.value);
        return invoice;
    }

    isValid(invoice) {
        var errorMessage = "";
        if (invoice.supplier === null || invoice.supplier <= 0 || isNaN(invoice.supplier)) {
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (invoice.paymentMethod === null || invoice.paymentMethod <= 0 || isNaN(invoice.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (invoice.billingSeries === null || invoice.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (invoice.currency === null || invoice.currency <= 0 || isNaN(invoice.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (invoice.billingAddress === null || invoice.billingAddress <= 0 || isNaN(invoice.billingAddress)) {
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
                this.refs.renderPaymentMethod.disabled = this.invoice != null;
                this.refs.renderCurrency.disabled = this.invoice != null;
                this.refs.renderBillingSerie.disabled = this.invoice != null;
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
                            if (ok) {
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

            this.refs.totalProducts.value = order.totalProducts;
            this.refs.vatAmount.value = order.vatAmount;
            this.refs.totalWithDiscount.value = order.totalWithDiscount;
            this.refs.totalAmount.value = order.totalAmount;
            resolve();
        });
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
        return <div id="tabPurchaseInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('purchase-invoice')} {this.invoice == null ? "" : this.invoice.id}</h4>
            <div className="bagdes">
                {this.invoice != null && this.invoice.simplifiedInvoice ? <span class="badge badge-primary">{i18next.t('simplified-invoice')}</span> : null}
                {this.invoice != null && this.invoice.accountingMovement ?
                    <span class="badge badge-danger">{i18next.t('posted')}</span> : <span class="badge badge-warning">{i18next.t('not-posted')}</span>}
                {this.invoice != null && this.invoice.amending ? <span class="badge badge-info">{i18next.t('amending-invoice')}</span> : null}
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>{i18next.t('supplier')}</label>
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
                        <input type="text" class="form-control" ref="supplierName" defaultValue={this.defaultValueNameSupplier}
                            readOnly={true} style={{ 'width': '70%' }} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-address')}</label>
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
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameBillingAddress} readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Order Number</label>
                            <input type="number" class="form-control" defaultValue={this.invoice != null ? this.invoice.invoiceNumber : ''} readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('currency')}</label>
                            <div>
                                <select class="form-control" ref="renderCurrency" onChange={() => {
                                    this.currentSelectedCurrencyId = this.refs.renderCurrency.value == "0" ? null : this.refs.renderCurrency.value;
                                }}>

                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('currency-exchange')}</label>
                            <input type="number" class="form-control" ref="currencyChange" readOnly={true}
                                defaultValue={this.invoice != null ? this.invoice.currencyChange : ''} />
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
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('billing-serie')}</label>
                    <div>
                        <select class="form-control" ref="renderBillingSerie" onChange={() => {
                            this.currentSelectedBillingSerieId = this.refs.renderBillingSerie.value == "0" ? null : this.refs.renderBillingSerie.value;
                        }}>

                        </select>
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
                            <input type="number" class="form-control" ref="totalProducts" defaultValue={this.invoice != null ? this.invoice.totalProducts : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-amount')}</label>
                            <input type="number" class="form-control" ref="vatAmount" defaultValue={this.invoice != null ? this.invoice.vatAmount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('discount-percent')}</label>
                            <input type="number" class="form-control" ref="discountPercent"
                                defaultValue={this.invoice != null ? this.invoice.discountPercent : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fix-discount')}</label>
                            <input type="number" class="form-control" ref="fixDiscount"
                                defaultValue={this.invoice != null ? this.invoice.fixDiscount : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-price')}</label>
                            <input type="number" class="form-control" ref="shippingPrice"
                                defaultValue={this.invoice != null ? this.invoice.shippingPrice : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('shipping-discount')}</label>
                            <input type="number" class="form-control" ref="shippingDiscount"
                                defaultValue={this.invoice != null ? this.invoice.shippingDiscount : '0'}
                                readOnly={this.invoice !== undefined && this.invoice.status !== "_"} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-with-discount')}</label>
                            <input type="number" class="form-control" ref="totalWithDiscount"
                                defaultValue={this.invoice !== undefined ? this.invoice.totalWithDiscount : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.invoice !== undefined ? this.invoice.totalAmount : '0'}
                                readOnly={true} />
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
                            </div>
                        </div> : null}
                        {this.invoice != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurcaseInvoices}>{i18next.t('cancel')}</button>
                        {this.invoice == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseInvoiceForm;
