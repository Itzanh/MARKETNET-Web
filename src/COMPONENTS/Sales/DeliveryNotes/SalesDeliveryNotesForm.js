import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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
import CustomerForm from "../../Masters/Customers/CustomerForm";
import AddressModal from "../../Masters/Addresses/AddressModal";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class SalesDeliveryNotesForm extends Component {
    constructor({ note, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesDeliveryNotes,
        findProductByName,
        getOrderDetailsDefaults, getSalesInvoiceDetails, getNameProduct, addSalesDeliveryNotes, deleteSalesDeliveryNotes, getSalesDeliveryNoteDetails,
        addWarehouseMovements, deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, documentFunctions, getCustomerRow, sendEmail,
        getSalesDeliveryNoteRow, locateProduct, locateCustomers, locateCurrency, locatePaymentMethods, locateBillingSeries, getRegisterTransactionalLogs,
        getWarehouses, getAddressesFunctions, getCustomersFunctions, getSalesOrdersFunctions, getProductFunctions, getShippingFunctions }) {
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

        this.defaultValueNameCustomer = this.note != null ? this.note.customer.name : '';

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
        this.documentFunctions = documentFunctions;
        this.getCustomerRow = getCustomerRow;
        this.sendEmail = sendEmail;
        this.getSalesDeliveryNoteRow = getSalesDeliveryNoteRow;
        this.locateProduct = locateProduct;
        this.locateCustomers = locateCustomers;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;

        this.getCustomersFunctions = getCustomersFunctions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getProductFunctions = getProductFunctions;
        this.getShippingFunctions = getShippingFunctions;

        this.currentSelectedCustomerId = note != null ? note.customerId : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethodId : null;
        this.currentSelectedCurrencyId = note != null ? note.currencyId : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeriesId : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddressId : null;

        this.tab = 0;

        this.reference = React.createRef();
        this.customerName = React.createRef();
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
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.tabDetails = this.tabDetails.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.report = this.report.bind(this);
        this.email = this.email.bind(this);
        this.locateCustomer = this.locateCustomer.bind(this);
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderSalesDeliveryNotePaymentMethod();
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
                ReactDOM.render(components, document.getElementById("renderSalesDeliveryNoteCurrency"));

                document.getElementById("renderSalesDeliveryNoteCurrency").disabled = this.note !== undefined && this.note.status !== "_";
                document.getElementById("renderSalesDeliveryNoteCurrency").value = this.note != null ? "" + this.note.currencyId : "0";
            });
        });
    }

    renderSalesDeliveryNotePaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderSalesDeliveryNotePaymentMethod"));

                document.getElementById("renderSalesDeliveryNotePaymentMethod").disabled = this.note !== undefined && this.note.status !== "_";
                document.getElementById("renderSalesDeliveryNotePaymentMethod").value = this.note != null ? this.note.paymentMethodId : "0";
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
                ReactDOM.render(components, document.getElementById("renderSalesDeliveryNoteBillingSerie"));

                document.getElementById("renderSalesDeliveryNoteBillingSerie").disabled = this.note !== undefined;
                document.getElementById("renderSalesDeliveryNoteBillingSerie").value = this.note != null ? this.note.billingSeriesId : "0";
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
            findProductByName={this.findProductByName}
            getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
            locateProduct={this.locateProduct}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
            getProductFunctions={this.getProductFunctions}
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            getWarehouses={this.getWarehouses}
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
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
            getShippingFunctions={this.getShippingFunctions}
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
                    this.shippingAddress.current.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    customerDefaults() {
        if (this.currentSelectedCustomerId === "") {
            return;
        }

        this.getCustomerDefaults(this.currentSelectedCustomerId).then((defaults) => {

            this.currentSelectedPaymentMethodId = defaults.paymentMethodId;
            document.getElementById("renderSalesDeliveryNotePaymentMethod").value = defaults.paymentMethodId != null ? defaults.paymentMethodId : "0";
            document.getElementById("renderSalesDeliveryNotePaymentMethod").disabled = this.note != null;

            this.currentSelectedCurrencyId = defaults.currencyId;
            document.getElementById("renderSalesDeliveryNoteCurrency").value = defaults.currencyId != null ? defaults.currencyId : "0";
            document.getElementById("renderSalesDeliveryNoteCurrency").disabled = this.note != null;

            this.currencyChange.current.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeriesId;
            document.getElementById("renderSalesDeliveryNoteBillingSerie").value = defaults.billingSeriesId != null ? defaults.billingSeriesId : "";
            document.getElementById("renderSalesDeliveryNoteBillingSerie").disabled = this.note != null;

            this.currentSelectedShippingAddress = defaults.mainBillingAddress;
            this.shippingAddress.current.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getSalesDeliveryNoteFromForm() {
        const deliveryNote = {};
        deliveryNote.customerId = parseInt(this.currentSelectedCustomerId);
        deliveryNote.shippingAddressId = this.currentSelectedShippingAddress;
        deliveryNote.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        deliveryNote.billingSeriesId = this.currentSelectedBillingSerieId;
        deliveryNote.currencyId = parseInt(this.currentSelectedCurrencyId);
        deliveryNote.discountPercent = parseFloat(this.discountPercent.current.value);
        deliveryNote.fixDiscount = parseFloat(this.fixDiscount.current.value);
        deliveryNote.shippingPrice = parseFloat(this.shippingPrice.current.value);
        deliveryNote.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        return deliveryNote;
    }

    isValid(deliveryNote) {
        var errorMessage = "";
        if (deliveryNote.customerId === null || deliveryNote.customerId <= 0 || isNaN(deliveryNote.customerId)) {
            errorMessage = i18next.t('no-customer');
            return errorMessage;
        }
        if (deliveryNote.paymentMethodId === null || deliveryNote.paymentMethodId <= 0 || isNaN(deliveryNote.paymentMethodId)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (deliveryNote.billingSeriesId == null || deliveryNote.billingSeriesId.length === 0) {
            errorMessage = i18next.t('no-billing-series');
            return errorMessage;
        }
        if (deliveryNote.currencyId === null || deliveryNote.currencyId <= 0 || isNaN(deliveryNote.currencyId)) {
            errorMessage = i18next.t('no-currency');
            return errorMessage;
        }
        if (deliveryNote.shippingAddressId === null || deliveryNote.shippingAddressId <= 0 || isNaN(deliveryNote.shippingAddressId)) {
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
                document.getElementById("renderSalesDeliveryNotePaymentMethod").disabled = this.note != null;
                document.getElementById("renderSalesDeliveryNoteCurrency").disabled = this.note != null;
                document.getElementById("renderSalesDeliveryNoteCurrency").disabled = this.note != null;
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteSalesDeliveryNotes(this.note.id).then((ok) => {
                        if (ok.ok) {
                            this.tabSalesDeliveryNotes();
                        } else {
                            switch (ok.errorCode) {
                                case 1: {
                                    ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={i18next.t('a-shipping-is-associated-to-this-delivery-note')}
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

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <EmailModal
                sendEmail={this.sendEmail}
                destinationAddress={this.note.customer.email}
                destinationAddressName={this.note.customer.fiscalName}
                subject={i18next.t("sales-delivery-note")}
                reportId="SALES_DELIVERY_NOTE"
                reportDataId={this.note.id}
                languageId={this.note.customer.languageId}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            const note = await this.getSalesDeliveryNoteRow(this.note.id);

            this.totalProducts.current.value = note.totalProducts;
            this.vatAmount.current.value = note.vatAmount;
            this.totalWithDiscount.current.value = note.totalWithDiscount;
            this.totalAmount.current.value = note.totalAmount;
            resolve();
        });
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

    transactionLog() {
        if (this.note == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"sales_delivery_note"}
            registerId={this.note.id}
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
                defaultValueNameCustomer={this.note == null ? '' : this.note.customer.name}
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
                                }
                            })
                        })
                    }}
                />
            </DialogContent>
        </Dialog>, document.getElementById("renderAddressModal"));
    }

    render() {
        return <div id="tabSaleDeliveryNote" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('sales-delivery-note')} {this.note == null ? "" : this.note.deliveryNoteName}</h4>
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                        defaultValue={this.note != null ? window.dateFormat(new Date(this.note.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}
                                disabled={this.note != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editCustomer}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addCustomer}
                                disabled={this.note != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('customer')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.customerName} defaultValue={this.defaultValueNameCustomer} />
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.note != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editShippingAddr}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addShippingAddr}
                                disabled={this.note != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('shipping-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.shippingAddress} defaultValue={this.note != null ? this.note.shippingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('delivery-note-number')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.note != null ? this.note.deliveryNoteNumber : ''} />
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderSalesDeliveryNotePaymentMethod"
                                    onChange={(e) => {
                                        this.currentSelectedPaymentMethodId = e.target.value == "0" ? null : e.target.value;
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
                                    id="renderSalesDeliveryNoteCurrency"
                                    onChange={(e) => {
                                        this.currentSelectedCurrencyId = e.target.value == "0" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('currency-exchange')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.note != null ? this.note.currencyChange : '0'} inputRef={this.currencyChange} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="renderSalesDeliveryNoteBillingSerie"
                            onChange={(e) => {
                                this.currentSelectedBillingSerieId = e.target.value == "" ? null : e.target.value;
                            }}
                        >

                        </NativeSelect>
                    </FormControl>
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="form-row salesOrderTotals">
                        <div class="col">
                            <TextField label={i18next.t('total-products')} inputRef={this.totalProducts} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.note != null ? this.note.totalProducts : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('vat-amount')} inputRef={this.vatAmount} variant="outlined" fullWidth type="number"
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.note != null ? this.note.vatAmount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('discount-percent')} inputRef={this.discountPercent} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.note !== undefined && this.note.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.discountPercent : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('fix-discount')} inputRef={this.fixDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.note !== undefined && this.note.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.fixDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-price')} inputRef={this.shippingPrice} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.note !== undefined && this.note.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.shippingPrice : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('shipping-discount')} inputRef={this.shippingDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: this.note !== undefined && this.note.status !== "_", inputProps: { min: 0 } }}
                                size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.shippingDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-with-discount')} inputRef={this.totalWithDiscount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.totalWithDiscount : '0'} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('total-amount')} inputRef={this.totalAmount} variant="outlined" fullWidth
                                InputProps={{ readOnly: true }} size="small" type="number"
                                defaultValue={this.note !== undefined ? this.note.totalAmount : '0'} />
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
                                {this.note != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
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
