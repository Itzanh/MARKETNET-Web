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
import CustomerForm from "../../Masters/Customers/CustomerForm";
import AddressModal from "../../Masters/Addresses/AddressModal";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class SalesDeliveryNotesForm extends Component {
    constructor({ note, findCustomerByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress, tabSalesDeliveryNotes, defaultValueNameCustomer,
        defaultValueNamePaymentMethod, defaultValueNameCurrency, defaultValueNameBillingSerie, defaultValueNameShippingAddress, findProductByName,
        getOrderDetailsDefaults, getSalesInvoiceDetails, getNameProduct, addSalesDeliveryNotes, deleteSalesDeliveryNotes, getSalesDeliveryNoteDetails,
        addWarehouseMovements, deleteWarehouseMovements, getSalesDeliveryNotesRelations, findWarehouseByName, documentFunctions, getCustomerRow, sendEmail,
        getSalesDeliveryNoteRow, locateProduct, locateCustomers, locateCurrency, locatePaymentMethods, locateBillingSeries, getRegisterTransactionalLogs,
        getWarehouses, getAddressesFunctions, getCustomersFunctions, getSalesOrdersFunctions, getProductFunctions }) {
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

        this.currentSelectedCustomerId = note != null ? note.customer : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethod : null;
        this.currentSelectedCurrencyId = note != null ? note.currency : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeries : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddress : null;

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
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPaymentMethod();
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

                this.refs.renderCurrency.disabled = this.note !== undefined && this.note.status !== "_";
                this.refs.renderCurrency.value = this.note != null ? "" + this.note.currency : "0";
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

                this.refs.renderPaymentMethod.disabled = this.note !== undefined && this.note.status !== "_";
                this.refs.renderPaymentMethod.value = this.note != null ? this.note.paymentMethod : "0";
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

                this.refs.renderBillingSerie.disabled = this.note !== undefined;
                this.refs.renderBillingSerie.value = this.note != null ? this.note.billingSeries : "0";
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
                        selected={this.note == null ? element.id = "" : element.id == this.note.warehouse}>{element.name}</option>
                }), this.refs.warehouse);
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
            warehouseId={this.refs.warehouse.value}
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
            this.refs.renderPaymentMethod.value = defaults.paymentMethod;
            this.refs.renderPaymentMethod.disabled = this.note != null;

            this.currentSelectedCurrencyId = defaults.currency;
            this.refs.renderCurrency.value = defaults.currency;
            this.refs.renderCurrency.disabled = this.note != null;

            this.refs.currencyChange.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            this.refs.renderBillingSerie.value = defaults.billingSeries;
            this.refs.renderBillingSerie.disabled = this.note != null;

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
        deliveryNote.warehouse = this.refs.warehouse.value;
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
                this.refs.renderPaymentMethod.disabled = this.note != null;
                this.refs.renderCurrency.disabled = this.note != null;
                this.refs.renderCurrency.disabled = this.note != null;
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
        return <div id="tabSaleDeliveryNote" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4 className="ml-2">{i18next.t('sales-delivery-note')} {this.note == null ? "" : this.note.deliveryNoteName}</h4>
            <hr className="titleHr" />
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
                            <select id="warehouse" ref="warehouse" class="form-control" disabled={this.note != null}>
                            </select>
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
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editCustomer}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addCustomer}
                                disabled={this.note != null}><AddIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="customerName" defaultValue={this.defaultValueNameCustomer}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('shipping-address')}</label>
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
                                defaultValue={this.note != null ? this.note.currencyChange : ''} />
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
