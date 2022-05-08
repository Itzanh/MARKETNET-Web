import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import LocateProduct from "../../Masters/Products/LocateProduct";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Grow from '@mui/material/Grow';
import { TextField } from "@material-ui/core";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import ProductForm from "../../Masters/Products/ProductForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class PurchaseInvoiceDetails extends Component {
    constructor({ invoiceId, findProductByName, getOrderDetailsDefaults, getPurchaseInvoiceDetails, addPurchaseInvoiceDetail, getNameProduct,
        deletePurchaseInvoiceDetail, locateProduct, addNow, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseInvoiceDetails = getPurchaseInvoiceDetails;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.locateProduct = locateProduct;
        this.addNow = addNow;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.printPurchaseInvoiceDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printPurchaseInvoiceDetails() {
        this.getPurchaseInvoiceDetails(this.invoiceId).then((details) => {
            this.renderPurchaseInvoiceDetails(details);
        });
    }

    async renderPurchaseInvoiceDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        if (this.invoiceId == null) {
            this.addPurchaseInvoiceDetail();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseInvoiceDetailsModal'));
        ReactDOM.render(
            <PurchaseInvoiceDetailsModal
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                getProductFunctions={this.getProductFunctions}
                locateProduct={this.locateProduct}
                addPurchaseInvoiceDetail={(detail) => {
                    const promise = this.addPurchaseInvoiceDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('purchaseInvoiceDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseInvoiceDetailsModal'));
        ReactDOM.render(
            <PurchaseInvoiceDetailsModal
                detail={detail}
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                defaultValueNameProduct={detail.productName}
                deletePurchaseInvoiceDetail={(detailId) => {
                    const promise = this.deletePurchaseInvoiceDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('purchaseInvoiceDetailsModal'));
    }

    render() {
        return <div id="purchaseInvoiceDetails">
            <div id="purchaseInvoiceDetailsModal"></div>
            <div id="purchaseInvoiceDetailsModal2"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer tableOverflowContainer2">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product != null ? params.row.product.name : params.row.description;
                                    }
                                },
                                { field: 'price', headerName: i18next.t('unit-price'), width: 150 },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                                { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 }
                            ]}
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

class PurchaseInvoiceDetailsModal extends Component {
    constructor({ detail, invoiceId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addPurchaseInvoiceDetail, deletePurchaseInvoiceDetail,
        locateProduct, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.detail = detail;
        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addPurchaseInvoiceDetail = addPurchaseInvoiceDetail;
        this.deletePurchaseInvoiceDetail = deletePurchaseInvoiceDetail;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;

        this.currentSelectedProductId = detail != null ? detail.product : null;
        this.open = true;
        this.incomeTax = false;
        this.rent = false;

        this.productName = React.createRef();
        this.description = React.createRef();

        this.price = React.createRef();
        this.quantity = React.createRef();
        this.vatPercent = React.createRef();
        this.totalAmount = React.createRef();

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.detail != null) {
                this.refs.incomeTax.checked = this.detail.incomeTax;
                this.refs.rent.checked = this.detail.rent;
            }
        }, 50);

    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.price.current.value = "0";
            this.quantity.current.value = "1";
            this.vatPercent.current.value = window.config.defaultVatPercent;
            this.calcTotalAmount();
        } else {
            this.getOrderDetailsDefaults(this.currentSelectedProductId).then((defaults) => {
                this.price.current.value = defaults.price;
                this.vatPercent.current.value = defaults.vatPercent;
                this.calcTotalAmount();
            });
        }
    }

    calcTotalAmount() {
        const price = parseFloat(this.price.current.value);
        const quantity = parseInt(this.quantity.current.value);
        const vatPercent = parseFloat(this.vatPercent.current.value);

        this.totalAmount.current.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    getOrderDetailFromForm() {
        const detail = {};
        detail.invoiceId = parseInt(this.invoiceId);
        detail.productId = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.price.current.value);
        detail.quantity = parseInt(this.quantity.current.value);
        detail.vatPercent = parseFloat(this.vatPercent.current.value);
        detail.description = this.description.current.value;
        detail.incomeTax = this.refs.incomeTax.checked;
        detail.rent = this.refs.rent.checked;
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        this.addPurchaseInvoiceDetail(detail).then((ok) => {
            if (ok.ok) {
                this.handleClose();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('the-selected-product-is-deactivated')}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('there-is-aleady-a-detail-with-this-product')}
                        />, this.refs.render);
                        break;
                    }
                    case 3: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('cant-add-details-to-a-posted-invoice')}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
            }
        });
    }

    delete() {
        this.deletePurchaseInvoiceDetail(this.detail.id).then((ok) => {
            if (ok.ok) {
                this.handleClose();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('cant-delete-details-in-posted-invoices')}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('the-invoice-deletion-is-completely-disallowed-by-policy')}
                        />, this.refs.render);
                        break;
                    }
                    case 3: {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('it-is-only-allowed-to-delete-the-latest-invoice-of-the-billing-series')}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
            }
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
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

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("purchaseInvoiceDetailsModal2"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.productName.current.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("purchaseInvoiceDetailsModal2"));
    }

    transactionLog() {
        if (this.detail == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseInvoiceDetailsModal2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"purchase_invoice_details"}
            registerId={this.detail.id}
        />,
            document.getElementById('purchaseInvoiceDetailsModal2'));
    }

    async editProduct() {
        if (this.currentSelectedProductId == null) {
            return;
        }

        const commonProps = this.getProductFunctions();
        const product = await commonProps.getProductRow(this.currentSelectedProductId);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitleProduct style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('product')}
            </this.DialogTitleProduct>
            <DialogContent>
                <ProductForm
                    {...commonProps}
                    tabProducts={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    product={product}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    render() {
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('purchase-invoice-detail')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                disabled={this.detail != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}><EditIcon /></button>
                        </div>
                        <TextField label={i18next.t('product')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.productName} defaultValue={this.defaultValueNameProduct} />
                    </div>
                    <div class="form-row mt-3">
                        <div class="col">
                            <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" defaultValue={this.detail != null ? this.detail.description : ''} inputRef={this.description} />
                        </div>
                    </div>

                    <div class="form-row mt-3">
                        <div class="col">
                            <TextField id="price" inputRef={this.price} label={i18next.t('price')} variant="outlined" fullWidth size="small"
                                defaultValue={this.detail != null ? this.detail.price : '0'} type="number"
                                onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null, inputProps: { min: 0 } }} />
                        </div>
                        <div class="col">
                            <TextField id="quantity" inputRef={this.quantity} label={i18next.t('quantity')} variant="outlined" fullWidth size="small"
                                defaultValue={this.detail != null ? this.detail.quantity : '1'} type="number"
                                onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null, inputProps: { min: 1 } }} />
                        </div>
                        <div class="col">
                            <TextField id="vatPercent" inputRef={this.vatPercent} label={i18next.t('vat-percent')} variant="outlined" fullWidth size="small"
                                defaultValue={this.detail != null ? this.detail.vatPercent : window.config.defaultVatPercent} type="number"
                                onChange={this.calcTotalAmount} InputProps={{ readOnly: this.detail != null, inputProps: { min: 0 } }} />
                        </div>
                        <div class="col">
                            <TextField id="totalAmount" inputRef={this.totalAmount} label={i18next.t('total-amount')} variant="outlined" fullWidth size="small"
                                defaultValue={this.detail != null ? this.detail.totalAmount : '0'} type="number" InputProps={{ readOnly: true }} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <div class="custom-control custom-switch mt-2-5-mb-2-5">
                                <input type="checkbox" class="custom-control-input" ref="incomeTax" id="detailIncomeTax"
                                    defaultValue={this.detail != null && this.detail.incomeTax} onChange={() => {
                                        this.incomeTax = !this.incomeTax;
                                    }} disabled={this.detail != null} />
                                <label class="custom-control-label" htmlFor="detailIncomeTax">{i18next.t('income-tax')}</label>
                            </div>
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch mt-2-5-mb-2-5">
                                <input type="checkbox" class="custom-control-input" ref="rent" id="detailRent"
                                    defaultValue={this.detail != null && this.detail.rent} onChange={() => {
                                        this.rent = !this.rent;
                                    }} disabled={this.detail != null} />
                                <label class="custom-control-label" htmlFor="detailRent">{i18next.t('rent')}</label>
                            </div>
                        </div>
                        <div class="col">
                        </div>
                        <div class="col">
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.detail != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>
                    {this.detail != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.detail == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
}

export default PurchaseInvoiceDetails;
