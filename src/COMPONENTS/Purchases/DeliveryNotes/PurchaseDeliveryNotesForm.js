import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import PurchaseDeliveryNoteDetails from "./PurchaseDeliveryNoteDetails";
import PurchaseDeliveryNotesRelations from "./PurchaseDeliveryNotesRelations";
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
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";



class PurchaseDeliveryNotesForm extends Component {
    constructor({ note, findSupplierByName, getCustomerName, findPaymentMethodByName, getNamePaymentMethod, findCurrencyByName, getNameCurrency,
        findBillingSerieByName, getNameBillingSerie, getSupplierDefaults, locateAddress, tabPurchaseDeliveryNotes,
        findProductByName,
        getOrderDetailsDefaults, getPurchaseDeliveryNoteDetails, getNameProduct, addPurchaseDeliveryNotes, deletePurchaseDeliveryNotes,
        getSalesDeliveryNoteDetails, addWarehouseMovements, deleteWarehouseMovements, getPurchaseDeliveryNotesRelations, documentFunctions,
        getPurchaseDeliveryNoteRow, locateSuppliers, locateProduct, getSupplierRow, locateCurrency, locatePaymentMethods, locateBillingSeries,
        getRegisterTransactionalLogs, getWarehouses, getSupplierFuntions, getAddressesFunctions, getPurchaseOrdersFunctions, getProductFunctions }) {
        super();

        this.note = note;

        this.findSupplierByName = findSupplierByName;
        this.getCustomerName = getCustomerName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getSupplierDefaults = getSupplierDefaults;
        this.locateAddress = locateAddress;
        this.tabPurchaseDeliveryNotes = tabPurchaseDeliveryNotes;
        this.documentFunctions = documentFunctions;
        this.getPurchaseDeliveryNoteRow = getPurchaseDeliveryNoteRow;

        this.defaultValueNameSupplier = this.note == null ? '' : this.note.supplier.name;

        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.getNameProduct = getNameProduct;
        this.addPurchaseDeliveryNotes = addPurchaseDeliveryNotes;
        this.deletePurchaseDeliveryNotes = deletePurchaseDeliveryNotes;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
        this.locateSuppliers = locateSuppliers;
        this.locateProduct = locateProduct;
        this.getSupplierRow = getSupplierRow;
        this.locateCurrency = locateCurrency;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;

        this.getSupplierFuntions = getSupplierFuntions;
        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getProductFunctions = getProductFunctions;

        this.currentSelectedSupplierId = note != null ? note.supplierId : null;
        this.currentSelectedPaymentMethodId = note != null ? note.paymentMethodId : null;
        this.currentSelectedCurrencyId = note != null ? note.currencyId : null;
        this.currentSelectedBillingSerieId = note != null ? note.billingSeriesId : null;
        this.currentSelectedShippingAddress = note != null ? note.shippingAddressId : null;

        this.tab = 0;

        this.reference = React.createRef();
        this.supplierName = React.createRef();
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
        this.locateSupplier = this.locateSupplier.bind(this);
        this.editSupplier = this.editSupplier.bind(this);
        this.addSupplier = this.addSupplier.bind(this);
        this.editShippingAddr = this.editShippingAddr.bind(this);
        this.addShippingAddr = this.addShippingAddr.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderCurrencies();
        await this.renderPurchaseDeliveryNotePaymentMethod();
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
                ReactDOM.render(components, document.getElementById("renderPurchaseDelieryNoteCurrency"));

                document.getElementById("renderPurchaseDelieryNoteCurrency").disabled = this.note !== undefined;
                document.getElementById("renderPurchaseDelieryNoteCurrency").value = this.note != null ? "" + this.note.currencyId : "0";
            });
        });
    }

    renderPurchaseDeliveryNotePaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, document.getElementById("renderPurchaseDeliveryNotePaymentMethod"));

                document.getElementById("renderPurchaseDeliveryNotePaymentMethod").disabled = this.note !== undefined;
                document.getElementById("renderPurchaseDeliveryNotePaymentMethod").value = this.note != null ? this.note.paymentMethodId : "0";
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
                ReactDOM.render(components, document.getElementById("renderPurchaseDeliveryNoteBillingSerie"));

                document.getElementById("renderPurchaseDeliveryNoteBillingSerie").disabled = this.note !== undefined;
                document.getElementById("renderPurchaseDeliveryNoteBillingSerie").value = this.note != null ? this.note.billingSeriesId : "";
            });
        });
    }

    renderWarehouses() {
        return new Promise((resolve) => {
            this.getWarehouses().then((warehouses) => {
                resolve();
                warehouses.unshift({ id: "", name: "." + i18next.t('none') });

                ReactDOM.render(warehouses.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                }), document.getElementById("renderPurchaseDeliveryNoteWarehouse"));

                if (this.note == null) {
                    document.getElementById("renderPurchaseDeliveryNoteWarehouse").value = "";
                } else {
                    document.getElementById("renderPurchaseDeliveryNoteWarehouse").value = this.note.warehouseId;
                    document.getElementById("renderPurchaseDeliveryNoteWarehouse").disabled = true;
                }
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

    tabDetails(addNow = false) {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<PurchaseDeliveryNoteDetails
            addNow={addNow}
            noteId={this.note == null ? null : this.note.id}
            warehouseId={document.getElementById("renderPurchaseDeliveryNoteWarehouse").value}
            findProductByName={this.findProductByName}
            getPurchaseDeliveryNoteDetails={this.getPurchaseDeliveryNoteDetails}
            addSalesInvoiceDetail={this.addSalesInvoiceDetail}
            getNameProduct={this.getNameProduct}
            deleteSalesInvoiceDetail={this.deleteSalesInvoiceDetail}
            locateProduct={this.locateProduct}
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
        ReactDOM.render(<PurchaseDeliveryNotesRelations
            noteId={this.note === null ? null : this.note.id}
            getPurchaseDeliveryNotesRelations={this.getPurchaseDeliveryNotesRelations}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}

        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            purchaseDeliveryNoteId={this.note == null ? null : this.note.id}
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
                    return this.locateAddress(this.currentSelectedSupplierId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.shippingAddress.current.value = addressName;
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
            document.getElementById("renderPurchaseDeliveryNotePaymentMethod").value = defaults.paymentMethod == null ? '0' : defaults.paymentMethod;
            document.getElementById("renderPurchaseDeliveryNotePaymentMethod").disabled = this.note != null;

            this.currentSelectedCurrencyId = defaults.currency;
            document.getElementById("renderPurchaseDelieryNoteCurrency").value = defaults.currency == null ? '0' : defaults.currency;
            document.getElementById("renderPurchaseDelieryNoteCurrency").disabled = this.note != null;
            this.currencyChange.current.value = defaults.currencyChange;

            this.currentSelectedBillingSerieId = defaults.billingSeries;
            document.getElementById("renderPurchaseDeliveryNoteBillingSerie").value = defaults.billingSeries == null ? '' : defaults.billingSeries;
            document.getElementById("renderPurchaseDeliveryNoteBillingSerie").disabled = this.note != null;

            this.currentSelectedShippingAddress = defaults.mainBillingAddress;
            this.shippingAddress.current.value = defaults.mainBillingAddressName;
            this.currentSelectedShippingAddress = defaults.mainShippingAddress;
        });
    }

    getPurchaseDeliveryNoteFromForm() {
        const deliveryNote = {};
        deliveryNote.supplierId = parseInt(this.currentSelectedSupplierId);
        deliveryNote.shippingAddressId = this.currentSelectedShippingAddress;
        deliveryNote.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        deliveryNote.billingSeriesId = this.currentSelectedBillingSerieId;
        deliveryNote.currencyId = parseInt(this.currentSelectedCurrencyId);
        deliveryNote.discountPercent = parseFloat(this.discountPercent.current.value);
        deliveryNote.fixDiscount = parseFloat(this.fixDiscount.current.value);
        deliveryNote.shippingPrice = parseFloat(this.shippingPrice.current.value);
        deliveryNote.shippingDiscount = parseFloat(this.shippingDiscount.current.value);
        deliveryNote.warehouseId = document.getElementById("renderPurchaseDeliveryNoteWarehouse").value;
        return deliveryNote;
    }

    isValid(deliveryNote) {
        var errorMessage = "";
        if (deliveryNote.warehouseId === null || deliveryNote.warehouseId.length === 0) {
            errorMessage = i18next.t('no-warehouse');
            return errorMessage;
        }
        if (deliveryNote.supplierId === null || deliveryNote.supplierId <= 0 || isNaN(deliveryNote.supplierId)) {
            errorMessage = i18next.t('no-supplier');
            return errorMessage;
        }
        if (deliveryNote.paymentMethodId === null || deliveryNote.paymentMethodId <= 0 || isNaN(deliveryNote.paymentMethodId)) {
            errorMessage = i18next.t('no-payment-method');
            return errorMessage;
        }
        if (deliveryNote.billingSeriesId === null || deliveryNote.billingSeriesId.length === 0) {
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
        const deliveryNote = this.getPurchaseDeliveryNoteFromForm();
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

        this.addPurchaseDeliveryNotes(deliveryNote).then((note) => {
            if (note != null) {
                this.note = note;
                this.forceUpdate();
                this.tabDetails(addNow);
                document.getElementById("renderPurchaseDeliveryNotePaymentMethod").disabled = this.note != null;
                document.getElementById("renderPurchaseDelieryNoteCurrency").disabled = this.note != null;
                document.getElementById("renderPurchaseDelieryNoteCurrency").disabled = this.note != null;
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deletePurchaseDeliveryNotes(this.note.id).then((ok) => {
                        if (ok) {
                            this.tabPurchaseDeliveryNotes();
                        }
                    });
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    refreshTotals() {
        return new Promise(async (resolve) => {
            const note = await this.getPurchaseDeliveryNoteRow(this.note.id);

            this.totalProducts.current.value = note.totalProducts;
            this.vatAmount.current.value = note.totalVat;
            this.totalWithDiscount.current.value = note.totalWithDiscount;
            this.totalAmount.current.value = note.totalAmount;
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
        if (this.note == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"purchase_delivery_note"}
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
                defaultValueNameSupplier={this.note == null ? '' : this.note.supplier.name}
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
                                this.refs.shippingAddress.value = address.address;
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
        return <div id="tabPurchaseDeliveryNote" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('purchase-delivery-note')} {this.note == null ? "" : this.note.deliveryNoteName}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.note != null ? window.dateFormat(new Date(this.note.dateCreated)) : ''} />
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPurchaseDeliveryNoteWarehouse"
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}
                                disabled={this.note != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editSupplier}><EditIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.addSupplier}
                                disabled={this.note != null}><AddIcon /></button>
                        </div>
                        <TextField label={i18next.t('supplier')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.supplierName} defaultValue={this.defaultValueNameSupplier} />
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
                            inputRef={this.shippingAddress} defaultValue={this.note == null ? '' : this.note.shippingAddress.address} />
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
                                    id="renderPurchaseDeliveryNotePaymentMethod"
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
                                    id="renderPurchaseDelieryNoteCurrency"
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
                            id="renderPurchaseDeliveryNoteBillingSerie"
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
                                InputProps={{ readOnly: true }} size="small" defaultValue={this.note != null ? this.note.totalVat : '0'} />
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
                                {this.note != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                            </div>
                        </div>
                        {this.note != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabPurchaseDeliveryNotes}>{i18next.t('cancel')}</button>
                        {this.note == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PurchaseDeliveryNotesForm;
