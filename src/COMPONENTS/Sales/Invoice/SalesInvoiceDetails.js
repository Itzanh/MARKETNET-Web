import { Component } from "react";
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
import ProductForm from "../../Masters/Products/ProductForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';



class SalesInvoiceDetails extends Component {
    constructor({ invoiceId, findProductByName, getOrderDetailsDefaults, getSalesInvoiceDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail,
        locateProduct, addNow, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesInvoiceDetails = getSalesInvoiceDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
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

        this.printSalesInvoiceDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printSalesInvoiceDetails() {
        this.getSalesInvoiceDetails(this.invoiceId).then((details) => {
            this.renderSalesInvoiceDetails(details);
        });
    }

    renderSalesInvoiceDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        if (this.invoiceId == null) {
            this.addSalesInvoiceDetail();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                addSalesInvoiceDetail={(detail) => {
                    const promise = this.addSalesInvoiceDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal'));
        ReactDOM.render(
            <SalesInvoiceDetailsModal
                detail={detail}
                invoiceId={this.invoiceId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                locateProduct={this.locateProduct}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getProductFunctions={this.getProductFunctions}
                deleteSalesInvoiceDetail={(detailId) => {
                    const promise = this.deleteSalesInvoiceDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesInvoiceDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('saleInvoiceDetailsModal'));
    }

    render() {
        return <div id="salesInvoiceDetails">
            <div id="saleInvoiceDetailsModal"></div>
            <div id="saleInvoiceDetailsModal2"></div>
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
                                        return params.row.product != null ? params.row.productName : params.row.description;
                                    }
                                },
                                { field: 'price', headerName: i18next.t('price'), width: 150 },
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

class SalesInvoiceDetailsModal extends Component {
    constructor({ detail, invoiceId, findProductByName, getOrderDetailsDefaults, defaultValueNameProduct, addSalesInvoiceDetail, deleteSalesInvoiceDetail,
        locateProduct, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.detail = detail;
        this.invoiceId = invoiceId;
        this.findProductByName = findProductByName;

        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;

        this.currentSelectedProductId = detail != null ? detail.product : 0;
        this.open = true;

        this.productDefaults = this.productDefaults.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    productDefaults() {
        if (this.currentSelectedProductId == null) {
            this.refs.price.value = "0";
            this.refs.quantity.value = "1";
            this.refs.vatPercent.value = window.config.defaultVatPercent;
            this.calcTotalAmount();
        } else {
            this.getOrderDetailsDefaults(this.currentSelectedProductId).then((defaults) => {
                this.refs.price.value = defaults.price;
                this.refs.vatPercent.value = defaults.vatPercent;
                this.calcTotalAmount();
            });
        }
    }

    calcTotalAmount() {
        const price = parseFloat(this.refs.price.value);
        const quantity = parseInt(this.refs.quantity.value);
        const vatPercent = parseFloat(this.refs.vatPercent.value);

        this.refs.totalAmount.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    getOrderDetailFromForm() {
        const detail = {};
        detail.invoice = parseInt(this.invoiceId);
        detail.product = parseInt(this.currentSelectedProductId);
        detail.price = parseFloat(this.refs.price.value);
        detail.quantity = parseInt(this.refs.quantity.value);
        detail.vatPercent = parseFloat(this.refs.vatPercent.value);
        detail.description = this.refs.description.value;
        return detail;
    }

    add() {
        const detail = this.getOrderDetailFromForm();

        if ((detail.product == 0 || detail.product == null) && (detail.description.length == 0)) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-specify-a-product-or-write-a-description')}
            />, this.refs.render);
            return;
        }
        if (detail.description.length > 150) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('the-description-cant-be-longer-than-150-characters')}
            />, this.refs.render);
            return;
        }

        this.addSalesInvoiceDetail(detail).then((ok) => {
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
        this.deleteSalesInvoiceDetail(this.detail.id).then((ok) => {
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
        ReactDOM.unmountComponentAtNode(document.getElementById("saleInvoiceDetailsModal2"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
                this.productDefaults();
            }}
        />, document.getElementById("saleInvoiceDetailsModal2"));
    }

    transactionLog() {
        if (this.detail == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('saleInvoiceDetailsModal2'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"sales_invoice_detail"}
            registerId={this.detail.id}
        />,
            document.getElementById('saleInvoiceDetailsModal2'));
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
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('sale-invoice-detail')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('product')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                disabled={this.detail != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}><EditIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                            readOnly={true} style={{ 'width': '70%' }} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('description')}</label>
                            <input type="text" class="form-control" ref="description" defaultValue={this.detail != null ? this.detail.description : ''}
                                readOnly={this.detail != null} />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('price')}</label>
                            <input type="number" class="form-control" ref="price" defaultValue={this.detail != null ? this.detail.price : '0'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('quantity')}</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue={this.detail != null ? this.detail.quantity : '1'}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-percent')}</label>
                            <input type="number" class="form-control" ref="vatPercent"
                                defaultValue={this.detail != null ? this.detail.vatPercent : window.config.defaultVatPercent}
                                onChange={this.calcTotalAmount} readOnly={this.detail != null} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('total-amount')}</label>
                            <input type="number" class="form-control" ref="totalAmount" defaultValue={this.detail != null ? this.detail.totalAmount : '0'}
                                readOnly={true} />
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

export default SalesInvoiceDetails;
