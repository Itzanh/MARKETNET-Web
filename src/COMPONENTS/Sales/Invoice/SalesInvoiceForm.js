import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import SalesInvoiceDetails from "./SalesInvoiceDetails";
import SalesInvoiceRelations from "./SalesInvoiceRelations";
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
import SalesInvoiceAmending from "./SalesInvoiceAmending";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import AddressModal from "../../Masters/Addresses/AddressModal";
import CustomerForm from "../../Masters/Customers/CustomerForm";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import AccountingMovementForm from "../../Accounting/AccountingMovements/AccountingMovementForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class SalesInvoiceForm extends Component {
    constructor({ invoice, findCustomerByName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName,
        getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesInvoices, defaultValueNameCustomer, defaultValueNamePaymentMethod,
        defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameBillingAddress, findProductByName, getOrderDetailsDefaults,
        getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail, addSalesInvoice, deleteSalesInvoice,
        getSalesInvoiceRelations, documentFunctions, getSalesInvoicesRow, getCustomerRow, sendEmail, locateProduct, locateCustomers,
        toggleSimplifiedInvoiceSalesInvoice, makeAmendingSaleInvoice, locateCurrency, locatePaymentMethods, locateBillingSeries, invoiceDeletePolicy,
        getRegisterTransactionalLogs, getAddressesFunctions, getCustomersFunctions, getSalesOrdersFunctions, getSalesDeliveryNotesFunctions,
        getAccountingMovementsFunction, getProductFunctions, getSalesInvoicesFuntions }) {
        super();

        this.invoice = invoice;

        this.findCustomerByName = findCustomerByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesInvoices = tabSalesInvoices;

        this.defaultValueNameCustomer = defaultValueNameCustomer;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.defaultValueNameCurrency = defaultValueNameCurrency;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.addSalesInvoice = addSalesInvoice;
        this.deleteSalesInvoice = deleteSalesInvoice;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;
        this.documentFunctions = documentFunctions;
        this.getSalesInvoicesRow = getSalesInvoicesRow;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;
        this.toggleSimplifiedInvoiceSalesInvoice = toggleSimplifiedInvoiceSalesInvoice;
        this.makeAmendingSaleInvoice = makeAmendingSaleInvoice;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.invoiceDeletePolicy = invoiceDeletePolicy;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getCustomersFunctions = getCustomersFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getSalesDeliveryNotesFunctions = getSalesDeliveryNotesFunctions;
        this.getAccountingMovementsFunction = getAccountingMovementsFunction;
        this.getProductFunctions = getProductFunctions;
        this.getSalesInvoicesFuntions = getSalesInvoicesFuntions;

        this.currentSelectedCustomerId = invoice != null ? invoice.customer : null;
        this.currentSelectedPaymentMethodId = invoice != null ? invoice.paymentMethod : null;
        this.currentSelectedCurrencyId = invoice != null ? invoice.currency : null;
        this.currentSelectedBillingSerieId = invoice != null ? invoice.billingSeries : null;
        this.currentSelectedBillingAddress = invoice != null ? invoice.billingAddress : null;

        this.tab = 0;

        this.customerName = React.createRef();
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
        this.report = this.report.bind(this);
        this.email = this.email.bind(this);
        this.locateCustomer = this.locateCustomer.bind(this);
        this.amendingInvoice = this.amendingInvoice.bind(this);
        this.addBillingAddr = this.addBillingAddr.bind(this);
        this.editBillingAddr = this.editBillingAddr.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
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
                ReactDOM.render(components, document.getElementById("renderCurrency"));

                document.getElementById("renderCurrency").disabled = this.invoice !== undefined;
                document.getElementById("renderCurrency").value = this.invoice != null ? "" + this.invoice.currency : "0";
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
                ReactDOM.render(components, document.getElementById("renderPaymentMethod"));

                document.getElementById("renderPaymentMethod").disabled = this.invoice !== undefined;
                document.getElementById("renderPaymentMethod").value = this.invoice != null ? this.invoice.paymentMethod : "0";
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
                ReactDOM.render(components, document.getElementById("renderBillingSerie"));

                document.getElementById("renderBillingSerie").disabled = this.invoice !== undefined;
                document.getElementById("renderBillingSerie").value = this.invoice != null ? this.invoice.billingSeries : "0";
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
        ReactDOM.render(<SalesInvoiceDetails
            addNow={addNow}
            invoiceId={this.invoice == null ? null : this.invoice.id}
            findProductByName={this.findProductByName}
            getOrderDetailsDefaults={this.getOrderDetailsDefaults}
            getSalesInvoiceDetails={this.getSalesInvoiceDetails}
            locateProduct={this.locateProduct}
            getProductFunctions={this.getProductFunctions}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            addSalesInvoiceDetail={(detail) => {
                if (this.invoice == null) {
                    this.add(true);
                    return;
                }
                return new Promise((resolve) => {
                    this.addSalesInvoiceDetail(detail).then((ok) => {
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
            deleteSalesInvoiceDetail={(detailId) => {
                return new Promise((resolve) => {
                    this.deleteSalesInvoiceDetail(detailId).then((ok) => {
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
        ReactDOM.render(<SalesInvoiceRelations
            invoiceId={this.invoice == null ? null : this.invoice.id}
            getSalesInvoiceRelations={this.getSalesInvoiceRelations}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
            getSalesDeliveryNotesFunctions={this.getSalesDeliveryNotesFunctions}
            getSalesInvoicesFuntions={this.getSalesInvoicesFuntions}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            saleInvoiceId={this.invoice == null ? null : this.invoice.id}
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
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.billingAddress.current.value = addressName;
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
            document.getElementById("renderPaymentMethod").value = defaults.paymentMethod;
            document.getElementById("renderPaymentMethod").disabled = this.invoice != null;

            this.currentSelectedCurrencyId = defaults.currency;
            document.getElementById("renderCurrency").value = defaults.currency;
            document.getElementById("renderCurrency").disabled = this.invoice != null;
            this.currencyChange.current.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            document.getElementById("renderBillingSerie").value = defaults.billingSeries;
            document.getElementById("renderBillingSerie").disabled = this.invoice != null;

            this.currentSelectedBillingAddress = defaults.mainBillingAddress;
            this.billingAddress.current.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getSalesInvoiceFromForm() {
        const salesInvoice = {};
        salesInvoice.customer = parseInt(this.currentSelectedCustomerId);
        salesInvoice.billingAddress = this.currentSelectedBillingAddress;
        salesInvoice.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        salesInvoice.billingSeries = this.currentSelectedBillingSerieId;
        salesInvoice.currency = parseInt(this.currentSelectedCurrencyId);
        salesInvoice.discountPercent = parseFloat(this.discountPercent.current.value);
        salesInvoice.fixDiscount = parseFloat(this.fixDiscount.current.value);
        salesInvoice.shippingPrice = parseFloat(this.shippingPrice.current.value);
        salesInvoice.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        return salesInvoice;
    }

    isValid(invoices) {
        var errorMessage = "";
        if (invoices.customer === null || invoices.customer <= 0 || isNaN(invoices.customer)) {
            errorMessage = i18next.t('no-customer');
            return errorMessage;
        }
        if (invoices.paymentMethod === null || invoices.paymentMethod <= 0 || isNaN(invoices.paymentMethod)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (invoices.billingSeries === null || invoices.billingSeries.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (invoices.currency === null || invoices.currency <= 0 || isNaN(invoices.currency)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (invoices.billingAddress === null || invoices.billingAddress <= 0 || isNaN(invoices.billingAddress)) {
            errorMessage = i18next.t('no-billing-address');
            return errorMessage;
        }
        return errorMessage;
    }

    add(addNow = false) {
        const invoices = this.getSalesInvoiceFromForm();
        const errorMessage = this.isValid(invoices);
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

        this.addSalesInvoice(invoices).then((invoice) => {
            if (invoice != null) {
                this.invoice = invoice;
                this.forceUpdate();
                this.tabDetails(addNow);
                document.getElementById("renderPaymentMethod").disabled = this.invoice != null;
                document.getElementById("renderCurrency").disabled = this.invoice != null;
                document.getElementById("renderBillingSerie").disabled = this.invoice != null;
            }
        });
    }

    delete() {
        if (this.invoice.accountingMovement != null) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('cant-delete-invoice')}
                modalText={i18next.t('cant-delete-posted-invoices')}
            />, this.refs.render);
        }
        else if (this.invoiceDeletePolicy == 2) { // Never allow invoice deletion
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
                        this.deleteSalesInvoice(this.invoice.id).then((ok) => {
                            if (ok.ok) {
                                this.tabSalesInvoices();
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
            const invoice = await this.getSalesInvoicesRow(this.invoice.id);

            this.totalProducts.current.value = invoice.totalProducts;
            this.vatAmount.current.value = invoice.vatAmount;
            this.totalWithDiscount.current.value = invoice.totalWithDiscount;
            this.totalAmount.current.value = invoice.totalAmount;
            resolve();
        });
    }

    report() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ReportModal
                resource="SALES_INVOICE"
                documentId={this.invoice.id}
                grantDocumentAccessToken={this.documentFunctions.grantDocumentAccessToken}
            />,
            document.getElementById('renderAddressModal'));
    }

    async email() {
        if (this.invoice == null) {
            return;
        }
        const customer = await this.getCustomerRow(this.invoice.customer);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={customer.email}
                destinationAddressName={customer.fiscalName}
                subject="Sales invoice"
                reportId="SALES_INVOICE"
                reportDataId={this.invoice.id}
                languageId={customer.language}
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

    amendingInvoice() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderAddressModal"));
        ReactDOM.render(<SalesInvoiceAmending
            invoiceId={this.invoice.id}
            makeAmendingSaleInvoice={this.makeAmendingSaleInvoice}
        />, document.getElementById("renderAddressModal"));
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
                                    this.refs.shippingAddres.value = "";
                                    this.billingAddress.current.value = "";
                                }
                            })
                        })
                    }}
                />
            </DialogContent>
        </Dialog>, document.getElementById("renderAddressModal"));
    }

    transactionLog() {
        if (this.invoice == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"sales_invoice"}
            registerId={this.invoice.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div id="tabSaleInvoice" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('sale-invoice')} {this.invoice == null ? "" : this.invoice.invoiceName}</h4>
            <div className="bagdes">
                {this.invoice != null && this.invoice.simplifiedInvoice ? <span class="badge badge-primary">{i18next.t('simplified-invoice')}</span> : null}
                {this.invoice != null && this.invoice.accountingMovement ?
                    <span class="badge badge-danger">{i18next.t('posted')}</span> : <span class="badge badge-warning">{i18next.t('not-posted')}</span>}
                {this.invoice != null && this.invoice.amending ? <span class="badge badge-info">{i18next.t('amending-invoice')}</span> : null}
            </div>
            <div class="form-row mt-2">
                <div class="col">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.invoice != null ? window.dateFormat(new Date(this.invoice.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}
                                disabled={this.invoice != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editCustomer}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addCustomer}
                                disabled={this.invoice != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('customer')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.customerName} defaultValue={this.defaultValueNameCustomer} />
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
                            inputRef={this.billingAddress} defaultValue={this.defaultValueNameBillingAddress} />
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
                                    id="renderBillingSerie"
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
                                    id="renderCurrency"
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
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPaymentMethod"
                                    onChange={(e) => {
                                        this.currentSelectedPaymentMethodId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch">
                                <input class="form-check-input custom-control-input" type="checkbox" id="simplifiedInvoice"
                                    defaultChecked={this.invoice != null && this.invoice.simplifiedInvoice} disabled={this.invoice == null} onChange={() => {
                                        this.toggleSimplifiedInvoiceSalesInvoice(this.invoice.id);
                                    }} />
                                <label class="form-check-label custom-control-label"
                                    htmlFor="simplifiedInvoice">{i18next.t('simplified-invoice')}</label>
                            </div>
                        </div>
                    </div>
                </div>
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
                                <a class="dropdown-item" href="#" onClick={this.report}>{i18next.t('report')}</a>
                                <a class="dropdown-item" href="#" onClick={this.email}>{i18next.t('email')}</a>
                                <a class="dropdown-item" href="#" onClick={this.amendingInvoice}>{i18next.t('amending-invoice')}</a>
                                {this.invoice != null ?
                                    <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                            </div>
                        </div> : null}
                        {this.invoice != null ?
                            <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabSalesInvoices}>{i18next.t('cancel')}</button>
                        {this.invoice == null ?
                            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceForm;
